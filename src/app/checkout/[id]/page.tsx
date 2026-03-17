/**
 * Saudi Luxury Store - Checkout Simulation Page
 * صفحة الدفع التشبيهية - تجربة دفع فارهة
 */

export default function Checkout({ params }: { params: { id: string } }) {
  return (
    <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        padding: '3rem', 
        border: '1px solid var(--accent-gold)', 
        backgroundColor: 'rgba(197, 160, 89, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '3rem' }}>
           <h1 style={{ fontFamily: 'var(--font-family-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>بوابة الفخامة للارتقاء</h1>
           <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '2px' }}>SECURE PAYMENT | MOYASAR</p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', textAlign: 'right', marginBottom: '3rem' }}>
           <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>المبلغ الإجمالي</label>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SAR 1,299.99</div>
           </div>
           
           <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }}>
               استخدام Apple Pay
           </button>
           
           <div style={{ display: 'flex', gap: '1rem' }}>
               <button style={{ flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '1rem' }}>مدى</button>
               <button style={{ flex: 1, backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '1rem' }}>بطاقة ائتمان</button>
           </div>
        </div>

        <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
           بالنقر على دفع، أنت توافق على شروط الخدمة وسياسة الخصوصية لمتجر الفخامة السيادي.
        </p>
      </div>
    </main>
  );
}
