'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './DesignSystem';

/**
 * Saudi Luxury Store - AI Personal Stylist (Front-end Personality)
 * المنسق الشخصي الذكي - شخصية تفاعلية تقدم نصائح الموضة الراقية للعملاء.
 */
export default function AIPersonalStylist() {
  const [advice, setAdvice] = useState("أنا منسقك الشخصي اليوم. هل تبحث عن قطعة تعبر عن القوة أم الأناقة الهادئة؟");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 left-12 z-[55] max-w-xs animate-fade-in-up">
      <GlassCard className="p-8 border-accent-gold/20 relative group overflow-visible">
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-gold rounded-full flex center text-[10px] text-onyx font-bold border-2 border-[#050505]">
          AI
        </div>
        
        <p className="text-[10px] text-[#b38b4d] uppercase tracking-widest mb-4">Sovereign Stylist</p>
        <p className="text-xs italic leading-relaxed text-gray-300">
          "{advice}"
        </p>

        <div className="mt-6 flex gap-4">
           <button 
            onClick={() => setAdvice("القطع المطلية بالذهب تعبر عن حضور طاغٍ. أنصحك بمجموعة التراث لهذا الموسم.")}
            className="text-[8px] uppercase tracking-widest text-[#b38b4d] border-b border-[#b38b4d]/20 py-1 hover:border-accent-gold transition-colors"
           >
             القوة
           </button>
           <button 
            onClick={() => setAdvice("الأناقة خلف الكواليس هي سر النخبة. جرب الساعات ذات المينا الأسود المطفي.")}
            className="text-[8px] uppercase tracking-widest text-[#b38b4d] border-b border-[#b38b4d]/20 py-1 hover:border-accent-gold transition-colors"
           >
             الأناقة
           </button>
        </div>
      </GlassCard>
    </div>
  );
}
