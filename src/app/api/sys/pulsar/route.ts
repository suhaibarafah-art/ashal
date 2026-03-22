/**
 * GET /api/sys/pulsar
 * System heartbeat — returns live DB stats for the monitor page.
 * Used by /admin/monitor every 30s.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const since24h = new Date(now.getTime() - 86400 * 1000);

    const [
      totalOrders,
      ordersToday,
      revenue24h,
      revenueTotal,
      productCount,
      lastOrder,
      recentLogs,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: since24h } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: since24h },
          paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
        },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] } },
      }),
      prisma.product.count(),
      prisma.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true, customerCity: true } }),
      prisma.systemLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { level: true, message: true, source: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      status: 'HEARTBEAT_ACTIVE',
      checkedAt: now.toISOString(),
      db: 'CONNECTED',
      stats: {
        totalOrders,
        ordersToday,
        revenue24h: Number(revenue24h._sum.totalAmount ?? 0).toFixed(2),
        revenueTotal: Number(revenueTotal._sum.totalAmount ?? 0).toFixed(2),
        productCount,
        lastOrderAt: lastOrder?.createdAt?.toISOString() ?? null,
        lastOrderCity: lastOrder?.customerCity ?? null,
      },
      recentLogs,
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'DB_ERROR', error: String(err), checkedAt: new Date().toISOString() },
      { status: 503 }
    );
  }
}
