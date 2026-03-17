import { GlassCard, SectionHeading, LuxuryButton } from '@/components/DesignSystem';

/**
 * Saudi Luxury Store - The Legend (About Page)
 * قصة السيادة - صفحة تحريرية تحكي فلسفة البراند.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f8f6f2] font-serif">
      {/* Hero Narrative */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale hover:grayscale-0 transition-all duration-[3s]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80')` }}
        />
        <div className="relative z-10 text-center max-w-4xl px-12">
          <p className="text-accent-gold tracking-[0.6em] uppercase text-xs mb-8">Established 2026</p>
          <h1 className="text-8xl font-light mb-12 leading-tight tracking-tighter italic">أسطورة السيادة</h1>
          <p className="text-xl leading-relaxed font-light text-gray-400">
            لم نبدأ كمتجر، بل كفكرة تجريدية عن الجمال الذي يستحقه المواطن السعودي. نحن نمزج بين عراقة رمال العلا وابتكار رؤية 2030 لنخلق واقعاً تجارياً يتجاوز حدود المألوف.
          </p>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-32 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <SectionHeading title="فلسفة القفاز الأبيض" subtitle="OUR PHILOSOPHY" />
            <p className="text-lg text-gray-400 leading-relaxed font-light">
              في "الفخامة"، نؤمن أن كل عملية شراء هي عهد بيننا وبين العميل. بروتوكول **Antigravity** الخاص بنا لا يضمن فقط وصول المنتج، بل يضمن وصول قطعة من الفن تم اختيارها بعناية فائقة وتدقيق بشري ومعزز بالذكاء الاصطناعي.
            </p>
            <div className="flex gap-8">
                <LuxuryButton variant="primary">رؤية 2030</LuxuryButton>
                <LuxuryButton variant="secondary">معايير النخبة</LuxuryButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <GlassCard className="h-64 flex flex-col justify-end">
                <span className="text-accent-gold text-4xl mb-4 font-light">01</span>
                <p className="text-xs uppercase tracking-widest">الجودة السيادية</p>
            </GlassCard>
            <GlassCard className="h-64 flex flex-col justify-end mt-12">
                <span className="text-accent-gold text-4xl mb-4 font-light">02</span>
                <p className="text-xs uppercase tracking-widest">الخصوصية المطلقة</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Signature Section */}
      <section className="py-32 text-center border-t border-white/5">
        <div className="container max-w-2xl">
            <h3 className="text-3xl mb-12 italic opacity-60">"نحن لا نبيع السلع، نحن نؤصل للمقام الرفيع."</h3>
            <div className="w-32 h-px bg-accent-gold mx-auto mb-8" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">عبدالرحمن الفخراني - كبير معماري الإمبراطورية</p>
        </div>
      </section>
    </main>
  );
}
