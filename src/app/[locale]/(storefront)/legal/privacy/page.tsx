interface Props { params: Promise<{ locale: string }> }
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return (
    <div className="py-12"><div className="container max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-2">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
      <p className="text-sm text-ink-4 mb-8">{isAr ? 'آخر تحديث: مارس 2026' : 'Last updated: March 2026'}</p>
      {isAr ? (
        <div className="space-y-6 text-ink-2">
          <p>نحن في أسهل نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
          <section><h2 className="text-xl font-bold text-ink mb-2">ما البيانات التي نجمعها؟</h2><ul className="list-disc list-inside space-y-1"><li>الاسم والبريد الإلكتروني ورقم الجوال</li><li>عنوان التوصيل</li><li>تفاصيل الطلبات</li><li>بيانات الاستخدام (الصفحات التي تزورها)</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">كيف نستخدم بياناتك؟</h2><ul className="list-disc list-inside space-y-1"><li>معالجة طلباتك وتوصيلها</li><li>التواصل معك بشأن طلباتك</li><li>تحسين تجربتك في المتجر</li><li>إرسال عروض ترويجية (بموافقتك فقط)</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">هل نشارك بياناتك؟</h2><p>لا نبيع أو نؤجر بياناتك لأطراف ثالثة. نشارك فقط البيانات الضرورية مع شركاء الشحن لإتمام التوصيل.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">حقوقك</h2><p>يحق لك طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالتواصل معنا على hello@ashal.store.</p></section>
        </div>
      ) : (
        <div className="space-y-6 text-ink-2">
          <p>At Ashal, we respect your privacy and are committed to protecting your personal data.</p>
          <section><h2 className="text-xl font-bold text-ink mb-2">What data do we collect?</h2><ul className="list-disc list-inside space-y-1"><li>Name, email, and phone number</li><li>Delivery address</li><li>Order details</li><li>Usage data (pages you visit)</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">How do we use your data?</h2><ul className="list-disc list-inside space-y-1"><li>Process and deliver your orders</li><li>Communicate with you about your orders</li><li>Improve your store experience</li><li>Send promotions (with your consent only)</li></ul></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Do we share your data?</h2><p>We do not sell or rent your data to third parties. We only share necessary data with shipping partners to complete delivery.</p></section>
          <section><h2 className="text-xl font-bold text-ink mb-2">Your Rights</h2><p>You have the right to access, modify, or delete your data by contacting us at hello@ashal.store.</p></section>
        </div>
      )}
    </div></div>
  );
}
