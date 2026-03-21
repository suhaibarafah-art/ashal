import Link from 'next/link';

export const metadata = { title: 'شروط الاستخدام | SAUDILUX', description: 'شروط وأحكام استخدام متجر SAUDILUX' };

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>SAUDI<span style={{ color: 'white' }}>LUX</span></Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>شروط الاستخدام</span>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>شروط الاستخدام</h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>آخر تحديث: مارس 2026</p>

        {[
          { title: '١. قبول الشروط', body: 'باستخدامك لمتجر SAUDILUX، توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق، يرجى عدم استخدام الموقع.' },
          { title: '٢. الأسعار والضريبة', body: 'جميع الأسعار المعروضة تشمل ضريبة القيمة المضافة (VAT 15%) وفقاً لاشتراطات هيئة الزكاة والضريبة والجمارك (ZATCA). يحق لنا تعديل الأسعار دون إشعار مسبق.' },
          { title: '٣. إتمام الطلب', body: 'يُعتبر الطلب مؤكداً فور إتمام الدفع الإلكتروني أو تأكيد طلب الدفع عند الاستلام. سنتواصل معك للتأكيد خلال 24 ساعة عمل.' },
          { title: '٤. الشحن والتوصيل', body: 'يتم الشحن خلال 3-7 أيام عمل داخل المملكة العربية السعودية عبر شركات Aramex أو SMSA أو DHL. تتحمل SAUDILUX تكلفة الشحن على الطلبات فوق 200 SAR.' },
          { title: '٥. الملكية الفكرية', body: 'جميع محتويات الموقع (نصوص، صور، تصاميم) هي ملك حصري لـ SAUDILUX ومحمية بموجب نظام الملكية الفكرية السعودي.' },
          { title: '٦. القانون المنطبق', body: 'تخضع هذه الشروط للأنظمة والقوانين المعمول بها في المملكة العربية السعودية، وتختص المحاكم السعودية بالفصل في أي نزاعات.' },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '32px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: '#FF8C00', marginBottom: '12px' }}>{title}</h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
