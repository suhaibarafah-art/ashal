'use client';

import React, { useState } from 'react';

/**
 * Saudi Luxury Store - Automatic Mobile-First 2-Click Checkout
 * الدفع الملكي - ضغطتين فقط للإنهاء (Mobile-First)
 */
export default function RoyalCheckout() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#020202] text-[#faf8f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a09] border border-[#c5a975]/20 p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a975] to-transparent opacity-50" />
        
        {/* Header */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-2xl font-light text-white tracking-widest uppercase mb-2">Checkout</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c5a975]">Sovereign Secure (ZATCA Compliant)</p>
        </div>

        {/* Total Summary */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
            <span className="text-sm text-[#999994] font-light">Total (Inc. VAT)</span>
            <span className="text-4xl font-light text-[#c5a975] luxury-serif">1,380 <span className="text-sm">SAR</span></span>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-fade-in">
            {/* Express Checkout - 1 Click */}
            <div className="space-y-4">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-white text-black py-4 flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
              >
                <svg viewBox="0 0 384 512" className="w-6 h-6"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.3zM206.5 91.5c41.3-43.5 35.8-87.8 28.5-101.5-25.7 3.7-61.2 18.2-79.6 40.2-14.7 17.5-26.2 39.7-22.3 62 28.3 1.9 50.8-11.9 73.4-32.9z"/></svg>
                <span className="font-semibold text-lg">Pay</span>
              </button>
            </div>

            <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-[#999994] uppercase tracking-widest">Or Standard Checkout</span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Standard Form */}
            <div className="space-y-4">
                <input 
                  type="tel" 
                  placeholder="رقم الجوال (05xxxxxxx)" 
                  className="w-full bg-transparent border-b border-white/20 py-4 text-lg text-white focus:border-[#c5a975] outline-none transition-colors placeholder:text-gray-600 text-right dir-rtl" 
                />
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-transparent border border-[#c5a975] text-[#c5a975] py-4 hover:bg-[#c5a975] hover:text-black transition-colors"
                >
                  <span className="text-[12px] uppercase tracking-[0.3em]">المتابعة للدفع</span>
                </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full border border-[#c5a975] flex items-center justify-center mx-auto mb-6 text-[#c5a975]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-light text-white">تم استلام طلبك السيادي</h2>
            <p className="text-[#999994] text-sm leading-relaxed max-w-xs mx-auto">
              سيتم تجهيز المقتنيات الخاصة بك. رقم التتبع والفاتورة الضريبية في طريقها إلى هاتفك.
            </p>
            <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-[#c5a975] text-black py-4 mt-8 hover:bg-white transition-colors"
              >
                <span className="text-[11px] uppercase tracking-[0.3em] font-bold">العودة للرئيسية</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-[#999994]">
            <div className="flex items-center gap-4 text-[8px] uppercase tracking-widest">
                <span>Moyasar Live</span>
                <span>•</span>
                <span>ZATCA Invoice</span>
                <span>•</span>
                <span>SSL Secured</span>
            </div>
        </div>
      </div>
    </div>
  );
}
