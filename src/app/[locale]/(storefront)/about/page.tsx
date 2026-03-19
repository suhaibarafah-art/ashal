interface Props { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return (
    <div className="py-12 md:py-16">
      <div className="container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">
          {isAr ? 'من نحن' : 'About Us'}
        </h1>

        {isAr ? (
          <div className="prose prose-lg text-ink-2 space-y-4">
            <p>
              <strong>أسهل</strong> متجر إلكتروني سعودي متخصص في منتجات يومية ذكية تحل مشاكل حقيقية وتبسّط حياتك.
            </p>
            <p>
              نؤمن أن كل منتج نبيعه يجب أن يكون ذا قيمة حقيقية — لا بضاعة عشوائية ولا ترند مؤقت. نختار كل منتج بعناية بناءً على فائدته العملية ومناسبته للحياة في السعودية والخليج.
            </p>
            <h2 className="text-xl font-bold text-ink mt-8">قيمنا</h2>
            <ul className="space-y-2">
              <li>✓ <strong>البساطة:</strong> منتجات تحل مشكلة بطريقة بسيطة وذكية</li>
              <li>✓ <strong>الجودة:</strong> نختبر ونراجع كل منتج قبل عرضه</li>
              <li>✓ <strong>الشفافية:</strong> أسعار واضحة، سياسات واضحة، لا مفاجآت</li>
              <li>✓ <strong>الخدمة:</strong> دعم حقيقي لعملاء حقيقيين</li>
            </ul>
            <h2 className="text-xl font-bold text-ink mt-8">تواصل معنا</h2>
            <p>
              البريد الإلكتروني: <a href="mailto:hello@ashal.store" className="text-brand-500">hello@ashal.store</a><br />
              واتساب: <a href="https://wa.me/966500000000" className="text-brand-500">+966 50 000 0000</a>
            </p>
          </div>
        ) : (
          <div className="prose prose-lg text-ink-2 space-y-4">
            <p>
              <strong>Ashal</strong> is a Saudi e-commerce store specializing in smart daily products that solve real problems and simplify your life.
            </p>
            <p>
              We believe every product we sell must have real value — no random products, no temporary trends. We carefully select each product based on its practical utility and suitability for life in Saudi Arabia and the Gulf.
            </p>
            <h2 className="text-xl font-bold text-ink mt-8">Our Values</h2>
            <ul className="space-y-2">
              <li>✓ <strong>Simplicity:</strong> Products that solve problems simply and smartly</li>
              <li>✓ <strong>Quality:</strong> We test and review every product before listing</li>
              <li>✓ <strong>Transparency:</strong> Clear prices, clear policies, no surprises</li>
              <li>✓ <strong>Service:</strong> Real support for real customers</li>
            </ul>
            <h2 className="text-xl font-bold text-ink mt-8">Contact Us</h2>
            <p>
              Email: <a href="mailto:hello@ashal.store" className="text-brand-500">hello@ashal.store</a><br />
              WhatsApp: <a href="https://wa.me/966500000000" className="text-brand-500">+966 50 000 0000</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
