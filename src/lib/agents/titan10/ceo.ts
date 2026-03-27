/**
 * TITAN-10 | Agent 5 — CEO
 * - Publishes READY_TO_PUBLISH queue entries to the live Product table
 * - Sends Telegram: "CEO: New Product Live 🟢 | Margin: X% | Ad Copy Ready"
 * - Handles CRITICAL error alerts for any agent failure
 */

import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';
import { calculateLuxuryPrice } from '@/lib/pricing-engine';
import { detectCategory } from './category';

export async function runCEO(): Promise<{ published: number; errors: number }> {
  let published = 0;
  let errors = 0;

  const readyItems = await prisma.agentTaskQueue.findMany({
    where: { status: 'READY_TO_PUBLISH' },
    take: 10,
  });

  for (const item of readyItems) {
    try {
      const finalPrice = calculateLuxuryPrice(item.baseCost, item.shippingCost);

      // Parse stockLevel encoded by Scout in agentNotes JSON
      let stockLevel = 50; // sensible default
      try {
        const notes = JSON.parse(item.agentNotes);
        if (typeof notes?.stockLevel === 'number') stockLevel = notes.stockLevel;
      } catch { /* agentNotes may not be JSON — keep default */ }

      // Detect product category from English title
      const category = detectCategory(item.titleEn);

      // Upsert into Product table
      const product = await prisma.product.upsert({
        where: { titleEn: item.titleEn },
        update: {
          titleAr:      item.titleAr || item.titleEn,
          descAr:       item.descAr,
          imageUrl:     item.imageUrl,
          finalPrice,
          baseCost:     item.baseCost,
          shippingCost: item.shippingCost,
          marginPct:    item.marginPct,
          adCopyTikTok: item.adCopyTikTok,
          adCopySnap:   item.adCopySnap,
          adCopyIG:     item.adCopyIG,
          supplierSku:  item.cjProductId,
          supplier:     'cj',
          category,
          stockLevel,
          isHidden:     false,
        },
        create: {
          titleEn:      item.titleEn,
          titleAr:      item.titleAr || item.titleEn,
          descAr:       item.descAr || item.titleAr || item.titleEn,
          imageUrl:     item.imageUrl,
          finalPrice,
          baseCost:     item.baseCost,
          shippingCost: item.shippingCost,
          marginPct:    item.marginPct,
          adCopyTikTok: item.adCopyTikTok,
          adCopySnap:   item.adCopySnap,
          adCopyIG:     item.adCopyIG,
          supplierSku:  item.cjProductId,
          supplier:     'cj',
          category,
          stockLevel,
          isHidden:     false,
        },
      });

      // Link queue entry to product + mark ARCHIVED
      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: { status: 'ARCHIVED', productId: product.id, agentNotes: 'Published by CEO' },
      });

      await prisma.systemLog.create({
        data: {
          level: 'SUCCESS',
          source: 'agent/ceo',
          message: `Product published: ${item.titleEn} | Margin: ${item.marginPct.toFixed(1)}% | Price: ${finalPrice} SAR`,
          metadata: JSON.stringify({ productId: product.id, cjProductId: item.cjProductId }),
        },
      });

      // Telegram: "CEO: New Product Live 🟢"
      await sendTelegramAlert(
        'SUCCESS',
        `CEO: منتج جديد حي 🟢\n\n📦 ${item.titleAr || item.titleEn}\n💰 السعر: ${finalPrice} SAR\n📈 الهامش: ${item.marginPct.toFixed(1)}%\n\n📱 TikTok: ${item.adCopyTikTok.slice(0, 80)}...`
      );

      published++;
    } catch (err) {
      errors++;
      await sendTelegramAlert('CRITICAL', `CEO/publish خطأ: ${item.titleEn ?? 'unknown'} — ${String(err)}`);
      await prisma.agentTaskQueue.update({
        where: { id: item.id },
        data: { errorLog: String(err) },
      });
    }
  }

  return { published, errors };
}

// re-export for backward compat — actual impl lives in alerts.ts
export { notifyCritical } from './alerts';
