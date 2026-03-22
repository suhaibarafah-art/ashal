/**
 * TITAN-10 | Agent 1 — Scout
 * Runs at 06:00 AM via cron.
 * Fetches products from CJ Dropshipping → pushes to AgentTaskQueue (PENDING_CRITIC).
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

async function fetchCJProducts(keyword: string): Promise<CJRawProduct[]> {
  const res  = await cjFetch(`/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=5`);
  const data = await res.json();
  return (data?.data?.list ?? []) as CJRawProduct[];
}

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

export async function runScout(): Promise<{ queued: number; skipped: number }> {
  let queued = 0;
  let skipped = 0;

  try {
    for (const keyword of SEARCH_KEYWORDS) {
      try {
        const items = await fetchCJProducts(keyword);

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
          const imageUrl     = String(p.productImageSet?.[0] ?? p.productImage ?? '');

          if (!titleEn || baseCost <= 0) { skipped++; continue; }

          await prisma.agentTaskQueue.create({
            data: {
              cjProductId:  p.pid,
              titleEn,
              imageUrl,
              baseCost,
              shippingCost,
              status: 'PENDING_CRITIC',
              agentNotes: `keyword: ${keyword}`,
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
