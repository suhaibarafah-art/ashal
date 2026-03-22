import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * Admin Dashboard — Phase 3: Orange/Blue + Live DB Data
 */
export default async function AdminPage() {
  const [orderCount, productCount, recentOrders, recentLogs] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { product: true } }),
    prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] } },
  });
  const totalRevenue = revenue._sum.totalAmount ?? 0;

  const kpis = [
    { label: 'إجمالي الإيرادات', value: `${totalRevenue.toFixed(2)} SAR`, color: 'kpi-orange', icon: '💰' },
    { label: 'عدد الطلبات', value: String(orderCount), color: 'kpi-blue', icon: '📦' },
    { label: 'المنتجات', value: String(productCount), color: 'kpi-mustard', icon: '🛍️' },
    { label: 'صحة النظام', value: '100%', color: 'kpi-green', icon: '✅' },
  ];

  const statusColor: Record<string, string> = {
    PENDING: '#F59E0B', PAID: '#3B82F6', PAID_AND_ORDERED: '#6366F1',
    FULFILLING: '#8B5CF6', SHIPPED: '#10B981', DELIVERED: '#16A34A',
  };
  const logColor: Record<string, string> = {
    SUCCESS: '#16A34A', INFO: '#3B82F6', WARN: '#F59E0B', ERROR: '#DC2626',
  };

  return (
    <main className="admin-bg">
      {/* Top bar */}
      <div className="w-full px-8 py-4 flex items-center justify-between" style={{ background: '#002366', borderBottom: '3px solid #FF8C00' }}>
        <div>
          <h1 className="text-[22px] font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>مركز القيادة</h1>
          <p className="text-[11px]" style={{ color: 'rgba(144,202,249,0.7)', fontFamily: 'var(--font-montserrat)' }}>SAUDILUX ADMIN — LIVE</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(59,130,246,0.25)', color: '#90CAF9', border: '1px solid rgba(59,130,246,0.4)', fontFamily: 'var(--font-cairo)', cursor: 'pointer' }}>
              📦 الطلبات
            </button>
          </Link>
          <Link href="/admin/war-room">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(232,118,26,0.3)', color: '#FF8C00', border: '1px solid #FF8C00', fontFamily: 'var(--font-cairo)', cursor: 'pointer' }}>
              ⚔️ War Room
            </button>
          </Link>
          <Link href="/admin/monitor">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(134,239,172,0.15)', color: '#86EFAC', border: '1px solid rgba(134,239,172,0.4)', fontFamily: 'var(--font-cairo)', cursor: 'pointer' }}>
              📡 مراقبة
            </button>
          </Link>
          <Link href="/admin/system-logs">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(232,118,26,0.2)', color: '#FF8C00', border: '1px solid rgba(232,118,26,0.4)', fontFamily: 'var(--font-cairo)', cursor: 'pointer' }}>
              سجلات النظام
            </button>
          </Link>
          <Link href="/">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none' }}>
              الواجهة
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-[11px] font-semibold" style={{ color: '#86EFAC', fontFamily: 'var(--font-montserrat)' }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className={`kpi-card ${kpi.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{kpi.icon}</span>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>{kpi.label}</p>
              </div>
              <p className="admin-stat-value">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/api/sys/empire-seed" target="_blank">
            <button className="btn-primary text-[14px] py-3 px-6">🌱 تهيئة قاعدة البيانات (20 منتج)</button>
          </a>
          <a href="/api/products/sync" target="_blank">
            <button className="btn-primary text-[14px] py-3 px-6">🤖 Scout — مزامنة المنتجات</button>
          </a>
          <Link href="/admin/war-room">
            <button className="btn-primary text-[14px] py-3 px-6">⚔️ War Room</button>
          </Link>
          <Link href="/admin/orders">
            <button className="btn-secondary text-[14px] py-3 px-6">📦 إدارة الطلبات</button>
          </Link>
          <Link href="/admin/system-logs">
            <button className="btn-secondary text-[14px] py-3 px-6">📋 سجلات النظام</button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders */}
          <div className="card-luxury">
            <h2 className="text-[18px] font-black mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
              <span style={{ color: 'var(--color-orange)' }}>📦</span> آخر الطلبات
            </h2>
            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)', fontSize: '13px' }}>لا توجد طلبات بعد.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold truncate" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', maxWidth: '160px' }}>{order.product.titleAr}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                        {new Date(order.createdAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[14px] font-black" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>{order.totalAmount.toFixed(0)} SAR</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${statusColor[order.paymentStatus] ?? '#888'}22`, color: statusColor[order.paymentStatus] ?? '#888', fontFamily: 'var(--font-montserrat)', border: `1px solid ${statusColor[order.paymentStatus] ?? '#888'}44` }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Logs */}
          <div className="card-luxury">
            <h2 className="text-[18px] font-black mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
              <span style={{ color: 'var(--color-blue)' }}>🔍</span> سجلات النظام (Stealth)
            </h2>
            {recentLogs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)', fontSize: '13px' }}>لا توجد سجلات بعد.</p>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="log-row">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0" style={{ background: `${logColor[log.level] ?? '#888'}18`, color: logColor[log.level] ?? '#888', fontFamily: 'var(--font-montserrat)' }}>{log.level}</span>
                      <span className="text-[12px] truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-montserrat)' }}>[{log.source}] {log.message}</span>
                    </div>
                    <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                      {new Date(log.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/system-logs" className="text-[13px] font-bold" style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-cairo)' }}>عرض كل السجلات ←</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
