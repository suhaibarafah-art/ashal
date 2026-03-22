/**
 * TITAN-10 | Agent 6 — Orders Sync
 * Runs every 4 hours.
 * For each order in FULFILLING status:
 *   - Queries CJ for tracking ID by order reference
 *   - Updates order.trackingNumber in DB
 *   - Advances status to SHIPPED if tracking obtained
 */

import { prisma } from '@/lib/prisma';
import { notifyCritical } from './ceo';
import { sendTelegramAlert } from '@/lib/telegram';

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

async function getCJToken(): Promise<string> {
  const stored = process.env.CJ_ACCESS_TOKEN;
  if (stored) return stored;
  const res  = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.CJ_EMAIL ?? '', password: process.env.CJ_PASSWORD ?? '' }),
  });
  const data = await res.json();
  const token: string = data?.data?.accessToken ?? '';
  if (!token) throw new Error('CJ auth failed in Orders sync');
  return token;
}

async function fetchCJTracking(token: string, orderId: string): Promise<string | null> {
  // CJ order query by our internal order ID stored in metadata
  const res  = await fetch(
    `${CJ_BASE}/order/getOrderDetail?orderId=${encodeURIComponent(orderId)}`,
    { headers: { 'CJ-Access-Token': token } }
  );
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

  let token: string;
  try {
    token = await getCJToken();
  } catch (err) {
    await notifyCritical('Orders/CJ', 'Cannot authenticate to CJ for tracking sync', err);
    return { synced: 0, failed: orders.length };
  }

  for (const order of orders) {
    try {
      const tracking = await fetchCJTracking(token, order.id);
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
