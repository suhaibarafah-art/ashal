'use client';

import React from 'react';
import { GlassCard, LuxuryButton } from './DesignSystem';

/**
 * Saudi Luxury Store - Royal One-Step Checkout
 * الدفع الملكي الموحد - تجربة دفع سريعة وفخمة في صفحة واحدة.
 */
export default function RoyalCheckout() {
  return (
    <div className="min-h-screen bg-[#050505] py-32 px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* Left: Information */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#b38b4d] mb-12">بيانات السيادة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" placeholder="الاسم الكامل" className="bg-transparent border-b border-white/10 py-4 text-sm focus:border-accent-gold outline-none transition-colors" />
              <input type="email" placeholder="البريد الإلكتروني" className="bg-transparent border-b border-white/10 py-4 text-sm focus:border-accent-gold outline-none transition-colors" />
              <input type="tel" placeholder="رقم الجوال (05xxxxxxx)" className="bg-transparent border-b border-white/10 py-4 text-sm focus:border-accent-gold outline-none transition-colors" />
              <input type="text" placeholder="المدينة" className="bg-transparent border-b border-white/10 py-4 text-sm focus:border-accent-gold outline-none transition-colors" />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#b38b4d] mb-12">طريقة الدفع</h2>
            <div className="grid grid-cols-3 gap-4">
               <div className="border border-white/10 p-6 text-center cursor-pointer hover:border-accent-gold transition-colors">
                  <p className="text-[10px] uppercase tracking-widest mb-2 text-gray-400">Apple Pay</p>
                  <div className="h-4 bg-gray-600/20 rounded" />
               </div>
               <div className="border border-accent-gold p-6 text-center cursor-pointer bg-accent-gold/5">
                  <p className="text-[10px] uppercase tracking-widest mb-2 text-accent-gold">Mada / Card</p>
                  <div className="h-4 bg-accent-gold/20 rounded" />
               </div>
               <div className="border border-white/10 p-6 text-center cursor-pointer hover:border-accent-gold transition-colors">
                  <p className="text-[10px] uppercase tracking-widest mb-2 text-gray-400">Tamara</p>
                  <div className="h-4 bg-gray-600/20 rounded" />
               </div>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <GlassCard className="sticky top-32">
            <h3 className="text-xl font-light mb-8 luxury-serif">ملخص المقتنيات</h3>
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-xs text-gray-400">
                <span>المجموع الفرعي</span>
                <span>SAR 1,200</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>الشحن الملكي</span>
                <span className="text-accent-gold">مجاني</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>ضريبة القيمة المضافة (15%)</span>
                <span>SAR 180</span>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <span className="text-sm uppercase tracking-widest">الإجمالي</span>
                <span className="text-3xl text-accent-gold font-light">SAR 1,380</span>
              </div>
            </div>
            
            <LuxuryButton variant="primary" className="w-full py-8 text-[11px] tracking-[0.4em]">إتمام الطلب الآن</LuxuryButton>
            
            <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
               <div className="h-px flex-1 bg-white/20" />
               <span className="text-[8px] uppercase tracking-widest">Sovereign Encryption Active</span>
               <div className="h-px flex-1 bg-white/20" />
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
