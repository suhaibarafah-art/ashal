'use client';

import React, { useState } from 'react';

/**
 * Saudi Luxury Store - VIP Luxury Concierge Widget
 * ويدجت المساعد الشخصي - العناية بالنخبة بأسلوب "القفاز الأبيض".
 */
export default function AIVIPWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-[2000] font-serif">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#b38b4d] rounded-full shadow-[0_10px_30px_rgba(179,139,77,0.4)] flex items-center justify-center border border-[#f8f6f2]/20 active:scale-90 transition-all duration-500 hover:rotate-12"
      >
        <span className="text-2xl text-[#040404]">✨</span>
      </button>

      {/* Expanded Panel */}
      <div className={`absolute bottom-20 left-0 w-80 bg-[#0a0a09] border border-[#b38b4d]/30 rounded-2xl transition-all duration-700 overflow-hidden ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#b38b4d] mb-2">Private Concierge</p>
          <h4 className="text-xl font-light text-[#f8f6f2] mb-4">بخدمتك، طال عمرك</h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            أهلاً بك في الفخامة السعودية. أنا مساعدك الشخصي، هنا لتلبية تطلعاتك وضمان تجربة تسوق تليق بك.
          </p>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-white/5 rounded-lg text-xs hover:bg-white/5 transition-colors uppercase tracking-widest text-gray-300">
              استشارة هدية فاخرة
            </button>
            <button className="w-full text-left p-3 border border-white/5 rounded-lg text-xs hover:bg-white/5 transition-colors uppercase tracking-widest text-gray-300">
              حالة الطلب الخاص
            </button>
          </div>
        </div>
        <div className="bg-[#b38b4d]/10 p-3 text-center">
            <p className="text-[9px] text-[#b38b4d] uppercase tracking-[0.3em]">Protocol Antigravity Active</p>
        </div>
      </div>
    </div>
  );
}
