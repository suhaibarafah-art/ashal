import Link from 'next/link';

export const metadata = { title: 'سياسة الخصوصية | SAUDILUX', description: 'سياسة الخصوصية وحماية البيانات الشخصية في متجر SAUDILUX' };

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>SAUDI<span style={{ color: 'white' }}>LUX</span></Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>سياسة الخصوصية</span>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>سياسة الخصوصية</h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>آخر تحديث: مارس 2026</p>

        {[
          { title: '١. جمع البيانات', body: 'نجمع البيانات الشخصية التي تقدمها طوعاً عند إتمام الطلبات، مثل: الاسم، رقم الجوال، المدينة، والعنوان. لا نجمع بيانات بطاقة الدفع — يتم معالجتها بشكل آمن عبر بوابة Moyasar المرخصة من البنك المركزي السعودي (ساما).' },
          { title: '٢. استخدام البيانات', body: 'تُستخدم بياناتك حصرياً لـ: تنفيذ طلبك وشحنه، التواصل معك بشأن حالة الطلب، تحسين تجربة التسوق. لا نبيع بياناتك لأي طرف ثالث.' },
          { title: '٣. الحماية والأمان', body: 'تُخزَّن بياناتك في قاعدة بيانات Neon PostgreSQL المشفرة. جميع الاتصالات محمية بـ SSL/TLS. نلتزم بمتطلبات نظام حماية البيانات الشخصية السعودي (PDPL).' },
          { title: '٤. ملفات تعريف الارتباط (Cookies)', body: 'نستخدم ملفات تعريف ضرورية تقنياً فقط لضمان عمل المتجر. لا نستخدم ملفات تتبع إعلانية.' },
          { title: '٥. حقوقك', body: 'يحق لك طلب الاطلاع على بياناتك، تعديلها، أو حذفها في أي وقت. تواصل معنا عبر WhatsApp لأي طلب.' },
          { title: '٦. التواصل', body: 'لأي استفسار حول الخصوصية: WhatsApp على الرقم المذكور في الموقع.' },
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
