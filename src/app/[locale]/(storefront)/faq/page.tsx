import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ locale: string }>;
}

interface FaqItem {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const defaultFaqs: FaqItem[] = [
  {
    questionAr: 'كيف أتتبع طلبي؟',
    questionEn: 'How do I track my order?',
    answerAr: 'يمكنك تتبع طلبك من خلال صفحة تتبع الطلبات باستخدام رقم الطلب الذي أرسلناه إليك عبر البريد الإلكتروني.',
    answerEn: 'You can track your order through the order tracking page using the order number we sent to your email.',
  },
  {
    questionAr: 'هل الدفع عند الاستلام متاح؟',
    questionEn: 'Is Cash on Delivery available?',
    answerAr: 'نعم، الدفع عند الاستلام متاح لجميع المناطق في المملكة العربية السعودية.',
    answerEn: 'Yes, Cash on Delivery is available for all regions in Saudi Arabia.',
  },
  {
    questionAr: 'ما هي سياسة الإرجاع؟',
    questionEn: 'What is the return policy?',
    answerAr: 'نقبل الإرجاع خلال 14 يوم من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية.',
    answerEn: 'We accept returns within 14 days of receipt, provided the product is in its original condition.',
  },
  {
    questionAr: 'كم يستغرق التوصيل؟',
    questionEn: 'How long does delivery take?',
    answerAr: 'يستغرق التوصيل عادةً من 2 إلى 5 أيام عمل حسب موقعك.',
    answerEn: 'Delivery usually takes 2-5 business days depending on your location.',
  },
  {
    questionAr: 'هل الشحن مجاني؟',
    questionEn: 'Is shipping free?',
    answerAr: 'الشحن مجاني على الطلبات التي تتجاوز 200 ريال سعودي. للطلبات الأقل، رسوم الشحن 25 ريال.',
    answerEn: 'Shipping is free on orders over SAR 200. For smaller orders, shipping fee is SAR 25.',
  },
];

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;

  let faqs = defaultFaqs;
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'faqs' } });
    if (setting && Array.isArray(setting.value)) {
      faqs = setting.value as FaqItem[];
    }
  } catch {
    // Use defaults
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
          {locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="card p-5 group cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-ink list-none">
                {locale === 'ar' ? faq.questionAr : faq.questionEn}
                <span className="text-brand-500 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-ink-3 mt-3 leading-relaxed">
                {locale === 'ar' ? faq.answerAr : faq.answerEn}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center bg-brand-50 rounded-xl p-6">
          <p className="font-medium text-ink mb-2">
            {locale === 'ar' ? 'لديك سؤال آخر؟' : 'Have another question?'}
          </p>
          <a href={`/${locale}/contact`} className="btn-primary">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </div>
      </div>
    </div>
  );
}
