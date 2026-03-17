'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EliteCart from './EliteCart';

/**
 * Saudi Luxury Store - Elite Header (Cinematic Transparent)
 * الترويسة النخبوية - شفافة بالكامل لدمجها مع الخلفية السينمائية.
 */
export default function EliteHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add subtle blur only when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-700 ${
          scrolled ? 'bg-[#020202]/80 backdrop-blur-2xl border-b border-white/[0.02] py-2' : 'bg-transparent py-6'
        }`}
      >
        <div className="container flex justify-between items-center px-4 md:px-12">
          {/* Logo */}
          <Link href="/" className="group flex flex-col">
            <h1 className="text-xl md:text-3xl font-light tracking-[0.3em] luxury-serif text-white group-hover:text-[#c5a975] transition-colors duration-500">
              SOVEREIGN
            </h1>
            <span className="text-[#999994] text-[8px] tracking-[0.5em] uppercase mt-1 opacity-60">Empire</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8 md:gap-16">
            <button className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#faf8f5] opacity-70 hover:opacity-100 hover:text-[#c5a975] transition-all duration-500 hidden md:block">
              Search
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative group py-2 flex items-center gap-3"
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#faf8f5] opacity-70 group-hover:opacity-100 group-hover:text-[#c5a975] transition-all duration-500">
                Cart
              </span>
              <div className="w-1.5 h-1.5 bg-[#c5a975] rounded-full animate-pulse" />
            </button>
            <span className="w-px h-6 bg-white/10 hidden md:block" />
            <Link href="/admin" className="text-[9px] uppercase tracking-[0.4em] text-[#999994] opacity-40 hover:opacity-100 hover:text-white transition-all duration-500 hidden md:block">
              CEO Access
            </Link>
          </div>
        </div>
      </header>

      <EliteCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
