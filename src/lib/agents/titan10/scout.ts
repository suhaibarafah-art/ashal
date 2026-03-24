/**
 * TITAN-10 | Agent 1 — Scout
 * Runs at 06:00 AM via cron.
 * Fetches products from CJ Dropshipping → pushes to AgentTaskQueue (PENDING_CRITIC).
 * Skips duplicates (by cjProductId).
 */

import { prisma } from '@/lib/prisma';
import { notifyCritical } from './ceo';

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

const SEARCH_KEYWORDS = [
  'luxury leather wallet', 'wireless charger fast',
  'smart home device', 'led desk lamp',
  'bluetooth earbuds premium', 'phone stand desk',
  'car organizer luxury', 'portable fan mini',
  'smartwatch band', 'kitchen gadget stainless',
  'rfid card holder', 'perfume diffuser',
];

async function getCJToken(): Promise<string> {
  const stored = process.env.CJ_ACCESS_TOKEN;
  if (stored) return stored;

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email:    process.env.CJ_EMAIL    ?? '',
      password: process.env.CJ_PASSWORD ?? '',
    }),
  });
  const data = await res.json();
  const token: string = data?.data?.accessToken ?? '';
  if (!token) throw new Error('CJ auth failed — check CJ_ACCESS_TOKEN or CJ_EMAIL/CJ_PASSWORD');
  return token;
}

async function fetchCJProducts(token: string, keyword: string): Promise<CJRawProduct[]> {
  const res = await fetch(
    `${CJ_BASE}/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=5`,
    { headers: { 'CJ-Access-Token': token } }
  );
  const data = await res.json();
  return (data?.data?.list ?? []) as CJRawProduct[];
}

interface CJRawProduct {
  pid:              string;
  productNameEn?:   string;
  productName?:     string;
  productImage?:    string;
  productImageSet?: string[];
  sellPrice?:       number;
  sourcePrice?:     number;
  shippingPrice?:   number;
  inventory?:       number;
  productUnit?:     string;
  categoryId?:      string;
  categoryName?:    string;
}

export async function runScout(): Promise<{ queued: number; skipped: number }> {
  let queued = 0;
  let skipped = 0;

  try {
    const token = await getCJToken();

    for (const keyword of SEARCH_KEYWORDS) {
      try {
        const items = await fetchCJProducts(token, keyword);

        for (const p of items) {
          if (!p.pid || !p.productImage) { skipped++; continue; }

          // Skip duplicates
          const exists = await prisma.agentTaskQueue.findFirst({
            where: { cjProductId: p.pid },
          });
          if (exists) { skipped++; continue; }

          // Also skip if product is already live
          const liveExists = await prisma.product.findFirst({
            where: { supplierSku: p.pid },
          });
          if (liveExists) { skipped++; continue; }

          const baseCost     = Number(p.sellPrice ?? p.sourcePrice ?? 0);
          const shippingCost = Number(p.shippingPrice ?? 15);
          const titleEn      = String(p.productNameEn ?? p.productName ?? '').slice(0, 200);
          // Prefer first image from set; fall back to single productImage
          const imageUrl     = String(p.productImageSet?.[0] ?? p.productImage ?? '');
          const stockLevel   = Number(p.inventory ?? 50); // default 50 if CJ doesn't return inventory

          if (!titleEn || baseCost <= 0) { skipped++; continue; }

          await prisma.agentTaskQueue.create({
            data: {
              cjProductId:  p.pid,
              titleEn,
              imageUrl,
              baseCost,
              shippingCost,
              status: 'PENDING_CRITIC',
              // Encode stock + keyword in agentNotes as JSON for CEO to use when publishing
              agentNotes: JSON.stringify({ keyword, stockLevel }),
            },
          });
          queued++;
        }
      } catch (err) {
        // log but continue with next keyword
        await prisma.systemLog.create({
          data: {
            level: 'WARN',
            source: 'agent/scout',
            message: `keyword "${keyword}" failed: ${String(err).slice(0, 200)}`,
            metadata: '{}',
          },
        });
      }
    }

    await prisma.systemLog.create({
      data: {
        level: 'SUCCESS',
        source: 'agent/scout',
        message: `Scout complete: ${queued} queued, ${skipped} skipped`,
        metadata: JSON.stringify({ queued, skipped }),
      },
    });
  } catch (err) {
    await notifyCritical('Scout/CJ', 'CJ auth or fetch failed', err);
    throw err;
  }

  return { queued, skipped };
}
