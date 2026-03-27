'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from './DesignSystem';

/**
 * Saudi Luxury Store - Elite Cart Side-Panel
 * سلة المقتنيات النخبوية - تجربة دفع زجاجية سلسة.
 */
export default function EliteCart({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-start">
      {/* Panel — slides in from right (START side in RTL) */}
      <div className="relative w-full max-w-md bg-[#080808] border-e border-white/5 p-12 flex flex-col h-full shadow-2xl" style={{ animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10"
        onClick={onClose}
      />
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#b38b4d]">سلة المقتنيات</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xs">CLOSE</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 py-4">
           {/* Mock Cart Item */}
           <div className="flex gap-6 pb-8 border-b border-white/5 group">
              <div className="w-24 h-24 bg-onyx overflow-hidden">
                <div className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b")'}} />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Heritage Series</p>
                <h4 className="text-xs font-light">قطعة مذهبة فاخرة</h4>
                <p className="text-accent-gold text-xs">SAR 1,200</p>
              </div>
           </div>
        </div>

        <div className="pt-12 border-t border-white/5 space-y-8">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">الاجمالي</span>
            <span className="text-2xl font-light">SAR 1,200</span>
          </div>
          
          <Link href="/checkout" className="w-full">
            <button 
              onClick={onClose}
              className="w-full bg-[#b38b4d] text-onyx py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:tracking-[0.6em] transition-all duration-700"
            >
              الدفع السيادي الآمن
            </button>
          </Link>
          
          <p className="text-[8px] text-center text-gray-600 uppercase tracking-widest">ZATCA COMPLIANT • SECURE CHECKOUT</p>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
