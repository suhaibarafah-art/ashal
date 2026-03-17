import React from 'react';
import { GlassCard, SectionHeading } from '@/components/DesignSystem';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#020202] py-32 px-6">
      <div className="container max-w-4xl mx-auto text-[#faf8f5]">
        <SectionHeading title="سياسة الخصوصية" subtitle="Privacy Policy - ZATCA Compliant" />
        
        <GlassCard className="prose prose-invert max-w-none font-light leading-loose text-sm text-[#999994]">
          <h2 className="text-[#c5a975] text-xl mb-4">1. التشفير السيادي للبيانات</h2>
          <p className="mb-8">
            في متجرنا، نتعامل مع بيانات عملائنا النخبة بأقصى درجات السرية. كافة بيانات الدفع مشفرة عبر قنوات اتصالات آمنة (SSL/TLS)، ولا نقوم بتخزين تفاصيل البطاقات الائتمانية على خوادمنا بل تتم معالجتها لحظياً عبر شريكنا المعتمد "ميسر" (Moyasar) وفقاً لمعايير مؤسسة النقد العربي السعودي (SAMA).
          </p>
          
          <h2 className="text-[#c5a975] text-xl mb-4">2. التوافق مع وزارة التجارة و ZATCA</h2>
          <p className="mb-8">
            بصفتنا كياناً تجارياً مسجلاً ومعتمداً، نلتزم بمشاركة البيانات الضرورية فقط والخاصة بالفواتير الضريبية (E-Invoicing) لضمان الامتثال التام مع هيئة الزكاة والضريبة والجمارك (ZATCA). كافة الوثائق الصادرة مشفرة بختم رقمي آمن.
          </p>

          <h2 className="text-[#c5a975] text-xl mb-4">3. استخدام الذكاء الاصطناعي</h2>
          <p className="mb-8">
            نستخدم خوارزميات تحليل البيانات لتخصيص تجربة التصفح الخاصة بك (Personal Stylist AI). يتم معالجة تفضيلاتك محلياً لضمان عدم مشاركتها مع أطراف ثالثة لأغراض دعائية رخيصة. الفخامة تبدأ من احترام المساحة الشخصية.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
