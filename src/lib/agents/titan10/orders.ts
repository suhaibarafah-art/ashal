/**
 * TITAN-10 | Agent 6 — Orders Sync
 * Runs every 4 hours.
 * For each order in FULFILLING status:
 *   - Queries CJ for tracking ID by order reference
 *   - Updates order.trackingNumber in DB
 *   - Advances status to SHIPPED if tracking obtained
 */

import { prisma } from '@/lib/prisma';
import { cjFetch } from '@/lib/cj';
import { notifyCritical } from './ceo';
import { sendTelegramAlert } from '@/lib/telegram';

async function fetchCJTracking(orderId: string): Promise<string | null> {
  const res  = await cjFetch(`/order/getOrderDetail?orderId=${encodeURIComponent(orderId)}`);
  const data = await res.json();
  const trackNo: string = data?.data?.trackNumber ?? data?.data?.logisticsTrackNo ?? '';
  return trackNo || null;
}

export async function runOrdersSync(): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'FULFILLING', trackingNumber: '' },
    select: { id: true, customerName: true, customerPhone: true },
    take: 30,
  });

  if (orders.length === 0) return { synced: 0, failed: 0 };

  for (const order of orders) {
    try {
      const tracking = await fetchCJTracking(order.id);
      if (tracking) {
        await prisma.order.update({
          where: { id: order.id },
          data: { trackingNumber: tracking, paymentStatus: 'SHIPPED', updatedAt: new Date() },
        });

        await sendTelegramAlert('SUCCESS',
          `📦 شحنة جديدة\nطلب: ${order.id.slice(-8).toUpperCase()}\n📍 رقم التتبع: ${tracking}`
        );
        synced++;
      }
    } catch {
      failed++;
    }
  }

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'agent/orders',
      message: `Orders sync: ${synced} tracking IDs obtained, ${failed} failed`,
      metadata: JSON.stringify({ synced, failed, total: orders.length }),
    },
  });

  return { synced, failed };
}
