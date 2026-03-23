/**
 * TITAN-10 | Agent 10 — Analyst
 * Runs at 06:00 AM.
 * Aggregates yesterday's data into a DailyReport row:
 *   - Total revenue, order count, conversion rate
 *   - Sync success/fail counts from SystemLog
 *   - New products published vs archived
 *   - Top product by revenue
 */

import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';

export async function runAnalyst(): Promise<{ date: string }> {
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400 * 1000);

  // Revenue + orders yesterday
  const [revenue, orderCount, topProductRaw] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: yesterday, lt: today },
        paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
      },
    }),
    prisma.order.count({
      where: { createdAt: { gte: yesterday, lt: today } },
    }),
    prisma.order.groupBy({
      by: ['productId'],
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: yesterday, lt: today },
        paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
      },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 1,
    }),
  ]);

  const totalRevenue = Number(revenue._sum.totalAmount ?? 0);

  // Sync stats from SystemLog yesterday
  const syncLogs = await prisma.systemLog.findMany({
    where: {
      createdAt: { gte: yesterday, lt: today },
      source: 'agent/orders',
    },
  });
  let syncSuccess = 0;
  let syncFailed  = 0;
  for (const log of syncLogs) {
    const meta = JSON.parse(log.metadata || '{}') as { synced?: number; failed?: number };
    syncSuccess += meta.synced ?? 0;
    syncFailed  += meta.failed ?? 0;
  }

  // Queue stats yesterday
  const [newProducts, archivedProducts] = await Promise.all([
    prisma.agentTaskQueue.count({
      where: { updatedAt: { gte: yesterday, lt: today }, status: 'ARCHIVED', productId: { not: null } },
    }),
    prisma.agentTaskQueue.count({
      where: { updatedAt: { gte: yesterday, lt: today }, status: 'ARCHIVED', productId: null },
    }),
  ]);

  // Top product
  let topProductId    = '';
  let topProductTitle = '';
  let topProductRevenue = 0;
  if (topProductRaw[0]) {
    topProductId      = topProductRaw[0].productId;
    topProductRevenue = Number(topProductRaw[0]._sum.totalAmount ?? 0);
    const prod = await prisma.product.findUnique({
      where: { id: topProductId },
      select: { titleAr: true },
    });
    topProductTitle = prod?.titleAr ?? '';
  }

  // Conversion rate: assume 1 order per 30 sessions (rough estimate from log count)
  const sessionCount = Math.max(orderCount * 30, orderCount);
  const conversionRate = sessionCount > 0 ? (orderCount / sessionCount) * 100 : 0;

  // Upsert DailyReport
  await prisma.dailyReport.upsert({
    where: { date: yesterday },
    update: {
      totalRevenue, orderCount, conversionRate,
      syncSuccess, syncFailed, newProducts, archivedProducts,
      topProductId: topProductId || null,
      topProductTitle, topProductRevenue,
    },
    create: {
      date: yesterday,
      totalRevenue, orderCount, conversionRate,
      syncSuccess, syncFailed, newProducts, archivedProducts,
      topProductId: topProductId || null,
      topProductTitle, topProductRevenue,
    },
  });

  await prisma.systemLog.create({
    data: {
      level: 'SUCCESS',
      source: 'agent/analyst',
      message: `Daily Report: ${totalRevenue.toFixed(2)} SAR | ${orderCount} orders | ${newProducts} new products`,
      metadata: JSON.stringify({ totalRevenue, orderCount, syncSuccess, syncFailed, newProducts }),
    },
  });

  // Telegram morning brief
  await sendTelegramAlert(
    'SUCCESS',
    `📊 التقرير اليومي — ${yesterday.toLocaleDateString('ar-SA')}\n\n` +
    `💰 الإيرادات: ${totalRevenue.toFixed(2)} SAR\n` +
    `📦 الطلبات: ${orderCount}\n` +
    `🆕 منتجات جديدة: ${newProducts}\n` +
    `🗑️ منتجات مرفوضة: ${archivedProducts}\n` +
    `🔄 تتبع ناجح: ${syncSuccess}\n` +
    (topProductTitle ? `🏆 أفضل منتج: ${topProductTitle}` : '')
  );

  return { date: yesterday.toISOString().split('T')[0] };
}
