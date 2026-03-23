'use client';

/**
 * Checkout Client — 4 payment methods:
 *   1. دفع إلكتروني (Moyasar: mada / Visa / Apple Pay / STC Pay)
 *   2. تابي (Tabby: 4 installments)
 *   3. تمارا (Tamara: 3 installments)
 *   4. الدفع عند الاستلام (COD)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  finalPrice: number;
  imageUrl?: string;
  supplier?: string;
}

interface CheckoutClientProps {
  product: Product;
  moyasarKey: string;
  siteUrl: string;
  initialCoupon?: string;
  tabbyEnabled?: boolean;
  tamaraEnabled?: boolean;
}

declare global {
  interface Window {
    Moyasar?: { init: (config: Record<string, unknown>) => void };
  }
}

const CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'تبوك', 'أبها', 'الطائف', 'بريدة', 'القصيم', 'حائل',
  'نجران', 'جازان', 'ينبع', 'الجبيل', 'الأحساء',
];

type PaymentMethod = 'online' | 'tabby' | 'tamara' | 'cod';

export default function CheckoutClient({
  product, moyasarKey, siteUrl, initialCoupon = '', tabbyEnabled = false, tamaraEnabled = false,
}: CheckoutClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', coupon: initialCoupon });
  const [couponStatus, setCouponStatus] = useState<{ applied: boolean; code: string; discount: number } | null>(null);
  const [orderId, setOrderId] = useState('');
  const [finalAmount, setFinalAmount] = useState(product.finalPrice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const moyasarRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const imageUrl = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';

  // ── Apply Coupon ──────────────────────────────────────────────────────────
  async function applyCoupon() {
    if (!form.coupon.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.coupon.trim(), amount: product.finalPrice }),
      });
      const data = await res.json() as { success: boolean; discountedPrice?: number; discountAmount?: number; error?: string };
      if (data.success && data.discountedPrice !== undefined) {
        setCouponStatus({ applied: true, code: form.coupon.toUpperCase(), discount: data.discountAmount ?? 0 });
        setFinalAmount(data.discountedPrice);
      } else {
        setCouponStatus(null);
        setFinalAmount(product.finalPrice);
        setError(data.error ?? 'كود الخصم غير صالح');
        setTimeout(() => setError(''), 3000);
      }
    } finally {
      setCouponLoading(false);
    }
  }

  // ── Submit Step 1 → Create Order → Route by Payment Method ───────────────
  async function handleSubmitInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.city) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    setLoading(true); setError('');
    try {
      // Map paymentMethod for backend
      const backendMethod = paymentMethod === 'online' ? 'online' : paymentMethod;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId:     product.id,
          customerName:  form.name,
          phone:         form.phone,
          city:          form.city,
          address:       form.address,
          amount:        finalAmount,
          couponCode:    couponStatus?.applied ? couponStatus.code : undefined,
          paymentMethod: backendMethod,
        }),
      });
      const data = await res.json() as { success: boolean; orderId?: string; totalAmount?: number; error?: string };
      if (!data.success || !data.orderId) throw new Error(data.error ?? 'فشل إنشاء الطلب');

      const oid = data.orderId;
      setOrderId(oid);
      setFinalAmount(data.totalAmount ?? finalAmount);
      const amt = data.totalAmount ?? finalAmount;

      if (paymentMethod === 'cod') {
        setStep(3);
        setTimeout(() => router.push(`/orders/${oid}`), 1500);
        return;
      }

      if (paymentMethod === 'tabby') {
        const tbRes = await fetch('/api/payments/tabby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: oid, amount: amt, productTitle: product.titleAr, phone: form.phone, name: form.name, city: form.city }),
        });
        const tbData = await tbRes.json() as { checkoutUrl?: string; error?: string };
        if (tbData.checkoutUrl) { window.location.href = tbData.checkoutUrl; return; }
        throw new Error(tbData.error ?? 'فشل الاتصال بـ Tabby');
      }

      if (paymentMethod === 'tamara') {
        const tmRes = await fetch('/api/payments/tamara', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: oid, amount: amt, productTitle: product.titleAr, phone: form.phone, name: form.name, city: form.city }),
        });
        const tmData = await tmRes.json() as { checkoutUrl?: string; error?: string };
        if (tmData.checkoutUrl) { window.location.href = tmData.checkoutUrl; return; }
        throw new Error(tmData.error ?? 'فشل الاتصال بـ Tamara');
      }

      // online → Moyasar
      setStep(2);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  // ── Load Moyasar on Step 2 ────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 2 || !orderId || scriptLoaded.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
    script.onload = () => {
      scriptLoaded.current = true;
      if (window.Moyasar && moyasarRef.current) {
        window.Moyasar.init({
          element: '.mysr-form',
          amount: Math.round(finalAmount * 100),
          currency: 'SAR',
          description: `طلب: ${product.titleAr}`,
          publishable_api_key: moyasarKey,
          callback_url: `${siteUrl}/orders/${orderId}`,
          methods: ['creditcard', 'applepay', 'stcpay'],
          apple_pay: { country: 'SA', label: product.titleAr, validate_merchant_url: `${siteUrl}/api/applepay` },
          metadata: { orderId },
          on_completed: function() {
            setStep(3);
            setTimeout(() => router.push(`/orders/${orderId}`), 1500);
          },
        });
      }
    };
    document.head.appendChild(script);
  }, [step, orderId, finalAmount, product.titleAr, moyasarKey, siteUrl, router]);

  // ── Payment method card helper ────────────────────────────────────────────
  function PayCard({
    id, emoji, title, subtitle, badge, color,
  }: { id: PaymentMethod; emoji: string; title: string; subtitle: string; badge?: string; color?: string }) {
    const active = paymentMethod === id;
    const borderColor = active ? (color ?? '#FF8C00') : 'var(--border-color)';
    const bgColor = active ? `${color ?? '#FF8C00'}11` : 'var(--bg-tertiary)';
    return (
      <button
        type="button"
        onClick={() => setPaymentMethod(id)}
        style={{
          padding: '14px 10px', borderRadius: '10px',
          border: `2px solid ${borderColor}`,
          background: bgColor,
          cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        {badge && (
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            background: '#6366F1', color: 'white',
            fontSize: '9px', fontWeight: 900, padding: '2px 5px', borderRadius: '4px',
            fontFamily: 'var(--font-cairo)',
          }}>{badge}</span>
        )}
        <div style={{ fontSize: '22px', marginBottom: '4px' }}>{emoji}</div>
        <div style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 900, color: active ? (color ?? '#FF8C00') : 'var(--text-primary)' }}>
          {title}
        </div>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {subtitle}
        </div>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#002366', borderBottom: '3px solid #FF8C00', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cairo)', color: 'white', fontSize: '18px', fontWeight: 900, margin: 0 }}>إتمام الطلب</h1>
          <p style={{ color: 'rgba(144,202,249,0.7)', fontSize: '11px', fontFamily: 'var(--font-montserrat)', margin: 0 }}>SECURE CHECKOUT</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {([1, 2, 3] as const).map(s => (
            <div key={s} style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= s ? '#FF8C00' : 'rgba(255,255,255,0.1)',
              color: step >= s ? 'white' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', fontWeight: 900, fontFamily: 'var(--font-montserrat)',
            }}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Product Summary */}
        <div className="card-luxury" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={imageUrl} alt={product.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>{product.titleAr}</p>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{product.titleEn}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>
                SAR {finalAmount.toFixed(2)}
              </span>
              {couponStatus?.applied && (
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
                  -{couponStatus.discount.toFixed(2)} SAR ✓ {couponStatus.code}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── STEP 1: Customer Info ── */}
        {step === 1 && (
          <div className="card-luxury">
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '24px' }}>
              بياناتك للشحن
            </h2>

            <form onSubmit={handleSubmitInfo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  الاسم الكامل
                </label>
                <input type="text" className="input-luxury" placeholder="محمد عبدالله الأحمد"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%' }} />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  رقم الجوال <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input type="tel" className="input-luxury" placeholder="05XXXXXXXX"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required style={{ width: '100%', direction: 'ltr', textAlign: 'left' }} />
              </div>

              {/* City */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  المدينة <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select className="input-luxury" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required style={{ width: '100%' }}>
                  <option value="">اختر مدينتك</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  العنوان التفصيلي
                </label>
                <input type="text" className="input-luxury" placeholder="الحي، الشارع، رقم المبنى"
                  value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  style={{ width: '100%' }} />
              </div>

              {/* Coupon */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  كود الخصم (اختياري)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" className="input-luxury" placeholder="LUXURY10 / SAVE10 / ROYAL20"
                    value={form.coupon} onChange={e => setForm(f => ({ ...f, coupon: e.target.value.toUpperCase() }))}
                    style={{ flex: 1, textTransform: 'uppercase' }} />
                  <button type="button" onClick={applyCoupon} disabled={couponLoading || !form.coupon}
                    style={{
                      background: couponStatus?.applied ? '#15803D' : '#FFDB58',
                      color: couponStatus?.applied ? 'white' : '#1a1000',
                      border: 'none', borderRadius: '8px', padding: '0 20px',
                      fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px',
                      cursor: 'pointer', flexShrink: 0,
                    }}>
                    {couponLoading ? '...' : couponStatus?.applied ? '✓ مطبّق' : 'تطبيق'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#DC2626', fontFamily: 'var(--font-cairo)', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              {/* Order total */}
              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '13px' }}>سعر المنتج</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, color: 'var(--text-secondary)' }}>SAR {product.finalPrice.toFixed(2)}</span>
                </div>
                {couponStatus?.applied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-cairo)', color: '#15803D', fontSize: '13px' }}>خصم ({couponStatus.code})</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, color: '#15803D' }}>-SAR {couponStatus.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '15px', color: 'var(--text-primary)' }}>الإجمالي</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, color: 'var(--color-orange)', fontSize: '20px' }}>SAR {finalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* ── Payment Methods ── */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cairo)', fontSize: '14px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  اختر طريقة الدفع
                </label>

                {/* Row 1: Online + COD */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <PayCard id="online" emoji="💳" title="دفع إلكتروني" subtitle="mada · Visa · Apple Pay · STC" color="#FF8C00" />
                  <PayCard id="cod" emoji="💵" title="الدفع عند الاستلام" subtitle="Cash on Delivery" color="#16a34a" />
                </div>

                {/* Row 2: Tabby + Tamara */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <PayCard
                    id="tabby"
                    emoji="🟣"
                    title="تابي — 4 أقساط"
                    subtitle={tabbyEnabled ? `SAR ${(finalAmount / 4).toFixed(2)} × 4` : 'قريباً'}
                    badge={tabbyEnabled ? undefined : 'قريباً'}
                    color="#3D0C5E"
                  />
                  <PayCard
                    id="tamara"
                    emoji="🟢"
                    title="تمارا — 3 أقساط"
                    subtitle={tamaraEnabled ? `SAR ${(finalAmount / 3).toFixed(2)} × 3` : 'قريباً'}
                    badge={tamaraEnabled ? undefined : 'قريباً'}
                    color="#00A550"
                  />
                </div>

                {/* BNPL info */}
                {(paymentMethod === 'tabby' || paymentMethod === 'tamara') && (
                  <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: paymentMethod === 'tabby' ? 'rgba(61,12,94,0.08)' : 'rgba(0,165,80,0.08)', border: `1px solid ${paymentMethod === 'tabby' ? '#3D0C5E' : '#00A550'}33` }}>
                    {paymentMethod === 'tabby' && (
                      <>
                        <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: '#3D0C5E', margin: '0 0 4px' }}>
                          تابي — اشتري الآن وادفع لاحقاً
                        </p>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                          {tabbyEnabled
                            ? `4 installments of SAR ${(finalAmount / 4).toFixed(2)} — 0% interest`
                            : 'Tabby keys not configured yet — coming soon'}
                        </p>
                      </>
                    )}
                    {paymentMethod === 'tamara' && (
                      <>
                        <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: '#00A550', margin: '0 0 4px' }}>
                          تمارا — قسّم على 3
                        </p>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                          {tamaraEnabled
                            ? `3 installments of SAR ${(finalAmount / 3).toFixed(2)} — 0% interest`
                            : 'Tamara keys not configured yet — coming soon'}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || (paymentMethod === 'tabby' && !tabbyEnabled) || (paymentMethod === 'tamara' && !tamaraEnabled)}
                style={{
                  fontSize: '17px', padding: '18px',
                  opacity: (loading || (paymentMethod === 'tabby' && !tabbyEnabled) || (paymentMethod === 'tamara' && !tamaraEnabled)) ? 0.6 : 1,
                  background: paymentMethod === 'cod' ? '#16a34a' : paymentMethod === 'tabby' ? '#3D0C5E' : paymentMethod === 'tamara' ? '#00A550' : undefined,
                }}
              >
                {loading
                  ? '⏳ جارٍ المعالجة...'
                  : paymentMethod === 'cod'
                    ? `✅ تأكيد الطلب COD — SAR ${finalAmount.toFixed(2)}`
                  : paymentMethod === 'tabby'
                    ? tabbyEnabled ? `🟣 الدفع عبر تابي — SAR ${finalAmount.toFixed(2)}` : 'تابي — قريباً'
                  : paymentMethod === 'tamara'
                    ? tamaraEnabled ? `🟢 الدفع عبر تمارا — SAR ${finalAmount.toFixed(2)}` : 'تمارا — قريباً'
                  : `متابعة للدفع — SAR ${finalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: Moyasar ── */}
        {step === 2 && (
          <div className="card-luxury">
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              الدفع الآمن
            </h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              مشفّر بـ SSL • مدعوم من Moyasar • مدى / Visa / STC Pay / Apple Pay
            </p>
            <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '12px' }}>رقم الطلب</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700 }}>{orderId.slice(0, 18)}...</span>
            </div>
            <div ref={moyasarRef} className="mysr-form" />
            <p style={{ marginTop: '16px', fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center' }}>
              بإتمام الدفع توافق على شروط الاستخدام وسياسة الإرجاع
            </p>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="card-luxury" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '28px', fontWeight: 900, color: '#15803D', marginBottom: '8px' }}>تم تأكيد الطلب!</h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
              طلبك قيد المعالجة. ستتلقى تأكيداً قريباً.
            </p>
            <p style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-muted)', fontSize: '12px' }}>جارٍ التوجيه لتتبع طلبك...</p>
          </div>
        )}
      </div>
    </div>
  );
}
