import React from 'react';
import { GlassCard, SectionHeading } from '@/components/DesignSystem';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020202] py-32 px-6">
      <div className="container max-w-4xl mx-auto text-[#faf8f5]">
        <SectionHeading title="الشروط والأحكام" subtitle="Terms & Conditions" />
        
        <GlassCard className="prose prose-invert max-w-none font-light leading-loose text-sm text-[#999994]">
          <h2 className="text-[#c5a975] text-xl mb-4">1. الإطار العام</h2>
          <p className="mb-8">
            بموافقتك على استخدام منصتنا، أنت تخضع لقوانين التجارة الإلكترونية في المملكة العربية السعودية. المنصة تستخدم أنظمة تسعير ديناميكية مبنية على العرض والطلب (Dynamic Pricing) وقد تتغير الأسعار بناءً على ندرة القطع.
          </p>
          
          <h2 className="text-[#c5a975] text-xl mb-4">2. التزامات النخبة</h2>
          <p className="mb-8">
            المنتجات المعروضة هي قطع حصرية ومختارة بعناية. نلتزم بتسليمها بحالتها الأصلية مع توثيق كامل لفاتورة الشراء الضريبية المعتمدة (ZATCA). في المقابل، يلتزم العميل بدقة البيانات المدخلة لتسهيل عملية الفوترة والشحن السيادي.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
