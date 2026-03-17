export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h1 style={{ color: 'var(--accent-gold)', marginBottom: '2rem', fontSize: '2.5rem' }}>سياسة الخصوصية وحماية البيانات</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '2' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            خصوصيتك هي أولويتنا في <strong>الفخامة</strong>. توضح هذه السياسة كيفية جمع واستخدام وتخزين بياناتك الشخصية بناءً على القوانين والتشريعات الرقمية في المملكة العربية السعودية.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>جمع المعلومات:</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            نقوم بجمع المعلومات اللازمة فقط لإتمام عملية الطلب عبر منصتنا (كالاسم، رقم الجوال، العنوان)، بالإضافة إلى استخدام بعض البيانات التحليلية لتقديم تجربة تسوق مؤتمتة وتوصيات تلائم ذوقك الرفيع.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>مشاركة البيانات:</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            لا نقوم أبداً ببيع بياناتك لأطراف خارجية. تتم مشاركة البيانات اللازمة كالعنوان مع (شركاء الشحن) ومعلومات الدفع المشفرة مع (بوابات الدفع المرخصة مثل ميسر) حصرياً.
          </p>

          <p style={{ marginTop: '2rem', color: 'var(--accent-gold)' }}>
            نلتزم بتطبيق أحدث معايير الأمان لحماية بياناتك ولضمان سير عمليات التجارة الرقمية بسلاسة وأمان تام.
          </p>
        </div>
      </div>
    </div>
  );
}
