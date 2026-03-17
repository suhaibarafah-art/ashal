'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EliteCart from './EliteCart';

/**
 * Saudi Luxury Store - Elite Header
 * الترويسة النخبوية - توفر وصولاً سريعاً للسلة والبحث والهوية السيادية.
 */
export default function EliteHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="navbar border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="container flex justify-between items-center h-24 px-12">
          {/* Logo */}
          <Link href="/" className="group">
            <h1 className="text-2xl font-light tracking-[0.2em] luxury-serif group-hover:text-accent-gold transition-colors">
              الفخامة <span className="italic">LUXURY</span>
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-12">
            <button className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              البحث
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative group py-2"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold group-hover:text-accent-gold transition-colors">
                السلة
              </span>
              <span className="absolute -top-1 -right-3 w-4 h-4 bg-accent-gold text-onyx text-[8px] flex center rounded-full font-bold">1</span>
            </button>
            <span className="w-px h-8 bg-white/10" />
            <Link href="/admin" className="text-[10px] uppercase tracking-widest text-[#b38b4d]/60 hover:text-accent-gold transition-colors">
              CEO
            </Link>
          </div>
        </div>
      </header>

      <EliteCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
