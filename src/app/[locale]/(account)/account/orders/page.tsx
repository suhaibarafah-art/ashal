import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

const statusLabels: Record<string, Record<string, string>> = {
  PENDING_PAYMENT: { ar: 'في الانتظار', en: 'Pending' },
  PAID: { ar: 'مدفوع', en: 'Paid' },
  PROCESSING: { ar: 'قيد التجهيز', en: 'Processing' },
  SHIPPED: { ar: 'تم الشحن', en: 'Shipped' },
  DELIVERED: { ar: 'تم التوصيل', en: 'Delivered' },
  CANCELLED: { ar: 'ملغي', en: 'Cancelled' },
};

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default async function AccountOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  const isAr = locale === 'ar';

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: (session?.user as any)?.id },
      include: { items: { take: 2 } },
      orderBy: { createdAt: 'desc' },
    });
  } catch {}

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-ink">{isAr ? 'طلباتي' : 'My Orders'}</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag size={48} className="mx-auto text-ink-6 mb-4" />
          <p className="text-ink-3 mb-4">{isAr ? 'لا يوجد طلبات بعد' : 'No orders yet'}</p>
          <Link href={`/${locale}`} className="btn-primary">{isAr ? 'تسوق الآن' : 'Start Shopping'}</Link>
        </div>
      ) : orders.map(order => (
        <div key={order.id} className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-mono font-medium text-ink">{order.orderNumber}</span>
              <p className="text-sm text-ink-4 mt-0.5">{new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</p>
            </div>
            <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
              {statusLabels[order.status]?.[locale] || order.status}
            </span>
          </div>
          <div className="text-sm text-ink-3 mb-3">
            {order.items.map((i: any) => isAr ? i.titleAr : i.titleEn).join('، ')}
            {order.items.length === 2 && '...'}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-ink">{Number(order.total).toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
