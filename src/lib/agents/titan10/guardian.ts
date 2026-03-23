/**
 * TITAN-10 | Agent 8 — Guardian
 * Runs every 6 hours.
 * Checks live stock for every active product with a supplierSku (cjProductId).
 * If CJ reports stock == 0 → set product.isHidden = true.
 * If stock > 0 and product is hidden → restore it.
 */

import { prisma } from '@/lib/prisma';
import { cjFetch } from '@/lib/cj';
import { notifyCritical } from './ceo';
import { sendTelegramAlert } from '@/lib/telegram';

async function fetchCJStock(pid: string): Promise<number> {
  const res  = await cjFetch(`/product/query?pid=${pid}`);
  const data = await res.json();
  return Number(data?.data?.inventory ?? data?.data?.stock ?? -1);
}

export async function runGuardian(): Promise<{ hidden: number; restored: number; checked: number }> {
  let hidden = 0;
  let restored = 0;
  let checked = 0;

  // Only check products that came from CJ (have supplierSku)
  const products = await prisma.product.findMany({
    where: { supplier: 'cj', supplierSku: { not: '' } },
    select: { id: true, titleAr: true, supplierSku: true, isHidden: true },
  });

  if (products.length === 0) return { hidden: 0, restored: 0, checked: 0 };

  for (const product of products) {
    try {
      const stock = await fetchCJStock(product.supplierSku);
      checked++;

      if (stock === 0 && !product.isHidden) {
        await prisma.product.update({
          where: { id: product.id },
          data: { isHidden: true, stockLevel: 0 },
        });
        await sendTelegramAlert('CRITICAL',
          `🛑 Guardian: منتج نفذ من المخزن\n\n📦 ${product.titleAr}\n🏭 CJ ID: ${product.supplierSku}\n\nتم إخفاؤه تلقائياً.`
        );
        hidden++;
      } else if (stock > 0 && product.isHidden) {
        await prisma.product.update({
          where: { id: product.id },
          data: { isHidden: false, stockLevel: stock },
        });
        restored++;
      } else if (stock > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { stockLevel: stock },
        });
      }
    } catch {
      /* skip individual product errors */
    }
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/guardian',
      message: `Guardian: ${checked} checked, ${hidden} hidden, ${restored} restored`,
      metadata: JSON.stringify({ checked, hidden, restored }),
    },
  });

  return { hidden, restored, checked };
}
