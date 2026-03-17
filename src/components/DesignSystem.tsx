/**
 * Saudi Luxury Store - Sovereign Design System (Ultra Premium)
 * نظام بصري يعتمد على الفخامة التحريرية (Editorial Luxury).
 */

import React from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className, style }) => (
  <div 
    className={`glass-sheen transition-all duration-700 ${className || ''}`}
    style={{
      background: 'rgba(5, 5, 5, 0.4)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(197, 169, 117, 0.05)',
      padding: '3rem',
      ...style
    }}
  >
    {children}
  </div>
);

export const GoldLine = () => (
  <div style={{ 
    width: '1px', 
    height: '60px', 
    background: 'linear-gradient(to bottom, transparent, #c5a975, transparent)', 
    opacity: 0.5,
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
    className={`btn ${variant === 'primary' ? 'bg-[#c5a975] text-[#020202] hover:bg-transparent hover:text-[#c5a975] border border-[#c5a975]' : 'bg-transparent text-white border border-white/20 hover:border-[#c5a975]'} ${className || ''}`}
  >
    {children}
  </button>
);

export const SectionHeading: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex flex-col items-center text-center mb-24">
    <span className="text-[9px] uppercase tracking-[0.6em] text-[#c5a975] mb-6 block font-light opacity-80">{subtitle}</span>
    <h2 className="text-4xl md:text-6xl font-thin text-[#faf8f5] mb-8 uppercase tracking-widest leading-tight">{title}</h2>
    <div className="w-px h-16 bg-[#c5a975] opacity-30" />
  </div>
);

export const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  // Simple Mock for UI display - in real app, use a hook
  return (
    <div className="flex gap-6 justify-center items-center font-serif text-[#e0ca9a] opacity-90 mix-blend-screen">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">02</span>
        <span className="text-[7px] uppercase tracking-[0.4em] text-[#999994] mt-1">Hours</span>
      </div>
      <span className="opacity-20 font-thin text-2xl mb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">45</span>
        <span className="text-[7px] uppercase tracking-[0.4em] text-[#999994] mt-1">Mins</span>
      </div>
      <span className="opacity-20 font-thin text-2xl mb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light">12</span>
        <span className="text-[7px] uppercase tracking-[0.4em] text-[#999994] mt-1">Secs</span>
      </div>
    </div>
  );
};
