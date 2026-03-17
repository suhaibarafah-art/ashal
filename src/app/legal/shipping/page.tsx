import React from 'react';
import { GlassCard, SectionHeading } from '@/components/DesignSystem';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#020202] py-32 px-6">
      <div className="container max-w-4xl mx-auto text-[#faf8f5]">
        <SectionHeading title="الشحن الملكي" subtitle="Sovereign Logistics" />
        
        <GlassCard className="prose prose-invert max-w-none font-light leading-loose text-sm text-[#999994]">
          <h2 className="text-[#c5a975] text-xl mb-4">1. اللوجستيات الذكية</h2>
          <p className="mb-8">
            نعتمد في إمبراطوريتنا على أحدث التقنيات لضمان وصول المقتنيات النادرة في أقصر مدة ممكنة، بفضل الأتمتة المتقدمة لعمليات سلسلة التوريد (CJ Dropshipping / Zendrop).
          </p>
          
          <h2 className="text-[#c5a975] text-xl mb-4">2. توقيت الإنجاز</h2>
          <p className="mb-8">
            تتم معالجة الطلبات وإرسالها للموردين آلياً بمجرد تأكيد الدفع وتسجيل الفاتورة الضريبية ZATCA. تتراوح مدة الشحن من 7 إلى 14 يوم عمل لضمان خلو المقتنيات من العيوب وصولاً إلى بابكم.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
