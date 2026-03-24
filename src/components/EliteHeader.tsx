'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EliteCart from './EliteCart';
import ThemeToggle from './ThemeToggle';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * EliteHeader — Deep Royal Blue Navigation + Strategic Orange CTA
 * Hidden on: /admin/*, /checkout/*, /orders/*
 */
export default function EliteHeader() {
  const pathname = usePathname();
  const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/orders');
  if (isHidden) return null;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
    setScrolled(latest > 10);
  });

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 w-full z-[60]"
        style={{ backgroundColor: '#002366', boxShadow: scrolled ? '0 4px 20px rgba(27,42,107,0.5)' : 'none' }}
      >
        {/* Announcement Bar — Orange */}
        <div
          className="w-full text-center py-2 text-[11px] font-bold tracking-widest"
          style={{ background: '#FF8C00', color: 'white', fontFamily: 'var(--font-cairo)' }}
        >
          🚚 شحن مجاني على الطلبات فوق 299 ريال — كود الخصم:
          <span
            className="mx-1 px-2 py-0.5 rounded font-black"
            style={{ background: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em' }}
          >ROYAL20</span>
        </div>

        {/* Main Nav */}
        <div
          className={`container flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}
        >
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start gap-0.5 group">
            <span
              className="text-2xl md:text-[28px] font-black tracking-tight leading-none uppercase group-hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              SAUDI<span style={{ color: '#FFDB58' }}>LUX</span>
            </span>
            <span
              className="text-[9px] tracking-[0.28em] uppercase"
              style={{ color: 'rgba(144,202,249,0.7)', fontFamily: 'var(--font-montserrat)' }}
            >
              Luxury Empire
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/collections', label: 'المجموعات' },
              { href: '/admin', label: 'لوحة التحكم' },
              { href: '/admin/system-logs', label: 'سجلات النظام' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'var(--font-cairo)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'var(--font-cairo)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              بحث
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart — Orange CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] transition-all hover:opacity-90 active:scale-95"
              style={{
                background: '#FF8C00',
                color: 'white',
                fontFamily: 'var(--font-cairo)',
                boxShadow: '0 4px 18px rgba(232,118,26,0.5)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              السلة
            </button>
          </div>
        </div>
      </motion.header>

      {/* Spacer: announcement ~32px + nav ~72px */}
      <div style={{ height: '108px' }} aria-hidden="true" />

      <EliteCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
