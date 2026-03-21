import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = ['PENDING', 'PAID', 'PAID_AND_ORDERED', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'FAILED'];

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#F59E0B',
  PAID: '#3B82F6',
  PAID_AND_ORDERED: '#6366F1',
  FULFILLING: '#8B5CF6',
  SHIPPED: '#10B981',
  DELIVERED: '#16A34A',
  FAILED: '#DC2626',
};

async function updateOrderStatus(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as string;
  const tracking = formData.get('trackingNumber') as string;
  if (!orderId || !status) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: status,
      ...(tracking ? { trackingNumber: tracking } : {}),
    },
  });

  revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filterStatus = sp.status ?? '';
  const page = Math.max(1, parseInt(sp.page ?? '1'));
  const take = 20;
  const skip = (page - 1) * take;

  const where = filterStatus ? { paymentStatus: filterStatus } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: { product: true },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <main className="admin-bg" style={{ minHeight: '100vh' }}>
      {/* Top bar */}
      <div className="w-full px-8 py-4 flex items-center justify-between" style={{ background: '#002366', borderBottom: '3px solid #FF8C00' }}>
        <div>
          <h1 className="text-[22px] font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>إدارة الطلبات</h1>
          <p className="text-[11px]" style={{ color: 'rgba(144,202,249,0.7)', fontFamily: 'var(--font-montserrat)' }}>
            ORDERS MANAGEMENT — {total} TOTAL
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none' }}>
              ← لوحة التحكم
            </button>
          </Link>
        </div>
      </div>

      <div className="container py-8">

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/admin/orders">
            <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold cursor-pointer transition-all ${!filterStatus ? 'text-white' : 'text-white/60 hover:text-white'}`}
              style={{ background: !filterStatus ? '#FF8C00' : 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-montserrat)' }}>
              الكل ({total})
            </span>
          </Link>
          {STATUS_OPTIONS.map(s => (
            <Link key={s} href={`/admin/orders?status=${s}`}>
              <span
                className="px-3 py-1.5 rounded-full text-[12px] font-bold cursor-pointer transition-all"
                style={{
                  background: filterStatus === s ? `${STATUS_COLOR[s]}22` : 'rgba(255,255,255,0.06)',
                  color: filterStatus === s ? STATUS_COLOR[s] : 'rgba(255,255,255,0.5)',
                  border: filterStatus === s ? `1px solid ${STATUS_COLOR[s]}44` : '1px solid transparent',
                  fontFamily: 'var(--font-montserrat)',
                }}
              >
                {s}
              </span>
            </Link>
          ))}
        </div>

        {/* Orders Table */}
        <div className="card-luxury overflow-hidden p-0">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                  {['الطلب', 'العميل', 'المنتج', 'المبلغ', 'الحالة', 'التتبع', 'التاريخ', 'إجراء'].map(h => (
                    <th key={h} className="text-right px-4 py-3 text-[11px] font-black uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)', fontSize: 14 }}>
                      لا توجد طلبات
                    </td>
                  </tr>
                )}
                {orders.map((order) => {
                  const sc = STATUS_COLOR[order.paymentStatus] ?? '#888';
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5 transition-colors">
                      {/* Order ID */}
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-black" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      {/* Customer */}
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>
                          {order.customerName ?? '—'}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                          {order.customerPhone ?? ''} · {order.customerCity ?? ''}
                        </p>
                      </td>
                      {/* Product */}
                      <td className="px-4 py-3" style={{ maxWidth: 160 }}>
                        <p className="text-[13px] truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}>
                          {order.product.titleAr}
                        </p>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3">
                        <span className="text-[14px] font-black" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>
                          {Number(order.totalAmount).toFixed(0)} SAR
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}33`, fontFamily: 'var(--font-montserrat)' }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      {/* Tracking */}
                      <td className="px-4 py-3">
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                          {(order as unknown as Record<string, unknown>).trackingNumber as string ?? '—'}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3">
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      {/* Action Form */}
                      <td className="px-4 py-3">
                        <form action={updateOrderStatus} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <select
                            name="status"
                            defaultValue={order.paymentStatus}
                            className="text-[11px] rounded-md px-2 py-1.5 font-bold"
                            style={{
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              fontFamily: 'var(--font-montserrat)',
                              cursor: 'pointer',
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <input
                            name="trackingNumber"
                            placeholder="tracking..."
                            defaultValue={(order as unknown as Record<string, unknown>).trackingNumber as string ?? ''}
                            className="text-[11px] rounded-md px-2 py-1.5"
                            style={{
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              fontFamily: 'var(--font-montserrat)',
                              width: 90,
                            }}
                          />
                          <button
                            type="submit"
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md"
                            style={{ background: '#FF8C00', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)' }}
                          >
                            حفظ
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link key={p} href={`/admin/orders?${filterStatus ? `status=${filterStatus}&` : ''}page=${p}`}>
                <span
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-bold cursor-pointer"
                  style={{
                    background: p === page ? '#FF8C00' : 'var(--bg-secondary)',
                    color: p === page ? 'white' : 'var(--text-muted)',
                    fontFamily: 'var(--font-montserrat)',
                  }}
                >
                  {p}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
