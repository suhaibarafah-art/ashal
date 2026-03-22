/**
 * Empire Engine — GET /api/webhooks/empire-engine
 * Safe dynamic pricing + white-label radar.
 * Can be triggered manually; also called by master cron.
 *
 * Safety: price NEVER drops below (baseCost + shippingCost) × 1.20 (20% min margin).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { orders: { select: { id: true } } },
    });

    let adjustments = 0, whiteLabelAlerts = 0;

    for (const product of products) {
      // White-label alert at 100+ orders (every 50 threshold)
      if (product.orders.length > 0 && product.orders.length % 100 === 0) {
        await sendTelegramAlert('SUCCESS',
          `🏷️ White-Label Radar\n\n📦 ${product.titleAr}\n📊 ${product.orders.length} طلب\nحان وقت الطلب بالجملة وطباعة البراند!`
        );
        whiteLabelAlerts++;
      }

      // Safe dynamic pricing: simulate competitor 3% cheaper, undercut by 1 SAR
      // Only if we stay above 20% margin floor
      const minAllowed    = (product.baseCost + product.shippingCost) * 1.20;
      const simulatedComp = product.finalPrice * 0.97;
      const proposed      = parseFloat((simulatedComp - 1).toFixed(2));

      if (proposed > minAllowed && proposed < product.finalPrice) {
        await prisma.product.update({ where: { id: product.id }, data: { finalPrice: proposed } });
        await prisma.systemLog.create({
          data: {
            level: 'INFO',
            source: 'webhook/empire-engine',
            message: `Price: ${product.titleEn} ${product.finalPrice.toFixed(2)} → ${proposed} SAR (margin: ${(((proposed - product.baseCost - product.shippingCost) / proposed) * 100).toFixed(1)}%)`,
          },
        });
        adjustments++;
      }
    }

    return NextResponse.json({ success: true, adjustments, whiteLabelAlerts });
  } catch (error) {
    await prisma.systemLog.create({ data: { level: 'ERROR', source: 'webhook/empire-engine', message: String(error) } }).catch(() => {});
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
