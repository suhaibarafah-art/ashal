import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderStatusUpdater from './OrderStatusUpdater';

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: 'في الانتظار',
  PAID: 'مدفوع',
  PROCESSING: 'قيد التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
  REFUNDED: 'مسترد',
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: any = null;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
  } catch {}
  if (!order) notFound();

  const address = order.addressSnapshot as any;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">طلب #{order.orderNumber}</h1>
          <p className="text-sm text-ink-4 mt-1">{new Date(order.createdAt).toLocaleString('ar-SA')}</p>
        </div>
        <OrderStatusUpdater orderId={id} currentStatus={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-3">بيانات العميل</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-ink-4">الاسم: </span>{order.guestName}</div>
            <div><span className="text-ink-4">البريد: </span>{order.guestEmail}</div>
            <div><span className="text-ink-4">الجوال: </span>{order.guestPhone}</div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-3">عنوان التوصيل</h2>
          <div className="space-y-2 text-sm">
            <div>{address?.line1}</div>
            {address?.line2 && <div>{address.line2}</div>}
            <div>{address?.city}، {address?.region}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-ink">المنتجات</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-5 py-3 text-right text-ink-4 font-medium">المنتج</th>
              <th className="px-5 py-3 text-right text-ink-4 font-medium">الكمية</th>
              <th className="px-5 py-3 text-right text-ink-4 font-medium">السعر</th>
              <th className="px-5 py-3 text-right text-ink-4 font-medium">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-3">
                  <div className="font-medium">{item.titleAr}</div>
                  <div className="text-xs text-ink-4">{item.titleEn}</div>
                </td>
                <td className="px-5 py-3">{item.quantity}</td>
                <td className="px-5 py-3">{Number(item.unitPrice).toFixed(2)} ر.س</td>
                <td className="px-5 py-3 font-medium">{Number(item.totalPrice).toFixed(2)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 space-y-2 border-t border-gray-100 text-sm">
          <div className="flex justify-between"><span className="text-ink-4">المجموع الفرعي</span><span>{Number(order.subtotal).toFixed(2)} ر.س</span></div>
          <div className="flex justify-between"><span className="text-ink-4">الشحن</span><span>{Number(order.shippingFee) === 0 ? 'مجاني' : `${Number(order.shippingFee).toFixed(2)} ر.س`}</span></div>
          {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><span>-{Number(order.discount).toFixed(2)} ر.س</span></div>}
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100"><span>الإجمالي</span><span>{Number(order.total).toFixed(2)} ر.س</span></div>
        </div>
      </div>
    </div>
  );
}
