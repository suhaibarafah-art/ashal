import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عن SAUDILUX | متجر الفخامة السعودي',
  description: 'قصة متجر SAUDILUX — منصة التجارة الإلكترونية الفاخرة في قلب المملكة العربية السعودية',
};

const PILLARS = [
  { num: '٠١', title: 'الجودة السيادية', desc: 'كل منتج يمر بمعايير دقيقة — هامش جودة ≥35% وتقييم بشري قبل النشر.' },
  { num: '٠٢', title: 'توصيل 48 ساعة', desc: 'من مستودعنا في الرياض لبابك مباشرة — الأسرع في المملكة.' },
  { num: '٠٣', title: 'دفع آمن 100%', desc: 'بوابة Moyasar المرخصة من ساما — مدى، فيزا، آبل باي، STC Pay.' },
  { num: '٠٤', title: 'إرجاع مجاني', desc: 'غير راضٍ؟ أعد المنتج خلال 30 يوماً مجاناً. رضاك أولويتنا.' },
];

const STATS = [
  { value: '37+', label: 'منتج فاخر' },
  { value: '48h', label: 'متوسط التوصيل' },
  { value: '100%', label: 'دفع آمن' },
  { value: '2026', label: 'تأسيس الإمبراطورية' },
];

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #002366 0%, #001540 100%)', borderBottom: '4px solid #FF8C00', padding: '72px 0 64px' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: 'rgba(144,202,249,0.7)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' }}>
            OUR STORY
          </p>
          <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '56px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px', maxWidth: '700px' }}>
            الفخامة السعودية<br />
            <span style={{ color: '#FFDB58' }}>بلا حدود</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '540px', lineHeight: '1.8', marginBottom: '32px' }}>
            بدأنا كفكرة بسيطة: إيصال أجود المنتجات للمنزل السعودي بسرعة وأمان. اليوم نُدير منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي تضم مئات المنتجات الفاخرة.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/">
              <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                تسوق الآن
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-secondary" style={{ fontSize: '15px', padding: '14px 32px', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                تواصل معنا
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#002366', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '32px 0' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '32px', fontWeight: 900, color: '#FFDB58', letterSpacing: '-0.02em' }}>{s.value}</p>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">لماذا SAUDILUX؟</span>
            <h2 className="section-heading__title">أركان الإمبراطورية</h2>
            <div className="section-heading__line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map(p => (
              <div key={p.num} className="card-luxury" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '28px', fontWeight: 900, color: '#FF8C00', flexShrink: 0, lineHeight: 1 }}>{p.num}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-cairo)', fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision 2030 ── */}
      <section style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '80px 0' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-mustard" style={{ marginBottom: '16px', display: 'inline-block' }}>رؤية 2030</span>
              <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.2 }}>
                نبني المستقبل<br />
                <span style={{ color: 'var(--color-orange)' }}>للتجارة السعودية</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '24px' }}>
                نتماشى مع رؤية المملكة 2030 في تطوير اقتصاد رقمي مزدهر. نوظّف الذكاء الاصطناعي عبر منظومة TITAN-10 لاستيراد وتحرير ونشر المنتجات تلقائياً، مع ضمان جودة وأسعار تنافسية.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'TITAN-10 — 10 وكلاء ذكاء اصطناعي يعملون 24/7',
                  'تكامل مع CJ Dropshipping و Moyasar و LogisticBot',
                  'ZATCA متوافق — VAT 15% مدمج في كل طلب',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#10B981', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '14px', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-luxury" style={{ padding: '40px', background: 'linear-gradient(135deg, #002366 0%, #001540 100%)', border: 'none' }}>
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', marginBottom: '24px' }}>
                &ldquo;نحن لا نبيع السلع — نُوصل الفخامة لكل بيت سعودي بأسرع طريقة وأأمن وسيلة.&rdquo;
              </p>
              <div style={{ width: '48px', height: '3px', background: '#FFDB58', borderRadius: '2px', marginBottom: '16px' }} />
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'rgba(144,202,249,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>SAUDILUX — LUXURY EMPIRE 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontFamily: 'var(--font-cairo)', fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
            جاهز للتسوق؟
          </h2>
          <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            اكتشف مئات المنتجات الفاخرة بتوصيل سريع من المستودع السعودي.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/collections">
              <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
                تصفح المجموعات
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-secondary" style={{ fontSize: '16px', padding: '16px 40px' }}>تواصل معنا</button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
