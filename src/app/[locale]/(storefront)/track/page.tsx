'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

interface OrderData {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { titleAr: string; titleEn: string; quantity: number; unitPrice: number }[];
}

const statusMap: Record<string, { ar: string; en: string; icon: React.ReactNode }> = {
  PENDING_PAYMENT: { ar: 'في انتظار الدفع', en: 'Pending Payment', icon: <Clock size={16} /> },
  PAID: { ar: 'تم الدفع', en: 'Paid', icon: <CheckCircle size={16} /> },
  PROCESSING: { ar: 'قيد المعالجة', en: 'Processing', icon: <Package size={16} /> },
  SHIPPED: { ar: 'تم الشحن', en: 'Shipped', icon: <Truck size={16} /> },
  DELIVERED: { ar: 'تم التسليم', en: 'Delivered', icon: <CheckCircle size={16} /> },
  CANCELLED: { ar: 'ملغي', en: 'Cancelled', icon: <Clock size={16} /> },
};

export default function TrackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const [query, setQuery] = useState(searchParams.get('order') ?? '');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${query.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const status = order ? statusMap[order.status] : null;

  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
          {locale === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
        </h1>

        <div className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            className="input flex-1"
            placeholder={locale === 'ar' ? 'أدخل رقم الطلب (مثال: AS-2026-ABC12)' : 'Enter order number (e.g. AS-2026-ABC12)'}
          />
          <button onClick={search} disabled={loading} className="btn-primary px-4">
            <Search size={18} />
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-ink-4">
            {locale === 'ar' ? 'جاري البحث...' : 'Searching...'}
          </div>
        )}

        {notFound && (
          <div className="text-center py-8 bg-red-50 rounded-xl">
            <p className="text-red-600 font-medium">
              {locale === 'ar' ? 'لم يتم العثور على الطلب' : 'Order not found'}
            </p>
            <p className="text-sm text-ink-4 mt-1">
              {locale === 'ar' ? 'تأكد من رقم الطلب وحاول مرة أخرى' : 'Check the order number and try again'}
            </p>
          </div>
        )}

        {order && status && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-ink-4">{locale === 'ar' ? 'رقم الطلب' : 'Order Number'}</p>
                <p className="font-bold text-ink font-mono">{order.orderNumber}</p>
              </div>
              <span className="badge bg-brand-100 text-brand-700 flex items-center gap-1">
                {status.icon}
                {locale === 'ar' ? status.ar : status.en}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-ink-2">{locale === 'ar' ? item.titleAr : item.titleEn} × {item.quantity}</span>
                  <span className="text-ink-3">{formatPrice(item.unitPrice * item.quantity, locale)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-ink pt-2 border-t border-gray-100">
                <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span>{formatPrice(order.total, locale)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
