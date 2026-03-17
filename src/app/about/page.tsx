import React from 'react';
import Link from 'next/link';

const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-12">
    <h3 className="text-xs text-[var(--accent-gold)] tracking-[0.3em] uppercase mb-4">{subtitle}</h3>
    <h2 className="text-3xl font-bold text-white font-arabic-heading">{title}</h2>
  </div>
);

/**
 * Saudi Luxury Store - The Legend (About Page)
 * قصة السيادة - صفحة تحريرية تحكي فلسفة البراند.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-[#F5F5F5] font-arabic-body mt-[80px]">
      {/* Hero Narrative */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale hover:grayscale-0 transition-all duration-[3s]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80')` }}
        />
        <div className="relative z-10 text-center max-w-4xl px-12">
          <p className="text-[var(--accent-gold)] tracking-[0.6em] uppercase text-xs mb-8">Established 2026</p>
          <h1 className="text-6xl md:text-8xl font-bold mb-12 leading-tight tracking-tighter italic font-arabic-heading">أسطورة السيادة</h1>
          <p className="text-xl leading-relaxed font-light text-[var(--text-secondary)]">
            لم نبدأ كمتجر، بل كفكرة تجريدية عن الجمال الذي يستحقه المواطن السعودي. نحن نمزج بين عراقة رمال العلا وابتكار رؤية 2030 لنخلق واقعاً تجارياً يتجاوز حدود المألوف.
          </p>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 text-right">
            <SectionHeading title="فلسفة القفاز الأبيض" subtitle="OUR PHILOSOPHY" />
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-light">
              في "السيادة"، نؤمن أن كل عملية شراء هي عهد بيننا وبين العميل. بروتوكول **Antigravity** الخاص بنا لا يضمن فقط وصول المنتج، بل يضمن وصول قطعة من الفن تم اختيارها بعناية فائقة وتدقيق بشري ومعزز بالذكاء الاصطناعي.
            </p>
            <div className="flex gap-8 justify-end">
                <button className="bg-[var(--accent-gold)] text-black px-8 py-3 rounded uppercase tracking-widest font-bold">رؤية 2030</button>
                <button className="bg-transparent border border-[var(--accent-gold)] text-[var(--accent-gold)] px-8 py-3 rounded uppercase tracking-widest font-bold">معايير النخبة</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-64 flex flex-col justify-end bg-[#1A1A1A] border border-[#333] p-6 rounded-xl">
                <span className="text-[var(--accent-gold)] text-4xl mb-4 font-light font-serif">01</span>
                <p className="text-xs uppercase tracking-widest text-white">الجودة السيادية</p>
            </div>
            <div className="h-64 flex flex-col justify-end mt-12 bg-[#1A1A1A] border border-[#333] p-6 rounded-xl">
                <span className="text-[var(--accent-gold)] text-4xl mb-4 font-light font-serif">02</span>
                <p className="text-xs uppercase tracking-widest text-white">الخصوصية المطلقة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Section */}
      <section className="py-32 text-center border-t border-[#333]">
        <div className="container mx-auto max-w-2xl px-6">
            <h3 className="text-3xl mb-12 italic opacity-60 text-white font-arabic-heading">"نحن لا نبيع السلع، نحن نؤصل للمقام الرفيع."</h3>
            <div className="w-32 h-px bg-[var(--accent-gold)] mx-auto mb-8" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-tertiary)]">كبير معماري الإمبراطورية القطيفة</p>
        </div>
      </section>
    </main>
  );
}
