/**
 * Phase 6: Admin War Room
 * Live revenue, Titan-5 agent heartbeats, social kits, inventory sync
 * /admin/war-room
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WarRoomPage() {
  const [
    agentLogs,
    products,
    revenueData,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    // Agent heartbeats — last run per agent
    prisma.systemLog.findMany({
      where: { source: { startsWith: 'agent/' } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    // Inventory
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, titleAr: true, finalPrice: true, supplier: true, stockLevel: true, category: true, imageUrl: true },
    }),
    // Revenue aggregate
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: { in: ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'PAID_AND_ORDERED'] } },
    }),
    // Orders by status
    prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: { id: true },
    }),
    // Recent orders
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { product: { select: { titleAr: true } } },
    }),
  ]);

  const totalRevenue = revenueData._sum.totalAmount ?? 0;

  // Last run per agent
  const agentNames = ['Scout', 'Copywriter', 'Critic', 'Strategist', 'CEO'];
  const agentHeartbeats = agentNames.map(name => {
    const log = agentLogs.find(l => l.source === `agent/${name.toLowerCase()}`);
    return {
      name,
      lastRun: log ? new Date(log.createdAt).toLocaleString('ar-SA') : 'لم يعمل بعد',
      status: log ? (log.level === 'SUCCESS' || log.level === 'INFO' ? 'OK' : 'WARN') : 'IDLE',
      message: log?.message ?? '—',
    };
  });

  // Strategist social kit from latest log
  const strategistLog = agentLogs.find(l => l.source === 'agent/strategist');
  const socialKit = strategistLog?.metadata ? (() => {
    try { return JSON.parse(strategistLog.metadata) as Record<string, unknown>; } catch { return null; }
  })() : null;

  // Product list with type cast for extra fields
  type ProductRow = { id: string; titleAr: string; finalPrice: number; supplier: string | null; stockLevel: number | null; category: string | null; imageUrl: string | null };
  const typedProducts = products as unknown as ProductRow[];

  const statusMap: Record<string, string> = {
    PENDING: '#F59E0B', PAID: '#3B82F6', PAID_AND_ORDERED: '#6366F1',
    FULFILLING: '#8B5CF6', SHIPPED: '#10B981', DELIVERED: '#16A34A', FAILED: '#DC2626',
  };

  return (
    <main className="admin-bg">
      {/* Header */}
      <div style={{ background: '#002366', borderBottom: '3px solid #FF8C00', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cairo)', color: 'white', fontSize: '22px', fontWeight: 900, margin: 0 }}>
            غرفة العمليات — War Room
          </h1>
          <p style={{ color: 'rgba(144,202,249,0.7)', fontSize: '11px', fontFamily: 'var(--font-montserrat)', margin: 0 }}>
            TITAN-5 HEARTBEATS • LIVE REVENUE • SOCIAL KITS • INVENTORY
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/admin/system-logs">
            <button className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>سجلات النظام</button>
          </Link>
          <Link href="/admin">
            <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>لوحة التحكم</button>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" />
            <span style={{ color: '#86EFAC', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* ── Revenue KPI Strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="kpi-card kpi-orange">
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>إجمالي الإيرادات</p>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '28px', fontWeight: 900, color: 'var(--color-orange)' }}>{totalRevenue.toFixed(0)} <span style={{ fontSize: '14px' }}>SAR</span></p>
          </div>
          {ordersByStatus.map(s => (
            <div key={s.paymentStatus} className="kpi-card" style={{ borderLeft: `4px solid ${statusMap[s.paymentStatus] ?? '#888'}` }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.paymentStatus}</p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '28px', fontWeight: 900, color: statusMap[s.paymentStatus] ?? '#888' }}>{s._count.id}</p>
            </div>
          ))}
          <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-blue)' }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>المنتجات</p>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '28px', fontWeight: 900, color: 'var(--color-blue)' }}>{products.length}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* ── Titan-5 Heartbeats ── */}
          <div className="card-luxury">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                🤖 Titan-5 Heartbeats
              </h2>
              <form action="/api/agents/run" method="POST" target="_blank">
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  ▶ تشغيل الآن
                </button>
              </form>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {agentHeartbeats.map(agent => (
                <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: agent.status === 'OK' ? '#16A34A' : agent.status === 'WARN' ? '#F59E0B' : '#9CA3AF',
                    boxShadow: agent.status === 'OK' ? '0 0 6px #16A34A' : 'none',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {agent.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {agent.message}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {agent.lastRun}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Social Kit ── */}
          <div className="card-luxury">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                📱 Social Kit
              </h2>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                {strategistLog ? new Date(strategistLog.createdAt).toLocaleDateString('ar-SA') : 'لم يُنشأ بعد'}
              </span>
            </div>

            {socialKit ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'linear-gradient(135deg, rgba(255,140,0,0.08), rgba(0,35,102,0.08))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: 'var(--color-orange)', marginBottom: '6px', textTransform: 'uppercase' }}>Instagram</p>
                  <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{String(socialKit.instagramCaption ?? '')}</p>
                </div>
                <div style={{ padding: '12px', background: 'linear-gradient(135deg, rgba(29,161,242,0.08), rgba(0,35,102,0.08))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: '#1DA1F2', marginBottom: '6px', textTransform: 'uppercase' }}>Twitter / X</p>
                  <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{String(socialKit.twitterPost ?? '')}</p>
                </div>
                <div style={{ padding: '12px', background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(0,35,102,0.08))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700, color: '#25D366', marginBottom: '6px', textTransform: 'uppercase' }}>WhatsApp</p>
                  <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{String(socialKit.whatsappMessage ?? '')}</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)', fontSize: '14px' }}>
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</p>
                شغّل Titan-5 لتوليد Social Kit
              </div>
            )}
          </div>
        </div>

        {/* ── Inventory Grid ── */}
        <div className="card-luxury" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              📦 المخزون ({products.length} منتج)
            </h2>
            <a href="/api/products/sync" target="_blank">
              <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>🔄 مزامنة المخزون</button>
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-montserrat)', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-color)' }}>
                  {['المنتج', 'المورد', 'التصنيف', 'السعر', 'المخزون', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 12px', textAlign: i === 0 ? 'right' : 'center', color: 'var(--text-muted)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typedProducts.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {p.imageUrl && p.imageUrl.startsWith('http') && (
                          <img src={p.imageUrl} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                        )}
                        <span style={{ fontFamily: 'var(--font-cairo)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{p.titleAr}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        background: p.supplier === 'mkhazen' ? '#DBEAFE' : '#FEF9C3',
                        color: p.supplier === 'mkhazen' ? '#1D4ED8' : '#A16207',
                      }}>
                        {p.supplier ?? 'cj'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>{p.category ?? '—'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: 'var(--color-orange)' }}>
                      {p.finalPrice.toFixed(2)} SAR
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        background: (p.stockLevel ?? 0) > 10 ? '#DCFCE7' : (p.stockLevel ?? 0) > 0 ? '#FEF9C3' : '#FEE2E2',
                        color: (p.stockLevel ?? 0) > 10 ? '#15803D' : (p.stockLevel ?? 0) > 0 ? '#A16207' : '#DC2626',
                      }}>
                        {p.stockLevel ?? 0}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <Link href={`/products/${p.id}`} target="_blank">
                        <button style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: 'var(--color-blue)', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontWeight: 600 }}>
                          عرض
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Orders ── */}
        <div className="card-luxury">
          <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '20px' }}>
            📋 آخر الطلبات
          </h2>
          {recentOrders.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '14px' }}>لا توجد طلبات بعد.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>{order.product.titleAr}</p>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)' }}>{order.customerCity} • {new Date(order.createdAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, color: 'var(--color-orange)', fontSize: '15px' }}>{order.totalAmount.toFixed(0)} SAR</span>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-montserrat)', background: `${statusMap[order.paymentStatus] ?? '#888'}22`, color: statusMap[order.paymentStatus] ?? '#888', border: `1px solid ${statusMap[order.paymentStatus] ?? '#888'}44` }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '16px' }}>
            <Link href="/admin" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--color-blue)', fontWeight: 700, fontSize: '13px' }}>
              عرض كل الطلبات ←
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
