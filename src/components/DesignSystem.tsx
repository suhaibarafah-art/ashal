/**
 * Saudi Luxury Store - Editorial Design System ("The Ounass Killer")
 * نظام بصري يعتمد على الفخامة التحريرية النقية (Pure Minimalist Luxury).
 */

import React from 'react';

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
  <div className="editorial-heading">
    {subtitle && <span className="text-[10px] uppercase tracking-[0.4em] text-[#999994] mb-4 block">{subtitle}</span>}
    <h2 className="luxury-serif">{title}</h2>
    <div className="line" />
  </div>
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
