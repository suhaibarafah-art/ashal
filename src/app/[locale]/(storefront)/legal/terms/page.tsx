interface Props { params: Promise<{ locale: string }> }
export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return (
    <div className="py-12"><div className="container max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-2">{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</h1>
      <p className="text-sm text-ink-4 mb-8">{isAr ? 'آخر تحديث: مارس 2026' : 'Last updated: March 2026'}</p>
      {isAr ? (
        <div className="space-y-6 text-ink-2">
          <p>باستخدامك لموقع أسهل، فإنك توافق على الشروط والأحكام التالية.</p>
          <section><h2 className="text-xl font-bold text-ink mb-2">1. استخدام الموقع</h2><p>يجب أن يكون عمرك 18 سنة أو أكثر لإجراء عمليات الشراء. أنت مسؤول عن دقة المعلومات التي تقدمها.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">2. الطلبات والدفع</h2><p>جميع الأسعار بالريال السعودي وشاملة ضريبة القيمة المضافة. نحتفظ بالحق في رفض أي طلب في حالات الاشتباه بالاحتيال.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">3. المنتجات</h2><p>نسعى جاهدين لضمان دقة معلومات المنتجات، لكن قد تكون هناك اختلافات طفيفة بين الصورة والمنتج الفعلي.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">4. الملكية الفكرية</h2><p>جميع محتويات الموقع محمية بحقوق الملكية الفكرية. لا يُسمح بنسخ أو توزيع المحتوى دون إذن كتابي.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">5. تعديل الشروط</h2><p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إعلامك بأي تغييرات جوهرية.</p></section>
        </div>
      ) : (
        <div className="space-y-6 text-ink-2">
          <p>By using the Ashal website, you agree to the following terms and conditions.</p>
          <section><h2 className="text-xl font-bold text-ink mb-2">1. Use of Website</h2><p>You must be 18 or older to make purchases. You are responsible for the accuracy of information you provide.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">2. Orders & Payment</h2><p>All prices are in Saudi Riyals and include VAT. We reserve the right to refuse orders in cases of suspected fraud.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">3. Products</h2><p>We strive to ensure product information accuracy, but there may be minor differences between images and actual products.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">4. Intellectual Property</h2><p>All website content is protected by intellectual property rights. Content may not be copied or distributed without written permission.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">5. Modifications</h2><p>We reserve the right to modify these terms at any time. You will be notified of material changes.</p></section>
        </div>
      )}
    </div></div>
  );
}
