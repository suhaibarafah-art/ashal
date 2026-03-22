/**
 * Order Tracking Page
 * /orders/[id] — shows real-time order status from DB
 */

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_STEPS = [
  { key: 'PENDING',         label: 'تم الطلب',         icon: '📋', desc: 'طلبك قيد الانتظار — سيُؤكَّد خلال دقائق' },
  { key: 'PAID',            label: 'تم الدفع',          icon: '✅', desc: 'تم تأكيد الدفع بنجاح ✓' },
  { key: 'PAID_AND_ORDERED',label: 'تأكيد المورد',      icon: '🏭', desc: 'أُرسل للمورد — جارٍ التجهيز' },
  { key: 'FULFILLING',      label: 'جارٍ التجهيز',      icon: '📦', desc: 'يُجهَّز طلبك الآن في المستودع' },
  { key: 'SHIPPED',         label: 'تم الشحن',          icon: '🚚', desc: 'في الطريق إليك — يصلك خلال 24-48 ساعة' },
  { key: 'DELIVERED',       label: 'تم التوصيل',        icon: '🏠', desc: '🎉 استُلم طلبك بنجاح! شكراً لثقتك بنا' },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#F59E0B', PAID: '#3B82F6', PAID_AND_ORDERED: '#6366F1',
  FULFILLING: '#8B5CF6', SHIPPED: '#10B981', DELIVERED: '#16A34A', FAILED: '#DC2626',
};

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: { select: { titleAr: true, titleEn: true, finalPrice: true, imageUrl: true } },
    },
  });
  if (!order) notFound();

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.paymentStatus);
  const isFailed = order.paymentStatus === 'FAILED';

  const product = order.product as unknown as { titleAr: string; titleEn: string; finalPrice: number; imageUrl?: string; supplier?: string };

  // Estimated delivery: local=2d, CJ=4d from order creation
  const isLocal = String((product as Record<string, unknown>).supplier ?? 'cj') === 'mkhazen';
  const deliveryDays = isLocal ? 2 : 4;
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
  const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
  const imageUrl = product.imageUrl && product.imageUrl.startsWith('http')
    ? product.imageUrl
    : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';

  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#002366', borderBottom: '3px solid #FF8C00', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cairo)', color: 'white', fontSize: '20px', fontWeight: 900, margin: 0 }}>
            تتبع طلبك
          </h1>
          <p style={{ color: 'rgba(144,202,249,0.7)', fontSize: '11px', fontFamily: 'var(--font-montserrat)', margin: 0 }}>
            ORDER TRACKING
          </p>
        </div>
        <Link href="/">
          <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            الرئيسية
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Order ID */}
        <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '12px' }}>رقم الطلب</span>
          <span style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700 }}>{order.id}</span>
        </div>

        {/* Product Card */}
        <div className="card-luxury" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={imageUrl} alt={product.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{product.titleAr}</p>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{product.titleEn}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-orange)', fontFamily: 'var(--font-montserrat)' }}>
                SAR {order.totalAmount.toFixed(2)}
              </span>
              {order.discountAmount > 0 && (
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
                  وفّرت {order.discountAmount.toFixed(2)} SAR
                </span>
              )}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              fontFamily: 'var(--font-montserrat)',
              background: `${STATUS_COLOR[order.paymentStatus] ?? '#888'}22`,
              color: STATUS_COLOR[order.paymentStatus] ?? '#888',
              border: `1px solid ${STATUS_COLOR[order.paymentStatus] ?? '#888'}44`,
            }}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Status Stepper */}
        {isFailed ? (
          <div className="card-luxury" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '22px', fontWeight: 900, color: '#DC2626', marginBottom: '8px' }}>فشل الدفع</h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              لم تتم عملية الدفع. يرجى المحاولة مرة أخرى.
            </p>
            <Link href={`/checkout/${order.productId}`}>
              <button className="btn-primary text-[15px] px-8 py-4">إعادة المحاولة</button>
            </Link>
          </div>
        ) : (
          <div className="card-luxury">
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '28px' }}>
              مراحل الطلب
            </h2>
            <div style={{ position: 'relative' }}>
              {/* Vertical line — left side for RTL layout */}
              <div style={{ position: 'absolute', left: '19px', top: '20px', bottom: '20px', width: '2px', background: 'var(--border-color)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'row-reverse', gap: '16px', alignItems: 'flex-start', padding: '10px 0', position: 'relative' }}>
                      {/* Circle — right side in RTL */}
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', zIndex: 1,
                        background: isDone ? (isCurrent ? '#FF8C00' : '#002366') : 'var(--bg-tertiary)',
                        border: isDone ? 'none' : '2px solid var(--border-color)',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(255,140,0,0.2)' : 'none',
                      }}>
                        {step.icon}
                      </div>
                      {/* Text */}
                      <div style={{ paddingTop: '6px', flex: 1, textAlign: 'right' }}>
                        <p style={{
                          fontFamily: 'var(--font-cairo)', fontWeight: isCurrent ? 900 : 600,
                          fontSize: '15px',
                          color: isDone ? (isCurrent ? 'var(--color-orange)' : 'var(--text-primary)') : 'var(--text-muted)',
                          marginBottom: '2px',
                        }}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Estimated Delivery */}
        {!isFailed && order.paymentStatus !== 'DELIVERED' && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div>
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>التوصيل المتوقع</p>
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', fontWeight: 900, color: '#10B981' }}>{estimatedDeliveryStr}</p>
            </div>
          </div>
        )}

        {/* Customer Info */}
        <div className="card-luxury" style={{ marginTop: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
            معلومات الشحن
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'الاسم', value: order.customerName || '—' },
              { label: 'الجوال', value: order.customerPhone },
              { label: 'المدينة', value: order.customerCity },
              { label: 'العنوان', value: order.customerAddress || '—' },
              { label: 'تاريخ الطلب', value: new Date(order.createdAt).toLocaleDateString('ar-SA') },
              ...(order.trackingNumber ? [{ label: 'رقم التتبع', value: order.trackingNumber }] : []),
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="card-luxury" style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            هل تحتاج مساعدة؟ فريقنا جاهز 24/7
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#25D366', color: 'white', borderRadius: '8px',
                padding: '8px 16px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              💬 واتساب
            </a>
            <a
              href={`mailto:support@saudilux.store?subject=طلب رقم ${order.id.slice(-8).toUpperCase()}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: '8px',
                border: '1px solid var(--border-color)',
                padding: '8px 16px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              ✉️ راسلنا
            </a>
          </div>
        </div>

        {/* Back to shop */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--color-blue)', fontWeight: 700, fontSize: '14px' }}>
            ← العودة للتسوق
          </Link>
        </div>
      </div>
    </main>
  );
}
