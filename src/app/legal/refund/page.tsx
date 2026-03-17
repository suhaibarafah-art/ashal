export default function RefundPolicy() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h1 style={{ color: 'var(--accent-gold)', marginBottom: '2rem', fontSize: '2.5rem' }}>سياسة الاسترجاع والاستبدال</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '2' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            مرحباً بك في منصة <strong>الفخامة</strong>. نحن نلتزم بتقديم أفضل جودة للمنتجات لعملائنا، وبما يتوافق مع أنظمة وزارة التجارة في المملكة العربية السعودية.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>فترة الاسترجاع:</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            يحق للعميل استرجاع المنتج خلال 7 أيام من تاريخ الاستلام، واستبداله خلال 14 يوماً، بشرط أن يكون المنتج بحالته الأصلية غير مفتوح ولم يتم استخدامه.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>الحالات التي لا يقبل فيها الاسترجاع:</h3>
          <ul style={{ paddingRight: '1.5rem', marginBottom: '1.5rem' }}>
            <li>إذا ظهر عيب في المنتج بسبب سوء حيازة أو استخدام العميل.</li>
            <li>المنتجات التي تم نزع غلافها أو فتح العلبة (إلا في حال وجود عيب مصنعي).</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>الرسوم وتكاليف الشحن:</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            عند رغبة العميل بإرجاع منتج سليم غير معيب، يتحمل العميل تكاليف الشحن (الذهاب والإياب). وفي حال كان المنتج معيباً أو به تلف مصنعي، تتحمل المنصة جميع تكاليف الشحن وتوفير البديل بلمسة من الفخامة التي نعدكم بها.
          </p>
        </div>
      </div>
    </div>
  );
}
