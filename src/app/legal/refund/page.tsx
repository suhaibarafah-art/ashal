import React from 'react';
import { GlassCard, SectionHeading } from '@/components/DesignSystem';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#020202] py-32 px-6">
      <div className="container max-w-4xl mx-auto text-[#faf8f5]">
        <SectionHeading title="الاسترجاع والاستبدال" subtitle="Refund Policy - ZATCA Compliant" />
        
        <GlassCard className="prose prose-invert max-w-none font-light leading-loose text-sm text-[#999994]">
          <h2 className="text-[#c5a975] text-xl mb-4">1. سياسة الاسترجاع السيادية</h2>
          <p className="mb-8">
            في عالم الفخامة، الخطأ غير مقبول. يمكنك تقديم طلب استرجاع للقطعة خلال 7 أيام من تاريخ الاستلام، بشرط أن تكون في حالتها التغليفية الأصلية غير مفتوحة وغير مستخدمة، وذلك بموجب قانون التجارة الإلكترونية السعودي.
          </p>
          
          <h2 className="text-[#c5a975] text-xl mb-4">2. الإعدادات المالية</h2>
          <p className="mb-8">
            يتم استرداد المبلغ عبر نفس طريقة الدفع الأصلية (آبل باي، مدى، أو تمارا) خلال مدة تتراوح بين 3 إلى 14 يوم عمل. مع الأخذ بعين الاعتبار أي رسوم بنكية دولية إن وجدت. سيتم إصدار إشعار دائن (Credit Note) معتمد من هيئة الزكاة والضريبة والجمارك (ZATCA) لحظياً بانتهاء عملية الاسترداد.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
