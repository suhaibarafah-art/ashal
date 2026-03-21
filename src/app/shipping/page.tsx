import Link from 'next/link';

export const metadata = { title: 'سياسة الشحن والتوصيل | SAUDILUX', description: 'سياسة الشحن والتوصيل داخل المملكة العربية السعودية' };

export default function ShippingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>SAUDI<span style={{ color: 'white' }}>LUX</span></Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>الشحن والتوصيل</span>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>سياسة الشحن والتوصيل</h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>توصيل لجميع مناطق المملكة — آخر تحديث: مارس 2026</p>

        {/* Shipping time table */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
          <div style={{ padding: '16px 20px', background: '#002366', borderBottom: '2px solid #FF8C00' }}>
            <h2 style={{ fontFamily: 'var(--font-cairo)', color: 'white', fontWeight: 900, fontSize: '16px', margin: 0 }}>جدول أوقات التوصيل</h2>
          </div>
          {[
            { city: 'الرياض، جدة، الدمام', time: '2-3 أيام عمل', courier: 'Aramex / SMSA' },
            { city: 'مكة، المدينة، الخبر، الطائف', time: '3-4 أيام عمل', courier: 'SMSA / DHL' },
            { city: 'باقي المناطق', time: '4-7 أيام عمل', courier: 'Aramex / DHL' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', fontSize: '14px' }}>{row.city}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', color: '#FF8C00', fontSize: '13px', fontWeight: 700 }}>{row.time}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-muted)', fontSize: '12px' }}>{row.courier}</span>
            </div>
          ))}
        </div>

        {[
          { title: '📦 تكاليف الشحن', body: 'الشحن مجاني للطلبات فوق 200 SAR. للطلبات دون ذلك: رسوم شحن ثابتة 25 SAR لجميع مناطق المملكة.' },
          { title: '🔍 تتبع الشحنة', body: 'ستحصل على رقم تتبع فور شحن طلبك. يمكنك تتبع طلبك مباشرة من صفحة "طلباتي" في الموقع، أو عبر موقع شركة الشحن.' },
          { title: '🏠 الدفع عند الاستلام (COD)', body: 'متاح لجميع مناطق المملكة. سيتواصل معك مندوب التوصيل قبل الوصول. الدفع نقداً أو بالبطاقة لدى المندوب (حسب شركة الشحن).' },
          { title: '📦 التغليف', body: 'جميع المنتجات تُشحن في تغليف احترافي مخصص بدون ذكر اسم المورد الأصلي (White Label) للحفاظ على صورة العلامة التجارية.' },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '24px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: '#FF8C00', marginBottom: '12px' }}>{title}</h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
