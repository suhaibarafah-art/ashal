import { prisma } from '@/lib/prisma';
import { GlassCard, GoldLine, LuxuryButton, SectionHeading, CountdownTimer } from '@/components/DesignSystem';
import Link from 'next/link';
import { getDynamicBackground } from '@/lib/staging-engine';
import { localizeReview } from '@/lib/social-proof';
import SmartSearch from '@/components/SmartSearch';
import CategoryNav from '@/components/CategoryNav';

/**
 * Saudi Luxury Store - Editorial Homepage (Sovereign Phase 1)
 * الواجهة الإمبراطورية - تجربة عرض سينمائية للمنتجات النخبوية.
 */
export default async function Home() {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#050505] text-[#f8f6f2]">
      {/* Editorial Announcement */}
      <div className="bg-[#b38b4d] text-[#050505] py-2 text-center text-[10px] uppercase tracking-[0.3em] font-bold">
        الشحن الملكي متاح الآن لجميع مدن المملكة لعام 2026
      </div>

      {/* Sovereign Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Visual (Simulated Cinematic) */}
        <div className="absolute inset-0 z-0 scale-105 animate-pulse-slow">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-10" />
            <div 
              className="w-full h-full bg-cover bg-center opacity-40 transition-transform duration-[20s] hover:scale-110"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512632571867-0c1e7c59d8ba?auto=format&fit=crop&q=80')` }}
            />
        </div>

        <div className="relative z-20 container text-center">
            <span className="text-accent-gold-bright text-[10px] uppercase tracking-[0.5em] mb-8 block animate-fade-in">Sovereign Edition 2026</span>
            <h1 className="text-[120px] font-light tracking-tighter leading-[0.9] mb-12 luxury-serif">
                تعريف الفخامة <br />
                <span className="italic text-accent-gold">الرقميّة</span>
            </h1>
            <p className="max-w-xl mx-auto text-sm text-gray-400 mb-12 leading-relaxed font-light">
                نحن لا نبيع المنتجات، بل ننتقي لك السيادة. قطع استثنائية تم اختيارها بواسطة ذكاء اصطناعي يفهم عمق الذوق السعودي الرفيع.
            </p>
            <div className="flex justify-center gap-8">
                <LuxuryButton variant="primary">اكتشف المجموعة</LuxuryButton>
                <LuxuryButton variant="secondary">قصة البراند</LuxuryButton>
            </div>
        </div>
      </section>

      <CategoryNav />

      <div className="container relative -mt-10 z-30">
        <SmartSearch />
      </div>

      {/* Featured Grid - Hype Selections */}
      <section className="py-32 bg-[#080808]">
        <div className="container">
          <SectionHeading title="مجموعة الهبّة" subtitle="Curated Velocity" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product: any) => {
              const bgImage = getDynamicBackground(product.titleAr);
              const mockReview = { author: "Noura", rating: 5, text: "Truly Royal" };
              const saudiProof = localizeReview(mockReview);
              
              return (
                <GlassCard key={product.id} className="group">
                  <div className="relative h-[450px] mb-8 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), #080808), url(${bgImage})` }}
                    />
                    <div className="absolute bottom-6 left-6 right-6">
                        <CountdownTimer targetDate="2026-12-31" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-2xl font-light">{product.titleAr}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-12">{product.descAr}</p>
                    
                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <span className="text-xl text-accent-gold font-serif">SAR {product.finalPrice}</span>
                        <Link href={`/products/${product.id}`}>
                            <span className="text-[10px] uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:border-accent-gold transition-colors">
                                عرض التفاصيل
                            </span>
                        </Link>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Heritage Section */}
      <section className="py-32 border-t border-white/5">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
                <SectionHeading title="موثوقية سيادية" subtitle="ZATCA COMPLIANT" />
                <p className="text-gray-400 font-light leading-loose mb-12">
                    نلتزم في منصتنا بأعلى معايير التوثيق السعودي. فواتيرنا متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك، وعملياتنا مشفرة بأحدث التقنيات السيادية لضمان خصوصية النخبة.
                </p>
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 border border-accent-gold/30 flex center text-[8px] text-center p-2 uppercase">Verified Business</div>
                    <div className="w-16 h-16 border border-accent-gold/30 flex center text-[8px] text-center p-2 uppercase">VAT Certified</div>
                </div>
            </div>
            <GlassCard>
                <div className="space-y-8">
                    <h3 className="text-2xl">تتبع الإمبراطورية اللحظي</h3>
                    <div className="h-64 bg-black/40 border border-white/5 flex items-center justify-center italic text-xs text-accent-gold">
                        تجربة تسوق آمنة وسلسة
                    </div>
                </div>
            </GlassCard>
        </div>
      </section>
    </main>
  );
}
