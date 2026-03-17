import React from 'react';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let product;
  try {
    product = await prisma.product.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return (
       <main className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
          <h1 className="text-2xl font-arabic-heading">القطعة غير متوفرة أو نفذت من المخزون.</h1>
       </main>
    );
  }

  // Calculate Loyalty Points (10% of value as points, arbitrary ratio)
  const loyaltyPoints = Math.floor(product.finalPrice * 0.1);
  const gallery = product.images ? JSON.parse(product.images) : [product.image];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-arabic-body selection:bg-[var(--accent-gold)] selection:text-black mt-[80px]">
      <div className="container mx-auto max-w-7xl pt-12 pb-24">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            
            {/* Left: Product Images (Gallery) */}
            <div className="space-y-6">
               <div className="aspect-[4/5] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gallery[0]} alt={product.titleAr} className="w-full h-full object-cover" />
               </div>
               {gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                     {gallery.slice(1).map((imgUrl: string, idx: number) => (
                       <div key={idx} className="aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition border border-[var(--border-color)]">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Right: Product Details & Actions */}
            <div className="flex flex-col">
               <span className="text-[var(--accent-gold)] text-xs uppercase tracking-[0.3em] font-bold mb-4 font-arabic-heading">
                  {product.category || 'Sovereign Collection'}
               </span>
               <h1 className="text-3xl md:text-5xl font-bold font-arabic-heading mb-4 text-white leading-tight">
                  {product.titleAr}
               </h1>
               
               <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed font-light">
                  {product.descAr}
               </p>

               <div className="flex items-end gap-4 mb-8">
                  <span className="text-4xl font-serif text-[var(--accent-gold)] tracking-widest border-b border-[var(--border-color)] pb-2 flex-1">
                     SAR {product.finalPrice.toLocaleString()}
                  </span>
               </div>

               {/* Loyalty & Delivery Indicators */}
               <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 mb-8">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[var(--text-secondary)] text-sm">الولاء السيادي (نادي النخبة)</span>
                     <span className="text-[var(--accent-gold)] font-bold text-sm bg-[var(--accent-gold-muted)] px-3 py-1 rounded-full">
                        +{loyaltyPoints} نقطة مرصودة
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[var(--text-secondary)] text-sm">التوصيل السريع (الرياض)</span>
                     <span className="text-white font-bold text-sm">متاح - خلال 4 ساعات 🇸🇦</span>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col gap-4">
                  <Link href="/checkout" className="w-full">
                     <button className="w-full bg-[var(--accent-gold)] text-black font-bold text-lg py-5 rounded-lg uppercase tracking-widest hover:bg-[var(--accent-gold-bright)] transition shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        شراء الآن بنقرة واحدة (Apple Pay)
                     </button>
                  </Link>
                  <button className="w-full bg-transparent border border-[var(--border-color)] text-white font-bold text-md py-4 rounded-lg hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition">
                     التحدث مع المستشار الخاص (WhatsApp)
                  </button>
               </div>

               {/* Trust Badges */}
               <div className="mt-8 flex items-center justify-between text-[var(--text-tertiary)] border-t border-[var(--border-color)] pt-8">
                  <div className="flex items-center gap-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                     <span className="text-xs">دفع آمن (ZATCA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                     <span className="text-xs">استبدال خلال 7 أيام</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                     <span className="text-xs">منتج أصلي 100%</span>
                  </div>
               </div>
            </div>
         </div>
         
      </div>
    </main>
  );
}
