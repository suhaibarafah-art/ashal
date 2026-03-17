import { prisma } from '@/lib/prisma';
import { SectionHeading, CountdownTimer, EditorialCard } from '@/components/DesignSystem';
import Link from 'next/link';
import CategoryNav from '@/components/CategoryNav';
import SmartSearch from '@/components/SmartSearch';

/**
 * Saudi Luxury Store - Editorial Homepage (The Ounass Killer)
 * الواجهة الإمبراطورية - تجربة عرض بيضاء نقية مستوحاة من المجلات العالمية.
 */
export default async function Home() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-white text-black selection:bg-[#EAEAEA]">
      {/* 
        Editorial Hero Section - Crisp, Bright, Fashion-Forward
      */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA] mt-[80px]">
        {/* High-Fashion Editorial Image Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=90&w=2560')`,
              backgroundPosition: '50% 30%'
            }}
          />
          {/* Very subtle light gradient to ensure text readability if needed, but mostly clean */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
        </div>

        {/* Hero Content - Stark Black Text */}
        <div className="relative z-20 container flex flex-col items-center justify-center text-center mt-32">
          <span className="text-[#555] text-[10px] uppercase tracking-[0.5em] mb-6 animate-fade-in font-medium bg-white/80 px-4 py-1">
            New Collection 2026
          </span>

          <h1 className="text-6xl md:text-[120px] font-light tracking-tighter leading-none mb-4 text-black mix-blend-multiply">
            <span className="luxury-serif">ELEVATE</span>
          </h1>

          <h2 className="text-2xl md:text-4xl font-light mb-12 text-[#222] tracking-wider font-arabic-heading">
            عنوان الأناقة <span className="italic font-serif">السيادية</span>
          </h2>

          <Link href="#collection" className="mt-8">
            <button className="bg-black text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] hover:bg-[#222] transition-colors duration-300">
              تسوق الآن
            </button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <div className="relative z-30">
        <CategoryNav />
      </div>

      <div className="container mt-16 mb-24">
        <SmartSearch />
      </div>

      {/* The Collection - 4 Column Editorial Grid */}
      <section className="py-20 bg-white" id="collection">
        <div className="container">
          <SectionHeading title="أحدث الإصدارات" subtitle="Just Landed" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((product: any, index: number) => {
              const images = [
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1599643478514-4a820c56a8cc?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1600185906355-6c703e2e8e97?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1550592704-6c76defa99ce?auto=format&fit=crop&q=80',
              ];
              const bgImage = images[index % images.length];

              return (
                <div key={product.id} className="group cursor-pointer flex flex-col">
                  {/* Image Container - Ounass Style (Tall aspect ratio, light gray bg) */}
                  <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden bg-[#F5F5F5]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    
                    {/* Floating Add to Wishlist Button (Like Ounass) */}
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>

                  {/* Product Details - Stark Minimalist */}
                  <div className="px-1 text-center md:text-right flex flex-col flex-1">
                    <h4 className="text-[13px] font-bold text-black uppercase tracking-widest mb-2 font-arabic-heading">
                      {product.titleAr}
                    </h4>
                    <p className="text-[11px] text-[#777] font-light mb-4 line-clamp-1">
                      {product.descAr}
                    </p>
                    <div className="mt-auto pt-2">
                       <span className="text-[13px] text-black font-medium tracking-wider">
                        SAR {product.finalPrice}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-20">
             <Link href="/shop">
                <button className="border border-black bg-transparent text-black px-12 py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-colors duration-300">
                  عرض جميع المقتنيات
                </button>
             </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition / Trust - Ounass Style Services */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#EAEAEA]">
        <div className="container max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3">توصيل ملكي في ساعتين</h4>
                    <p className="text-xs text-[#555] leading-relaxed max-w-xs">متوفر الآن في الرياض. الفخامة لا تنتظر، تصلك في أسرع وقت مع أسطولنا الخاص.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3">تغليف فاخر مجاني</h4>
                    <p className="text-xs text-[#555] leading-relaxed max-w-xs">كل قطعة تصلك مغلفة بشريط حريري وصندوق فاخر يحمل ختم السيادة.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center rounded-full">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-3">أمان وضمان (ZATCA)</h4>
                    <p className="text-xs text-[#555] leading-relaxed max-w-xs">معاملات بنكية مشفرة وفواتير ضريبية معتمدة لحماية متكاملة.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
