'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  locale: string;
}

export default function CartDrawer({ locale }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, total } = useCartStore();
  const isRtl = locale === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const sub = subtotal();
  const tot = total();
  const shippingFee = sub >= 200 ? 0 : 25;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl',
              isRtl ? 'left-0' : 'right-0'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-ink">
                {locale === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
              </h2>
              <button onClick={closeCart} className="p-2 rounded-lg hover:bg-gray-50 text-ink-3">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-ink-6" />
                  <p className="text-ink-3 font-medium">
                    {locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
                  </p>
                  <Link href={`/${locale}`} onClick={closeCart} className="btn-primary">
                    {locale === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={locale === 'ar' ? item.titleAr : item.titleEn}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {locale === 'ar' ? item.titleAr : item.titleEn}
                        </p>
                        <p className="text-sm text-brand-500 font-semibold mt-0.5">
                          {formatPrice(item.price, locale)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-ink-3 hover:border-brand-500 hover:text-brand-500 transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-ink-3 hover:border-brand-500 hover:text-brand-500 transition-all"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ms-auto text-ink-5 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 space-y-3">
                <div className="flex justify-between text-sm text-ink-3">
                  <span>{locale === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                  <span>{formatPrice(sub, locale)}</span>
                </div>
                <div className="flex justify-between text-sm text-ink-3">
                  <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span>{shippingFee === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatPrice(shippingFee, locale)}</span>
                </div>
                <div className="flex justify-between font-semibold text-ink border-t border-gray-100 pt-2">
                  <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span>{formatPrice(tot, locale)}</span>
                </div>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="btn-primary w-full text-center block"
                >
                  {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                </Link>
                <Link
                  href={`/${locale}/cart`}
                  onClick={closeCart}
                  className="btn-secondary w-full text-center block"
                >
                  {locale === 'ar' ? 'عرض السلة' : 'View Cart'}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
