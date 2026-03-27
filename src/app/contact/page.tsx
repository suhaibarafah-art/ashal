import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | SAUDILUX',
  description: 'تواصل مع فريق خدمة عملاء SAUDILUX عبر واتساب أو البريد الإلكتروني — نرد خلال دقائق',
};

const WHATSAPP = 'https://wa.me/966500000000';
const EMAIL    = 'support@saudilux.store';

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>
            SAUDI<span style={{ color: 'white' }}>LUX</span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>تواصل معنا</span>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          تواصل معنا
        </h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>
          فريقنا متاح 24/7 للإجابة على استفساراتك
        </p>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>

          {/* WhatsApp */}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid rgba(37,211,102,0.3)', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '20px', fontWeight: 900, color: '#25D366', marginBottom: '8px' }}>
                واتساب
              </h2>
              <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                الأسرع — نرد خلال دقائق
              </p>
              <div style={{ background: '#25D366', color: 'white', borderRadius: '8px', padding: '10px 20px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '14px', display: 'inline-block' }}>
                ابدأ المحادثة
              </div>
            </div>
          </a>

          {/* Email */}
          <a href={`mailto:${EMAIL}`} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
              <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '20px', fontWeight: 900, color: 'var(--color-orange)', marginBottom: '8px' }}>
                البريد الإلكتروني
              </h2>
              <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                للاستفسارات التفصيلية
              </p>
              <div style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderRadius: '8px', padding: '10px 20px', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '13px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                {EMAIL}
              </div>
            </div>
          </a>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '20px' }}>
            أسئلة شائعة
          </h2>
          {[
            { q: 'كم تستغرق عملية التوصيل؟', a: 'للمنتجات من مستودعنا السعودي: 24-48 ساعة. للمنتجات الأخرى: 3-5 أيام عمل.' },
            { q: 'كيف أتابع طلبي؟', a: 'بمجرد شحن طلبك ستصلك رسالة واتساب برقم التتبع. يمكنك أيضاً متابعة الحالة من خلال رابط الطلب المرسل لك.' },
            { q: 'ما هي سياسة الإرجاع؟', a: 'نقبل الإرجاع خلال 30 يوماً من تاريخ الاستلام بشرط أن يكون المنتج في حالته الأصلية وغير مستخدم.' },
            { q: 'هل الدفع آمن؟', a: 'نعم. نستخدم بوابة Moyasar المرخصة من البنك المركزي السعودي (ساما). لا نحتفظ ببيانات بطاقتك.' },
            { q: 'هل يمكنني تعديل طلبي بعد إتمامه؟', a: 'يمكن التعديل خلال ساعة من الطلب فقط. بعدها يُرسَل للمورد تلقائياً. تواصل معنا فوراً عبر واتساب.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: '16px', padding: '20px 24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', fontWeight: 900, color: '#FF8C00', marginBottom: '8px' }}>{q}</h3>
              <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, fontSize: '14px' }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Working hours */}
        <div style={{ padding: '24px', background: 'rgba(255,140,0,0.06)', borderRadius: '12px', border: '1px solid rgba(255,140,0,0.2)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', fontWeight: 700, color: 'var(--color-orange)', marginBottom: '4px' }}>
            ⏰ ساعات الدعم
          </p>
          <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            الأحد – الخميس: 9 صباحاً – 11 مساءً &nbsp;|&nbsp; الجمعة والسبت: 10 صباحاً – 10 مساءً (بتوقيت الرياض)
          </p>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/" className="flex items-center gap-2 justify-center" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--color-blue)', fontWeight: 700, fontSize: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            العودة للتسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
