import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { order } = await searchParams;

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">
          {locale === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
        </h1>

        <p className="text-ink-3 mb-6">
          {locale === 'ar'
            ? 'شكراً لك. سنرسل تفاصيل الطلب على بريدك الإلكتروني'
            : "Thank you. We'll send order details to your email"
          }
        </p>

        {order && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8">
            <p className="text-sm text-ink-3 mb-1">
              {locale === 'ar' ? 'رقم الطلب' : 'Order Number'}
            </p>
            <p className="text-xl font-bold text-brand-500 font-mono">{order}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}`} className="btn-primary">
            {locale === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
          </Link>
          {order && (
            <Link href={`/${locale}/track?order=${order}`} className="btn-secondary flex items-center gap-2 justify-center">
              <Package size={16} />
              {locale === 'ar' ? 'تتبع الطلب' : 'Track Order'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
