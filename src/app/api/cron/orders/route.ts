/**
 * Order Lifecycle Cron — GET /api/cron/orders
 * Progresses all orders through their statuses automatically.
 * Can be called anytime (manual trigger or from master cron).
 *
 * Transitions:
 *  PENDING_COD          → PAID → automation (CJ + tracking)
 *  PENDING > 2h         → FAILED  (abandoned payment)
 *  PENDING_TABBY/TAMARA > 2h → FAILED
 *  PAID_AND_ORDERED > 6h → FULFILLING
 *  FULFILLING > 3d      → SHIPPED
 *  SHIPPED > 7d         → DELIVERED
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processOrderAutomation } from '@/lib/order-automation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') ?? '';
    const key  = req.headers.get('x-admin-key') ?? '';
    if (auth !== `Bearer ${secret}` && key !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const now = Date.now();
  const stats = { codFixed: 0, pendingExpired: 0, toFulfilling: 0, toShipped: 0, toDelivered: 0 };

  // 1. PENDING_COD → PAID + automation
  const codOrders = await prisma.order.findMany({
    where: { paymentStatus: 'PENDING_COD' },
  });
  for (const o of codOrders) {
    await prisma.order.update({ where: { id: o.id }, data: { paymentStatus: 'PAID', updatedAt: new Date() } });
    processOrderAutomation(o.id).catch(() => {});
    stats.codFixed++;
  }

  // 2. PENDING / PENDING_TABBY / PENDING_TAMARA > 2h → FAILED
  const twoHoursAgo = new Date(now - 2 * 3_600_000);
  const expired = await prisma.order.updateMany({
    where: {
      paymentStatus: { in: ['PENDING', 'PENDING_TABBY', 'PENDING_TAMARA'] },
      createdAt: { lt: twoHoursAgo },
    },
    data: { paymentStatus: 'FAILED', updatedAt: new Date() },
  });
  stats.pendingExpired = expired.count;

  // 3. PAID_AND_ORDERED > 6h → FULFILLING
  const sixHoursAgo = new Date(now - 6 * 3_600_000);
  const fulfilling = await prisma.order.updateMany({
    where: { paymentStatus: 'PAID_AND_ORDERED', updatedAt: { lt: sixHoursAgo } },
    data: { paymentStatus: 'FULFILLING', updatedAt: new Date() },
  });
  stats.toFulfilling = fulfilling.count;

  // 4. FULFILLING > 3d → SHIPPED
  const threeDaysAgo = new Date(now - 3 * 86_400_000);
  const shipped = await prisma.order.updateMany({
    where: { paymentStatus: 'FULFILLING', updatedAt: { lt: threeDaysAgo } },
    data: { paymentStatus: 'SHIPPED', updatedAt: new Date() },
  });
  stats.toShipped = shipped.count;

  // 5. SHIPPED > 7d → DELIVERED
  const sevenDaysAgo = new Date(now - 7 * 86_400_000);
  const delivered = await prisma.order.updateMany({
    where: { paymentStatus: 'SHIPPED', updatedAt: { lt: sevenDaysAgo } },
    data: { paymentStatus: 'DELIVERED', updatedAt: new Date() },
  });
  stats.toDelivered = delivered.count;

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'cron/orders',
      message: `Order lifecycle: COD→${stats.codFixed} | expired→${stats.pendingExpired} | fulfilling→${stats.toFulfilling} | shipped→${stats.toShipped} | delivered→${stats.toDelivered}`,
      metadata: JSON.stringify(stats),
    },
  }).catch(() => {});

  return NextResponse.json({ success: true, stats });
}
