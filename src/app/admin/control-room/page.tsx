import { prisma } from '@/lib/prisma';
import ControlRoomClient from './ControlRoomClient';

export const dynamic = 'force-dynamic';

export default async function ControlRoomPage() {
  const since24h = new Date(Date.now() - 86_400 * 1000);

  const [
    activeProducts,
    totalProducts,
    recentSuccessLogs,
    recentPaidOrders,
    recentActivity,
  ] = await Promise.all([
    prisma.product.count({ where: { isHidden: false, stockLevel: { gt: 0 } } }),
    prisma.product.count(),
    prisma.systemLog.findMany({
      where: { level: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, source: true, message: true, createdAt: true, level: true },
    }),
    prisma.order.count({
      where: {
        paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] },
      },
    }),
    prisma.systemLog.count({ where: { createdAt: { gte: since24h } } }),
  ]);

  const statusData = {
    // Inventory: green if at least 1 product is in-stock and visible
    inventory: activeProducts > 0,
    // Content: green if any products exist in the store
    content: totalProducts > 0,
    // Finance: green if Moyasar live key is configured
    finance: !!(process.env.MOYASAR_API_KEY?.startsWith('sk_live_')),
    // Operations: green if the system logged any activity in last 24h
    operations: recentActivity > 0,
  };

  // Serialize Date objects → strings for client component
  const heartbeatLogs = recentSuccessLogs.map(log => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return <ControlRoomClient statusData={statusData} heartbeatLogs={heartbeatLogs} />;
}
