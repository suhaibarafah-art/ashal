/**
 * TITAN-10 | Agent 1 — Scout
 * Runs at 06:00 AM via cron.
 * Fetches products from CJ Dropshipping → pushes to AgentTaskQueue (PENDING_CRITIC).
 * Falls back to simulation when CJ is unavailable.
 * Skips duplicates (by cjProductId).
 */

import { prisma } from '@/lib/prisma';
import { cjFetch } from '@/lib/cj';
import { notifyCritical } from './ceo';

const SEARCH_KEYWORDS = [
  'smart home', 'wireless charger', 'led desk lamp',
  'car organizer', 'kitchen gadget', 'phone stand',
  'bluetooth earbuds', 'portable fan',
];

interface CJRawProduct {
  pid:             string;
  productNameEn?:  string;
  productName?:    string;
  productImage?:   string;
  productImageSet?: string[];
  sellPrice?:      number;
  sourcePrice?:    number;
  shippingPrice?:  number;
  inventory?:      number;
}

async function fetchCJProducts(keyword: string): Promise<CJRawProduct[]> {
  const res  = await cjFetch(`/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=5`);
  if (res.status === 401) return []; // token expired — fallback will handle
  const data = await res.json();
  return (data?.data?.list ?? data?.result?.list ?? []) as CJRawProduct[];
}

function getSimulationProducts(): CJRawProduct[] {
  return [
    { pid: `sim-${Date.now()}-1`, productNameEn: 'Premium Smart Watch Series X', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', sellPrice: 45, shippingPrice: 8 },
    { pid: `sim-${Date.now()}-2`, productNameEn: 'Luxury Gold Wireless Earbuds Pro', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', sellPrice: 38, shippingPrice: 10 },
    { pid: `sim-${Date.now()}-3`, productNameEn: 'Designer Leather Wallet RFID Block', productImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', sellPrice: 28, shippingPrice: 6 },
    { pid: `sim-${Date.now()}-4`, productNameEn: 'Crystal Glass Desk Lamp Dimmable', productImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', sellPrice: 55, shippingPrice: 12 },
    { pid: `sim-${Date.now()}-5`, productNameEn: 'Portable Perfume Atomizer Refillable', productImage: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800', sellPrice: 18, shippingPrice: 5 },
  ];
}

export async function runScout(): Promise<{ queued: number; skipped: number }> {
  let queued = 0;
  let skipped = 0;
  let cjWorking = false;

  // Try fetching from CJ
  for (const keyword of SEARCH_KEYWORDS) {
    try {
      const items = await fetchCJProducts(keyword);

      if (items.length > 0) cjWorking = true;

      for (const p of items) {
        if (!p.pid || !p.productImage) { skipped++; continue; }

        const exists = await prisma.agentTaskQueue.findFirst({ where: { cjProductId: p.pid } });
        if (exists) { skipped++; continue; }

        const liveExists = await prisma.product.findFirst({ where: { supplierSku: p.pid } });
        if (liveExists) { skipped++; continue; }

        const baseCost     = Number(p.sellPrice ?? p.sourcePrice ?? 0);
        const shippingCost = Number(p.shippingPrice ?? 15);
        const titleEn      = String(p.productNameEn ?? p.productName ?? '').slice(0, 200);
        const imageUrl     = String(p.productImageSet?.[0] ?? p.productImage ?? '');

        if (!titleEn || baseCost <= 0) { skipped++; continue; }

        await prisma.agentTaskQueue.create({
          data: { cjProductId: p.pid, titleEn, imageUrl, baseCost, shippingCost, status: 'PENDING_CRITIC', agentNotes: `CJ: ${keyword}` },
        });
        queued++;
      }
    } catch { skipped++; }
  }

  // Simulation fallback when CJ returns nothing
  if (!cjWorking) {
    const simItems = getSimulationProducts();
    for (const p of simItems) {
      const exists = await prisma.agentTaskQueue.findFirst({ where: { cjProductId: p.pid } });
      if (exists) { skipped++; continue; }
      await prisma.agentTaskQueue.create({
        data: {
          cjProductId: p.pid,
          titleEn: p.productNameEn ?? '',
          imageUrl: p.productImage ?? '',
          baseCost: p.sellPrice ?? 30,
          shippingCost: p.shippingPrice ?? 10,
          status: 'PENDING_CRITIC',
          agentNotes: 'SIMULATION',
        },
      });
      queued++;
    }
  }

  await prisma.systemLog.create({
    data: {
      level: 'SUCCESS',
      source: 'agent/scout',
      message: `Scout complete: ${queued} queued, ${skipped} skipped (CJ: ${cjWorking ? 'live' : 'sim'})`,
      metadata: JSON.stringify({ queued, skipped, cjWorking }),
    },
  }).catch(() => {});

  return { queued, skipped };
}
