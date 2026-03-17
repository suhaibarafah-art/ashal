'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const [moyasarReady, setMoyasarReady] = useState(false);
  const [total, setTotal] = useState(1850.00); // Example total
  const [geoLocating, setGeoLocating] = useState(true);
  const [inRiyadh, setInRiyadh] = useState(false);

  // Loyalty Points Calculation
  const pointsEarned = Math.floor(total * 0.1); 

  useEffect(() => {
    // Geofencing Simulation (Local UX)
    setTimeout(() => {
      setInRiyadh(true); // Assuming the user is in Riyadh for this demo
      setGeoLocating(false);
    }, 1200);
  }, []);

  const initMoyasar = () => {
    // Access Moyasar object from window using TypeScript casting
    const Moyasar = (window as any).Moyasar;
    if (Moyasar) {
      Moyasar.init({
        element: '.mysr-form',
        amount: total * 100, // Amount in Halalas
        currency: 'SAR',
        description: 'Sovereign Empire - Order Checkout',
        publishable_api_key: 'pk_live_nVUKLwCcAofygg2ptRf3ut4uSev7KFj7YonLMNxV',
        callback_url: 'https://' + window.location.host + '/api/payment/verify',
        methods: [
          'creditcard',
          'applepay',
          'stcpay'
        ],
        apple_pay: {
           country: 'SA',
           label: 'Sovereign Empire',
           validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate'
        }
      });
      setMoyasarReady(true);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-arabic-body selection:bg-[var(--accent-gold)] selection:text-black mt-[80px] pb-32">
       {/* Load Moyasar Scripts & Styles */}
       <Script src="https://cdn.moyasar.com/mpf/1.12.0/moyasar.js" strategy="afterInteractive" onLoad={initMoyasar} />
       <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.12.0/moyasar.css" />

       <div className="container mx-auto max-w-5xl pt-12">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-arabic-heading font-bold text-white mb-4">إتمام الشراء</h1>
            <p className="text-[var(--text-secondary)]">بوابة الدفع السيادية الموثوقة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             
             {/* Left Column: Checkout Logic & Payment */}
             <div className="lg:col-span-7 space-y-8">
                
                {/* Geofencing Magic Banner */}
                {geoLocating ? (
                   <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 flex items-center justify-center animate-pulse">
                     <span className="text-sm text-[var(--text-secondary)]">جاري تحديد الموقع لضمان أسرع تلبية...</span>
                   </div>
                ) : inRiyadh && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--accent-gold-muted)] border border-[var(--accent-gold)] rounded-xl p-5 flex items-start gap-4">
                      <div className="text-[var(--accent-gold)] mt-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                         <h4 className="text-[var(--accent-gold)] font-bold mb-1 font-arabic-heading">توصيل سريع للرياض متاح!</h4>
                         <p className="text-sm text-[var(--text-primary)]">عميلنا العزيز في العاصمة، سيتم تجهيز طلبك وتسليمه خلال الساعات القادمة.</p>
                      </div>
                   </motion.div>
                )}

                {/* Loyalty Engine Prompt */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                   <div className="flex justify-between items-center">
                     <div>
                       <h4 className="font-bold text-white text-md mb-1">الولاء السيادي</h4>
                       <p className="text-xs text-[var(--text-secondary)]">سجل دخولك لاستبدال النقاط أو اكتسب نقاطاً جديدة.</p>
                     </div>
                     <div className="text-right">
                       <span className="block text-2xl font-serif text-[var(--accent-gold)]">+{pointsEarned}</span>
                       <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">نقطة مكتسبة</span>
                     </div>
                   </div>
                </div>

                {/* Moyasar Payment Form Container */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl relative overflow-hidden" dir="ltr">
                   {/* Moyasar injects its iframe inside this div */}
                   <div className="mysr-form"></div>
                   
                   {/* Fallback layout incase JS is loading */}
                   {!moyasarReady && (
                     <div className="absolute inset-0 bg-[#f9f9f9] flex flex-col items-center justify-center z-10 text-black">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">جاري تأمين بوابة الدفع (ZATCA Compliant)...</p>
                     </div>
                   )}
                </div>

                {/* Security Badges */}
                <div className="flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_Pay_logo.svg/1024px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-8 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8 object-contain" />
                </div>
             </div>

             {/* Right Column: Order Summary & Upsell */}
             <div className="lg:col-span-5">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 sticky top-32">
                   <h3 className="text-xl font-bold text-white font-arabic-heading mb-6 border-b border-[var(--border-color)] pb-4">ملخص الإمبراطورية</h3>
                   
                   {/* Dummy Cart Item */}
                   <div className="flex gap-4 mb-6">
                     <div className="w-20 h-24 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden border border-[var(--border-color)]">
                        <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80" alt="Product" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-white mb-1">عطر السيادة الملكي - حصري</h4>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">الكمية: 1</p>
                        <span className="text-sm text-[var(--accent-gold)] font-bold">SAR 1,850</span>
                     </div>
                   </div>

                   {/* Sub-totals */}
                   <div className="space-y-3 text-sm border-t border-[var(--border-color)] pt-6 mb-6">
                      <div className="flex justify-between">
                         <span className="text-[var(--text-secondary)]">المجموع الفرعي</span>
                         <span className="text-white">SAR 1,850</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[var(--text-secondary)]">الشحن (توصيل لكبار الشخصيات)</span>
                         <span className="text-green-500 font-bold">مجاني</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[var(--text-secondary)]">ضريبة القيمة المضافة (15%)</span>
                         <span className="text-white">SAR 277.50</span>
                      </div>
                   </div>

                   <div className="flex justify-between items-end border-t border-[var(--border-color)] pt-6 mb-8">
                       <span className="text-lg font-bold text-white font-arabic-heading">الإجمالي المستحق</span>
                       <span className="text-3xl font-serif text-[var(--accent-gold)] tracking-wider">SAR {total}</span>
                   </div>

                   {/* Cross-Selling (The Upsell Engineering) */}
                   <div className="bg-[var(--bg-tertiary)] rounded-xl p-5 border border-[var(--border-dark)]">
                      <h4 className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-4 text-center">بما أنك اخترت الفخامة، قد يعجبك</h4>
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-[#121212] rounded border border-[var(--border-color)] overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1599643478514-4a820c56a8cc?auto=format&fit=crop&q=80" alt="Upsell" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <h5 className="text-[11px] font-bold text-white mb-1">ساعة توربيون بلاتينية</h5>
                            <span className="text-[10px] text-[var(--accent-gold)] line-through mr-2">SAR 28,000</span>
                            <span className="text-xs text-white font-bold tracking-wide">SAR 24,000</span>
                         </div>
                         <button className="bg-transparent border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                         </button>
                      </div>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </main>
  );
}
