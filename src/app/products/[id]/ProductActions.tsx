'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
  finalPrice: number;
}

export function ProductActions({ productId, finalPrice }: Props) {
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [validating, setValidating] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleOrder() {
    const url = coupon.trim()
      ? `/checkout/${productId}?coupon=${coupon.trim().toUpperCase()}`
      : `/checkout/${productId}`;
    router.push(url);
  }

  async function validateCoupon() {
    if (!coupon.trim()) return;
    setValidating(true);
    setCouponMsg(null);
    try {
      const res  = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.trim(), amount: finalPrice }),
      });
      const data = await res.json() as { success: boolean; discountAmount?: number; discountedPrice?: number; error?: string };
      if (data.success && data.discountAmount) {
        setCouponMsg({ text: `✓ خصم ${data.discountAmount.toFixed(0)} ريال سيُطبَّق عند الطلب`, ok: true });
      } else {
        setCouponMsg({ text: data.error ?? 'كود غير صالح', ok: false });
      }
    } catch {
      setCouponMsg({ text: 'تعذّر التحقق، جرّبي عند الطلب', ok: false });
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Coupon row */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="كود الخصم (مثال: LUXURY10)"
          value={coupon}
          onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(null); }}
          className="input-luxury flex-1"
          style={{ textTransform: 'uppercase' }}
        />
        <button
          onClick={validateCoupon}
          disabled={validating || !coupon.trim()}
          className="px-5 py-3 rounded-md font-bold text-[14px]"
          style={{
            background: couponMsg?.ok ? 'rgba(16,185,129,0.2)' : 'var(--color-mustard)',
            color: couponMsg?.ok ? '#10B981' : '#1a1000',
            fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none', flexShrink: 0,
          }}
        >
          {validating ? '...' : couponMsg?.ok ? '✓' : 'تحقق'}
        </button>
      </div>

      {/* Coupon feedback */}
      {couponMsg && (
        <p className="text-[12px] font-bold" style={{ color: couponMsg.ok ? '#10B981' : '#EF4444', fontFamily: 'var(--font-cairo)' }}>
          {couponMsg.text}
        </p>
      )}

      {/* Order CTA */}
      <button onClick={handleOrder} className="btn-primary w-full text-[17px] py-5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        اطلب الآن — SAR {finalPrice.toLocaleString('en-US')}
      </button>

      <button className="btn-secondary w-full text-[15px] py-4" style={{ fontFamily: 'var(--font-cairo)' }}>
        أضف للمفضلة ♡
      </button>
    </div>
  );
}
