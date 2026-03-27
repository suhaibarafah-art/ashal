import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المعلومات القانونية | SAUDILUX',
  description: 'الشروط والأحكام، سياسة الخصوصية، سياسة الإرجاع وسياسة الشحن لمتجر SAUDILUX',
};

const LEGAL_LINKS = [
  { href: '/terms',    icon: '📄', title: 'الشروط والأحكام',   desc: 'قواعد وشروط استخدام المتجر والشراء' },
  { href: '/privacy',  icon: '🔒', title: 'سياسة الخصوصية',   desc: 'كيف نحمي بياناتك الشخصية' },
  { href: '/returns',  icon: '↩️', title: 'سياسة الإرجاع',    desc: 'شروط استرداد الطلبات والمبالغ' },
  { href: '/shipping', icon: '🚚', title: 'سياسة الشحن',       desc: 'مناطق التوصيل، المواعيد، والتكاليف' },
];

export default function LegalPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>
            SAUDI<span style={{ color: 'white' }}>LUX</span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>المعلومات القانونية</span>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          المعلومات القانونية
        </h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>
          التزامنا بالشفافية — اطلع على حقوقك وواجباتنا
        </p>

        {/* Legal Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {LEGAL_LINKS.map(({ href, icon, title, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px 24px',
                background: 'var(--bg-secondary)',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '17px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {title}
                </h2>
                <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  {desc}
                </p>
                <div style={{ marginTop: '16px', color: 'var(--color-orange)', fontSize: '13px', fontFamily: 'var(--font-cairo)', fontWeight: 700 }}>
                  <span className="flex items-center gap-1">اقرأ المزيد <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Company Info */}
        <div style={{ padding: '28px 24px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
            🏢 معلومات الشركة
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              ['اسم المتجر', 'SAUDILUX — المتجر السعودي للمنتجات الفاخرة'],
              ['المملكة العربية السعودية', 'مرخص لمزاولة التجارة الإلكترونية'],
              ['بوابة الدفع', 'Moyasar — مرخصة من البنك المركزي السعودي (ساما)'],
              ['الدعم الفني', 'support@saudilux.store'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '16px', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '13px', minWidth: '140px', flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', fontSize: '13px' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ZATCA / VAT note */}
        <div style={{ padding: '20px 24px', background: 'rgba(255,140,0,0.06)', borderRadius: '12px', border: '1px solid rgba(255,140,0,0.2)', marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.8' }}>
            <strong style={{ color: 'var(--color-orange)' }}>ضريبة القيمة المضافة (VAT):</strong> جميع الأسعار المعروضة شاملة ضريبة القيمة المضافة بنسبة 15% وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك (زاتكا).
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="flex items-center gap-2 justify-center" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--color-blue)', fontWeight: 700, fontSize: '14px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            العودة للتسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
