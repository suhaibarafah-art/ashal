'use client';

import React from 'react';

/**
 * Saudi Luxury Store - Sovereign Legal & Trust Editorial
 * الوثائق القانونية - اتفاقيات الخصوصية والشروط بأسلوب تحريري فاخر.
 */
export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-[#f8f6f2] py-32 px-12 font-serif">
      <div className="max-w-4xl mx-auto">
        <header className="mb-24 text-center">
          <p className="text-[#b38b4d] tracking-[0.4em] uppercase text-xs mb-4">Integrity & Sovereignty</p>
          <h1 className="text-6xl font-light tracking-tight mb-8">اتفاقية السيادة <br/><span className="text-[#b38b4d]">والخصوصية</span></h1>
          <div className="h-px w-24 bg-[#b38b4d] mx-auto opacity-30"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl mb-4 font-light text-[#b38b4d]">1. ميثاق الفخامة</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                يلتزم متجر "الفخامة السعودية" بتقديم أرقى المنتجات المختارة بعناية. باستخدامك لمنصتنا، أنت توافق على احترام معاييرنا السيادية وشروط التعامل الراقي التي نعتمدها في عام 2026.
              </p>
            </div>
            <div>
              <h2 className="text-2xl mb-4 font-light text-[#b38b4d]">2. قدسية البيانات</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                بياناتك ليست مجرد معلومات، بل هي أمانة سيادية. نستخدم تشفيراً بمستوى عسكري لضمان أن تبقى خصوصية عملائنا النخبة بعيدة عن الأعين ومحمية بالكامل.
              </p>
            </div>
          </div>

          <div className="space-y-12">
             <div>
              <h2 className="text-2xl mb-4 font-light text-[#b38b4d]">3. سياسة الاسترجاع الملكية</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                نحن نثق في جودة ما نقدم. إذا لم تكن تجربتك ترقى لمستوى تطلعاتك العالية، فإن فريقنا المختص سيقوم بمعالجة طلبك خلال 24 ساعة بأسلوب "القفاز الأبيض".
              </p>
            </div>
            <div className="bg-[#b38b4d]/5 p-8 border border-[#b38b4d]/10 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b38b4d] mb-4">Official Verification</p>
                <p className="text-xs text-gray-500 italic">
                    "هذه الوثيقة تخضع لأنظمة التجارة الإلكترونية في المملكة العربية السعودية ومتوافقة مع رؤية 2030 لتمكين السيادة الرقمية."
                </p>
            </div>
          </div>
        </section>

        <footer className="mt-40 pt-12 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-600">
          <p>Verified by Antigravity Protocol</p>
          <p>Version 2.0 (2026 Edition)</p>
        </footer>
      </div>
    </div>
  );
}
