/**
 * Saudi Luxury Store - Editorial Design System ("The Ounass Killer")
 * نظام بصري يعتمد على الفخامة التحريرية النقية مع تفاعلات حركية (Fluid Motion).
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Replaces GlassCard - Clean, borderless or thin bordered white card
export const EditorialCard: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className, style }) => (
  <div 
    className={`bg-white transition-all duration-700 ${className || ''}`}
    style={{
      border: '1px solid #EAEAEA',
      padding: '2.5rem',
      ...style
    }}
  >
    {children}
  </div>
);

// Alias for backwards compatibility with older Sovereign components
export const GlassCard = EditorialCard;

// Replaces GoldLine - Thin black editorial line
export const EditorialLine = () => (
  <div style={{ 
    width: '1px', 
    height: '60px', 
    background: '#000000', 
    margin: '2rem auto' 
  }} />
);

export const LuxuryButton: React.FC<{ 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary',
  onClick?: () => void,
  className?: string
}> = ({ children, variant = 'primary', onClick, className }) => (
  <button 
    onClick={onClick}
    className={`btn-luxury ${variant === 'secondary' ? 'secondary' : ''} ${className || ''}`}
  >
    {children}
  </button>
);

export const SectionHeading: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="editorial-heading"
  >
    {subtitle && <span className="text-[10px] uppercase tracking-[0.4em] text-[#999994] mb-4 block">{subtitle}</span>}
    <h2 className="luxury-serif">{title}</h2>
    <div className="line" />
  </motion.div>
);

export const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  // Editorial clean timer
  return (
    <div className="flex gap-8 justify-center items-center font-serif text-black border border-[#EAEAEA] p-6 max-w-sm mx-auto bg-[#FAFAFA]">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">02</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#555] mt-2">Hours</span>
      </div>
      <span className="font-thin text-2xl mb-5 mx-2 text-[#EAEAEA]">|</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">45</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#555] mt-2">Mins</span>
      </div>
      <span className="font-thin text-2xl mb-5 mx-2 text-[#EAEAEA]">|</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">12</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#555] mt-2">Secs</span>
      </div>
    </div>
  );
};

// Fluid Reveal Wrapper for Staggered Animations
export const MotionFadeIn: React.FC<{ children: React.ReactNode, delay?: number, yOffset?: number, className?: string }> = ({ children, delay = 0, yOffset = 50, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
