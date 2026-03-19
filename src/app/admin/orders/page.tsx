'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const STATUSES = [
  { value: 'ALL', label: 'الكل' },
  { value: 'PENDING_PAYMENT', label: 'في الانتظار' },
  { value: 'PAID', label: 'مدفوع' },
  { value: 'PROCESSING', label: 'قيد التجهيز' },
  { value: 'SHIPPED', label: 'تم الشحن' },
  { value: 'DELIVERED', label: 'تم التوصيل' },
  { value: 'CANCELLED', label: 'ملغي' },
];

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const pmLabels: Record<string, string> = {
  COD: 'دفع عند الاستلام',
  CARD_TEST: 'بطاقة (تجريبي)',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = async (s = status) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${s}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = (s: string) => {
    setStatus(s);
    load(s);
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">الطلبات</h1>
          <p className="text-sm text-ink-4 mt-1">إجمالي: {total} طلب</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => handleStatus(s.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s.value ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-ink-3 hover:border-brand-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-4 py-3 text-right text-ink-4 font-medium">رقم الطلب</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">العميل</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">المبلغ</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الدفع</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">الحالة</th>
              <th className="px-4 py-3 text-right text-ink-4 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-4">جاري التحميل...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center">
                <ShoppingCart size={40} className="mx-auto text-ink-6 mb-2" />
                <p className="text-ink-4">لا يوجد طلبات</p>
              </td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-brand-600 hover:underline font-medium">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{o.guestName || 'عميل مسجل'}</div>
                  <div className="text-xs text-ink-4">{o.guestEmail}</div>
                </td>
                <td className="px-4 py-3 font-medium">{Number(o.total).toFixed(2)} ر.س</td>
                <td className="px-4 py-3 text-ink-3 text-xs">{pmLabels[o.paymentMethod] || o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUSES.find(s => s.value === o.status)?.label || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-4">{new Date(o.createdAt).toLocaleDateString('ar-SA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
