'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/currency';

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().min(9, 'رقم جوال غير صحيح'),
  line1: z.string().min(3, 'العنوان مطلوب'),
  line2: z.string().optional(),
  city: z.string().min(2, 'المدينة مطلوبة'),
  region: z.string().min(2, 'المنطقة مطلوبة'),
  paymentMethod: z.enum(['COD', 'CARD_TEST']),
  couponCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const saudiRegions = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الطائف', 'تبوك', 'أبها',
  'بريدة', 'حائل', 'نجران', 'جازان', 'الجوف', 'عرعر',
];

export default function CheckoutPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { items, subtotal, total, couponCode, discount, clear, applyCoupon } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'COD' },
  });

  const paymentMethod = watch('paymentMethod');

  const sub = subtotal();
  const shippingFee = sub >= 200 ? 0 : 25;
  const tot = total();

  const applyDiscount = async () => {
    if (!couponInput) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, orderTotal: sub }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(couponInput, data.discount);
        setCouponMsg(locale === 'ar' ? `تم تطبيق خصم ${formatPrice(data.discount, locale)}` : `Discount applied: ${formatPrice(data.discount, locale)}`);
      } else {
        setCouponMsg(locale === 'ar' ? 'كود الخصم غير صحيح أو منتهي الصلاحية' : 'Invalid or expired coupon code');
      }
    } catch {
      setCouponMsg(locale === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          locale,
          items: items.map(i => ({
            id: i.id,
            titleAr: i.titleAr,
            titleEn: i.titleEn,
            imageUrl: i.imageUrl,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          subtotal: sub,
          shippingFee,
          discount,
          total: tot,
          couponCode: couponCode ?? undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Checkout failed');
      clear();
      router.push(`/${locale}/checkout/success?order=${result.orderNumber}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ');
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <p className="text-ink-3">{locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8">
        {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink mb-4">
                {locale === 'ar' ? 'بيانات التواصل' : 'Contact Information'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </label>
                  <input {...register('name')} className="input" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    {locale === 'ar' ? 'رقم الجوال' : 'Phone'} *
                  </label>
                  <input {...register('phone')} className="input" type="tel" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input {...register('email')} className="input" type="email" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink mb-4">
                {locale === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    {locale === 'ar' ? 'الشارع والحي' : 'Street & Neighborhood'} *
                  </label>
                  <input {...register('line1')} className="input" />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    {locale === 'ar' ? 'تفاصيل إضافية (اختياري)' : 'Additional details (optional)'}
                  </label>
                  <input {...register('line2')} className="input" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-1">
                      {locale === 'ar' ? 'المدينة' : 'City'} *
                    </label>
                    <input {...register('city')} className="input" />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-1">
                      {locale === 'ar' ? 'المنطقة' : 'Region'} *
                    </label>
                    <select {...register('region')} className="input">
                      <option value="">{locale === 'ar' ? 'اختر المنطقة' : 'Select region'}</option>
                      {saudiRegions.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-semibold text-ink mb-4">
                {locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200'}`}>
                  <input {...register('paymentMethod')} type="radio" value="COD" className="mt-1" />
                  <div>
                    <p className="font-medium text-ink">{locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
                    <p className="text-sm text-ink-4">{locale === 'ar' ? 'سيتم تحصيل المبلغ عند التوصيل' : 'Pay when your order arrives'}</p>
                  </div>
                </label>

                {/* Card Test */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'CARD_TEST' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200'}`}>
                  <input {...register('paymentMethod')} type="radio" value="CARD_TEST" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-ink">{locale === 'ar' ? 'بطاقة ائتمان (وضع التجربة)' : 'Credit Card (Test Mode)'}</p>
                    <p className="text-sm text-ink-4">{locale === 'ar' ? 'هذا وضع تجريبي — لن يتم خصم أي مبلغ' : 'Test mode — no real charge'}</p>
                    {paymentMethod === 'CARD_TEST' && (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <input className="input" placeholder="0000 0000 0000 0000" defaultValue="4111 1111 1111 1111" readOnly />
                        </div>
                        <input className="input" placeholder="MM/YY" defaultValue="12/28" readOnly />
                        <input className="input" placeholder="CVV" defaultValue="123" readOnly />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="card p-6 sticky top-20">
              <h2 className="font-semibold text-ink mb-4">
                {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-50 flex-shrink-0">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={locale === 'ar' ? item.titleAr : item.titleEn} width={48} height={48} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{locale === 'ar' ? item.titleAr : item.titleEn}</p>
                      <p className="text-xs text-ink-4">{locale === 'ar' ? 'الكمية' : 'Qty'}: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-ink">{formatPrice(item.price * item.quantity, locale)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  className="input text-xs"
                  placeholder={locale === 'ar' ? 'كود الخصم (اختياري)' : 'Coupon code (optional)'}
                />
                <button type="button" onClick={applyDiscount} className="btn-secondary px-3 text-xs whitespace-nowrap">
                  {locale === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
              {couponMsg && <p className="text-xs text-brand-500 mb-3">{couponMsg}</p>}

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-ink-3">
                  <span>{locale === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                  <span>{formatPrice(sub, locale)}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span>{shippingFee === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatPrice(shippingFee, locale)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{locale === 'ar' ? 'الخصم' : 'Discount'}</span>
                    <span>-{formatPrice(discount, locale)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-ink border-t border-gray-100 pt-2">
                  <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span>{formatPrice(tot, locale)}</span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 mt-3 p-3 bg-red-50 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-4"
              >
                {submitting
                  ? (locale === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                  : (locale === 'ar' ? 'تأكيد الطلب' : 'Place Order')
                }
              </button>

              <p className="text-xs text-ink-4 mt-3 text-center">
                {locale === 'ar' ? 'معاملاتك مشفرة وآمنة' : 'Your transactions are encrypted and secure'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
