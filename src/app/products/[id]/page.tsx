import { prisma } from '@/lib/prisma';
import { getDynamicBackground } from '@/lib/staging-engine';
import { localizeReview } from '@/lib/social-proof';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RecentlyViewed from '@/components/RecentlyViewed';
import HistoryTracer from '@/components/HistoryTracer';
import SovereignPulse from '@/components/SovereignPulse';
import AIPersonalStylist from '@/components/AIPersonalStylist';

/**
 * Saudi Luxury Store - Detailed Product Page
 * صفحة المنتج التفصيلية - تجربة عرض نخبوية مع أدق التفاصيل.
 */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) notFound();

  const bgImage = getDynamicBackground(product.titleAr);
  const mockReview = { author: "فيصل", rating: 5, text: "Truly Exceptional" };
  const saudiProof = localizeReview(mockReview);

  return (
    <main className="min-h-screen bg-[#040404] text-[#f8f6f2] font-serif">
      {/* Editorial Header */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-110 animate-unboxing"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(4,4,4,0.1) 0%, #040404 100%), url(${bgImage})` }}
        />
        <div className="relative z-10 text-center px-12 animate-fade-in-up">
          <p className="text-[#b38b4d] tracking-[0.6em] uppercase text-[9px] mb-8 opacity-60">Sovereign Curation</p>
          <h1 className="text-8xl font-light tracking-tighter mb-8 leading-tight luxury-serif drop-shadow-2xl">{product.titleAr}</h1>
          <div className="flex items-center justify-center gap-8 text-sm tracking-widest text-[#b38b4d]">
            <span>SAR {product.finalPrice}</span>
            <span className="h-4 w-px bg-[#b38b4d]/30" />
            <SovereignPulse stockStatus="LOW" />
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="max-w-7xl mx-auto px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Left: Persuasive Copy */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#b38b4d] mb-8">عن القطعة</h2>
            <p className="text-xl leading-relaxed font-light text-gray-300">
              {product.descAr}
            </p>
          </div>

          <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-12">
            <div>
                <h4 className="text-xs uppercase tracking-widest text-[#b38b4d] mb-4">التوصيل والسيادة</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                    توصيل ملكي سريع لجميع مدن المملكة خلال 48 ساعة. ضمان استبدال فوري في حال عدم الرضا.
                </p>
            </div>
            <div className="bg-[#b38b4d]/5 p-6 border border-[#b38b4d]/10">
                <p className="text-[10px] text-[#b38b4d] mb-2 uppercase tracking-widest">شهادة الجودة</p>
                <p className="text-[10px] italic text-gray-400 leading-relaxed">
                    "تم فحص هذه القطعة واعتمادها من قبل محرك Oracle السيادي لجودة 2026."
                </p>
            </div>
          </div>
        </div>

        {/* Right: Actions & Social Proof */}
        <div className="lg:col-span-5 space-y-12">
          <div className="bg-[#0a0a09] border border-[#b38b4d]/20 p-12 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase text-[#b38b4d] mb-1">Price</p>
                <p className="text-3xl font-light">SAR {product.finalPrice}</p>
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest italic">
                شامل الضريبة
              </div>
            </div>

            <button className="btn-luxury w-full">
              أضف إلى المقتنيات الملكية
            </button>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <p className="text-[10px] uppercase tracking-widest text-gray-600">صدى النخبة</p>
               <div className="bg-white/5 p-4 rounded-sm">
                  <p className="text-xs italic text-[#b38b4d]">"{saudiProof}"</p>
                  <p className="text-[9px] mt-2 text-gray-500">- فيصل (عميل Platinum)</p>
               </div>
            </div>
          </div>

          <RecentlyViewed />
          <HistoryTracer product={product} />

          <div className="text-center">
            <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-[#b38b4d] transition-colors">
              العودة للمجموعة الكاملة
            </Link>
          </div>
        </div>
      </section>
      <AIPersonalStylist />
    </main>
  );
}
