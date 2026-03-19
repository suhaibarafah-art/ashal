interface Props { params: Promise<{ locale: string }> }
export default async function ReturnsPolicyPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return (
    <div className="py-12"><div className="container max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-8">{isAr ? 'سياسة الإرجاع' : 'Returns Policy'}</h1>
      {isAr ? (
        <div className="space-y-6 text-ink-2">
          <section><h2 className="text-xl font-bold text-ink mb-2">مدة الإرجاع</h2><p>يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">شروط الإرجاع</h2><ul className="list-disc list-inside space-y-1"><li>يجب أن يكون المنتج في حالته الأصلية وغير مستخدم</li><li>يجب الاحتفاظ بالعبوة الأصلية</li><li>لا يقبل إرجاع المنتجات التي تم فتح تغليفها لأسباب صحية</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">كيفية الإرجاع</h2><p>تواصل معنا على hello@ashal.store أو واتساب وسنرتب لك عملية الإرجاع.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">الاسترداد</h2><p>يتم استرداد المبلغ خلال 5–10 أيام عمل بعد استلام المنتج المُرجع وفحصه.</p></section>
        </div>
      ) : (
        <div className="space-y-6 text-ink-2">
          <section><h2 className="text-xl font-bold text-ink mb-2">Return Period</h2><p>You can return a product within 14 days of receipt.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Return Conditions</h2><ul className="list-disc list-inside space-y-1"><li>Product must be in original condition and unused</li><li>Original packaging must be retained</li><li>Products with opened hygienic packaging cannot be returned</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">How to Return</h2><p>Contact us at hello@ashal.store or WhatsApp and we will arrange the return process.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Refunds</h2><p>Refunds are processed within 5–10 business days after receiving and inspecting the returned product.</p></section>
        </div>
      )}
    </div></div>
  );
}
