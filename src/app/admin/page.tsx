import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

async function getStats() {
  try {
    const [totalOrders, totalProducts, totalCustomers, revenue, pendingOrders, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { items: true },
      }),
    ]);
    return { totalOrders, totalProducts, totalCustomers, revenue: Number(revenue._sum.total ?? 0), pendingOrders, recentOrders };
  } catch {
    return { totalOrders: 0, totalProducts: 0, totalCustomers: 0, revenue: 0, pendingOrders: 0, recentOrders: [] };
  }
}

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: 'في الانتظار',
  PAID: 'مدفوع',
  PROCESSING: 'قيد التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
};

export default async function AdminDashboard() {
  const { totalOrders, totalProducts, totalCustomers, revenue, pendingOrders, recentOrders } = await getStats();

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-ink">لوحة التحكم</h1>
        <p className="text-ink-4 text-sm mt-1">مرحباً بك في إدارة متجر أسهل</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الطلبات', value: totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'إجمالي الإيرادات', value: `${revenue.toLocaleString('ar-SA')} ر.س`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'المنتجات', value: totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'طلبات معلقة', value: pendingOrders, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-ink">{stat.value}</div>
            <div className="text-sm text-ink-4 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-ink">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-brand-500 hover:text-brand-600">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-5 py-3 text-right text-ink-4 font-medium">رقم الطلب</th>
                <th className="px-5 py-3 text-right text-ink-4 font-medium">العميل</th>
                <th className="px-5 py-3 text-right text-ink-4 font-medium">المبلغ</th>
                <th className="px-5 py-3 text-right text-ink-4 font-medium">الحالة</th>
                <th className="px-5 py-3 text-right text-ink-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-4">لا يوجد طلبات بعد</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-brand-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink">{order.guestName || 'عميل مسجل'}</td>
                  <td className="px-5 py-3 font-medium">{Number(order.total).toLocaleString('ar-SA')} ر.س</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-4">
                    {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/products/new', label: 'إضافة منتج', icon: Package },
          { href: '/admin/imports', label: 'استيراد منتجات', icon: CheckCircle },
          { href: '/admin/suppliers', label: 'إدارة الموردين', icon: Users },
        ].map(action => (
          <Link key={action.href} href={action.href}
            className="card p-4 flex items-center gap-3 hover:border-brand-300 hover:shadow-md transition-all border border-gray-100">
            <action.icon size={20} className="text-brand-500" />
            <span className="font-medium text-ink text-sm">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
