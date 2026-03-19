interface Props { params: Promise<{ locale: string }> }
export default async function ShippingPolicyPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return (
    <div className="py-12"><div className="container max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-8">{isAr ? 'سياسة الشحن' : 'Shipping Policy'}</h1>
      {isAr ? (
        <div className="space-y-6 text-ink-2">
          <section><h2 className="text-xl font-bold text-ink mb-2">مناطق الشحن</h2><p>نشحن إلى جميع مناطق المملكة العربية السعودية. لا نشحن خارج المملكة حالياً.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">مدة التوصيل</h2><p>2–5 أيام عمل في المدن الرئيسية (الرياض، جدة، الدمام). 4–7 أيام عمل في باقي المناطق.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">رسوم الشحن</h2><p>الشحن مجاني على الطلبات التي تزيد عن 200 ريال سعودي. رسوم الشحن للطلبات أقل من 200 ريال: 25 ريال سعودي.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">العنوان الوطني</h2><p>للتوصيل الدقيق وتجنب التأخير، يُنصح باستخدام العنوان الوطني السعودي عند تعبئة بيانات التوصيل.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">تتبع الشحنة</h2><p>ستصلك رسالة تأكيد برقم الطلب بعد اكتمال الطلب. يمكنك تتبع طلبك من خلال صفحة تتبع الطلب.</p></section>
        </div>
      ) : (
        <div className="space-y-6 text-ink-2">
          <section><h2 className="text-xl font-bold text-ink mb-2">Shipping Areas</h2><p>We ship to all regions of Saudi Arabia. We do not ship internationally at this time.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Delivery Time</h2><p>2–5 business days in major cities (Riyadh, Jeddah, Dammam). 4–7 business days in other regions.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Shipping Fees</h2><p>Free shipping on orders over SAR 200. Shipping fee for orders under SAR 200: SAR 25.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">National Address</h2><p>For accurate delivery and to avoid delays, we recommend using the Saudi National Address when filling in your delivery details.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Order Tracking</h2><p>You will receive a confirmation with your order number. You can track your order through the track order page.</p></section>
        </div>
      )}
    </div></div>
  );
}
