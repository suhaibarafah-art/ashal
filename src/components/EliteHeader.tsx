'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EliteCart from './EliteCart';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

/**
 * Saudi Luxury Store - Editorial Header
 * الترويسة المكتومة - تصميم أبيض فائق النقاء مع حركة سينمائية (Hide on scroll down).
 */
export default function EliteHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // Scrolling down - hide
    } else {
      setHidden(false); // Scrolling up - reveal
    }
    setScrolled(latest > 10);
  });

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[60] transition-colors duration-500 bg-white ${
          scrolled ? 'py-4 shadow-sm' : 'py-6 border-b border-[#EAEAEA]'
        }`}
      >
        <div className="container flex justify-between items-center px-4 md:px-12">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-center">
            <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] luxury-serif text-black group-hover:opacity-70 transition-opacity duration-300 uppercase">
              Ounass
            </h1>
            <span className="text-[#555] text-[7px] tracking-[0.6em] uppercase mt-2">Sovereign Edition</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8 md:gap-12">
            <button className="text-[10px] uppercase tracking-[0.2em] text-[#555] hover:text-black transition-colors duration-300 hidden md:block">
              Search
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="group py-2 flex items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#555] group-hover:text-black transition-colors duration-300">
                Bag
              </span>
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </button>
            <span className="w-px h-4 bg-[#EAEAEA] hidden md:block" />
            <Link href="/sohib-vision" className="text-[9px] uppercase tracking-[0.3em] text-[#999994] hover:text-black transition-colors duration-300 hidden md:block">
              CEO
            </Link>
          </div>
        </div>
      </motion.header>

      <EliteCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
