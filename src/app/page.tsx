import { prisma } from '@/lib/prisma';
import { GlassCard, SectionHeading, CountdownTimer } from '@/components/DesignSystem';
import Link from 'next/link';
import CategoryNav from '@/components/CategoryNav';
import SmartSearch from '@/components/SmartSearch';

/**
 * Saudi Luxury Store - Editorial Homepage (Sovereign Phase 2 - Cinematic)
 * الواجهة الإمبراطورية - تجربة عرض سينمائية للمنتجات النخبوية.
 */
export default async function Home() {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#020202] text-[#faf8f5] mix-blend-isolation">
      {/* 
        Sovereign Hero Section - Cinematic Entry 
        Replaces abstract CSS gradients with a stark, brutalist minimalist video-feel.
      */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Deep Abstract Visual Layer */}
        <div className="absolute inset-0 z-0 bg-black pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 animate-[pulse_10s_ease-in-out_infinite] scale-105"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent, #020202), url('https://images.unsplash.com/photo-1600185906355-6c703e2e8e97?auto=format&fit=crop&q=90&w=2560')`,
              filter: 'contrast(1.2) grayscale(0.2)',
            }}
          />
          {/* Subtle noise overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
          />
        </div>

        {/* Hero Content - Perfectly Centered, Massive Typography */}
        <div className="relative z-20 container flex flex-col items-center justify-center text-center mt-20">
          <span className="text-[#c5a975] text-[9px] uppercase tracking-[0.6em] mb-12 opacity-80 animate-fade-in font-light">
            Sovereign Empire 2026
          </span>

          <h1 className="text-[10vw] md:text-[140px] font-thin tracking-tighter leading-[0.85] mb-6 text-white drop-shadow-2xl">
            <span className="luxury-serif">SOVEREIGN</span>
          </h1>

          <h2 className="text-3xl md:text-5xl font-light mb-16 text-[#e0ca9a] tracking-wider font-arabic-heading opacity-90">
            أعلى درجات <span className="italic font-serif">السيادة</span>
          </h2>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#999994] mb-20 leading-[2.5] font-light opacity-80 hidden md:block">
            نحن لا نبيع منتجات، بل ننتقي لك الفخامة. تشكيلة حصرية مصممة لتجسيد الذوق الملكي بعيداً عن صخب السوق التقليدي. تجربة تسوق مخصصة لذوي النُخبة.
          </p>

          {/* Minimalist Action */}
          <Link href="#collection" className="group">
            <div className="flex flex-col items-center gap-6 opacity-70 hover:opacity-100 transition-opacity duration-700 cursor-pointer p-8">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white">Scroll to Discover</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#c5a975] to-transparent animate-bounce mt-2" />
            </div>
          </Link>
        </div>
      </section>

      {/* Floating Navigation (Sleek) */}
      <div className="relative z-30 -mt-8 px-4" id="collection">
        <CategoryNav />
      </div>

      <div className="container relative z-30 mt-12 mb-32">
        <SmartSearch />
      </div>

      {/* The Collection - Spacious Editorial Grid */}
      <section className="py-32 bg-[#050505] relative border-t border-white/[0.02]">
        <div className="container px-4 md:px-12">
          {/* Editorial Section Header */}
          <div className="flex flex-col items-center text-center mb-32">
            <h3 className="text-sm text-[#c5a975] uppercase tracking-[0.5em] mb-6 font-light">Curated Hype</h3>
            <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8">مجموعة الهبّة</h2>
            <div className="w-px h-24 bg-[#c5a975] opacity-30" />
          </div>

          {/* Products Grid - Increased spacing and size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
            {products.map((product: any, index: number) => {
              // Extracting a random luxury image based on index for demo purposes
              const images = [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1599643478514-4a820c56a8cc?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80',
              ];
              const bgImage = images[index % images.length];

              return (
                <div key={product.id} className="group cursor-pointer">
                  {/* Image Container - Tall and dramatic */}
                  <div className="relative h-[600px] md:h-[750px] w-full mb-10 overflow-hidden bg-[#0a0a09]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    {/* Shadow overlay to make text pop if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-60" />

                    <div className="absolute bottom-8 left-8">
                       <CountdownTimer targetDate="2026-12-31" />
                    </div>
                  </div>

                  {/* Product Details - Minimalist */}
                  <div className="px-2 flex flex-col items-center text-center space-y-4">
                    <h4 className="text-3xl font-light text-white group-hover:text-[#c5a975] transition-colors duration-500">
                      {product.titleAr}
                    </h4>
                    <p className="text-sm text-[#999994] font-light max-w-sm leading-relaxed hidden md:block">
                      {product.descAr}
                    </p>
                    <div className="flex items-center gap-6 pt-6">
                      <span className="text-xl text-[#e0ca9a] luxury-serif tracking-widest">
                        SAR {product.finalPrice}
                      </span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <Link href={`/products/${product.id}`}>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white border-b border-white/10 pb-1 hover:border-[#c5a975] transition-colors duration-500">
                          اكتشف القطعة
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Legacy Section - Rethought for luxury */}
      <section className="py-40 bg-[#020202] border-t border-white/[0.02]">
        <div className="container max-w-5xl text-center flex flex-col items-center">
            <h3 className="text-[10px] uppercase tracking-[0.5em] text-[#c5a975] mb-8 font-light">Heritage & Trust</h3>
            <h2 className="text-4xl md:text-5xl font-light mb-16 leading-tight">
              نحن نمثل الرؤية الملكية في <br /> عالم التجارة الإلكترونية الرقمية.
            </h2>
            <div className="w-px h-16 bg-white/10 mb-16" />
            <p className="text-[#999994] font-light leading-loose max-w-2xl text-sm md:text-base">
              متوافقون تماماً مع معايير هيئة الزكاة والضريبة والجمارك (ZATCA). كل معاملة مشفرة بأمان سيادي مطلق لضمان الخصوصية والراحة المكتملة لعملائنا النخبة. إرثنا يبدأ من هنا.
            </p>
            
            <div className="flex items-center justify-center gap-12 mt-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="text-[9px] tracking-widest uppercase border border-white/20 px-6 py-4">Zatca Certified</div>
                <div className="text-[9px] tracking-widest uppercase border border-white/20 px-6 py-4">Moyasar Secure</div>
                <div className="text-[9px] tracking-widest uppercase border border-white/20 px-6 py-4">Vision 2030 Ready</div>
            </div>
        </div>
      </section>
    </main>
  );
}
