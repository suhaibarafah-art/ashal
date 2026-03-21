import Link from 'next/link';

export const metadata = { title: 'سياسة الإرجاع والاستبدال | SAUDILUX', description: 'سياسة الإرجاع والاستبدال في متجر SAUDILUX' };

export default function ReturnsPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#002366', padding: '24px', borderBottom: '3px solid #FF8C00' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', textDecoration: 'none' }}>SAUDI<span style={{ color: 'white' }}>LUX</span></Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '15px' }}>الإرجاع والاستبدال</span>
        </div>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-cairo)', fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>سياسة الإرجاع والاستبدال</h1>
        <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', marginBottom: '40px' }}>نضمن رضاك الكامل — آخر تحديث: مارس 2026</p>

        <div style={{ padding: '20px', background: 'rgba(22,163,74,0.08)', border: '2px solid #16a34a', borderRadius: '12px', marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-cairo)', color: '#16a34a', fontWeight: 900, fontSize: '16px', margin: 0 }}>✅ ضمان الاسترجاع خلال 7 أيام من تاريخ الاستلام</p>
        </div>

        {[
          { title: '١. شروط الإرجاع', body: 'يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام إذا كان: في حالته الأصلية ولم يُستخدم، بالتغليف الأصلي، ومرفقاً بفاتورة الشراء.' },
          { title: '٢. حالات الاستبدال الفوري', body: 'نستبدل المنتج فوراً وبدون شروط في حال: وصول منتج تالف، اختلاف المنتج عن المطلوب، عيب مصنعي واضح.' },
          { title: '٣. استثناءات الإرجاع', body: 'لا يمكن إرجاع: المنتجات التي تم استخدامها، المنتجات المخصصة (مع اسم أو تعديل)، المنتجات التي تجاوزت مدة الإرجاع.' },
          { title: '٤. كيفية طلب الإرجاع', body: 'تواصل معنا عبر WhatsApp خلال 7 أيام من الاستلام مع صور المنتج ورقم الطلب. سنتواصل معك خلال 24 ساعة لترتيب الاستلام.' },
          { title: '٥. استرداد المبلغ', body: 'يُسترد المبلغ على نفس وسيلة الدفع خلال 5-7 أيام عمل بعد استلام المنتج المُرجَع وفحصه. للدفع عند الاستلام: يُحول المبلغ لمحفظتك الإلكترونية.' },
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
