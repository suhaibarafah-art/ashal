'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/currency';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const params = useParams();
  const locale = params.locale as string;
  const { items, removeItem, updateQty, subtotal, total } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const sub = subtotal();
  const tot = total();
  const shippingFee = sub >= 200 ? 0 : 25;

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8">
        {locale === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <ShoppingBag size={64} className="text-ink-6" />
          <p className="text-lg text-ink-3">{locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
          <Link href={`/${locale}`} className="btn-primary">
            {locale === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-brand-50 flex-shrink-0">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={locale === 'ar' ? item.titleAr : item.titleEn} width={80} height={80} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/${locale}/products/${item.slug}`} className="text-sm font-medium text-ink hover:text-brand-500 transition-colors">
                    {locale === 'ar' ? item.titleAr : item.titleEn}
                  </Link>
                  <p className="text-sm text-brand-500 font-semibold mt-1">{formatPrice(item.price, locale)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-ink-3 hover:border-brand-500 hover:text-brand-500">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-ink-3 hover:border-brand-500 hover:text-brand-500">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-ink-5 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-ink self-start">
                  {formatPrice(item.price * item.quantity, locale)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-ink mb-4">{locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-3">
                  <span>{locale === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                  <span>{formatPrice(sub, locale)}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span>{shippingFee === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatPrice(shippingFee, locale)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-ink">
                  <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span>{formatPrice(tot, locale)}</span>
                </div>
              </div>
              <Link href={`/${locale}/checkout`} className="btn-primary w-full text-center block mt-6">
                {locale === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
              </Link>
              {sub < 200 && (
                <p className="text-xs text-ink-4 mt-3 text-center">
                  {locale === 'ar'
                    ? `أضف ${formatPrice(200 - sub, locale)} للحصول على شحن مجاني`
                    : `Add ${formatPrice(200 - sub, locale)} for free shipping`
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
