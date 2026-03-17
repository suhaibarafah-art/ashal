/**
 * Saudi Luxury Store - Sovereign Design System
 * نظام بصري يعتمد على الفخامة التحريرية (Editorial Luxury).
 */

import React from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className, style }) => (
  <div 
    className={`glass-sheen hover-lift ${className || ''}`}
    style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      border: '1px solid var(--border-color)',
      padding: '2.5rem',
      transition: 'var(--transition-luxury)',
      ...style
    }}
  >
    {children}
  </div>
);

export const GoldLine = () => (
  <div style={{ 
    width: '60px', 
    height: '1px', 
    background: 'linear-gradient(to right, transparent, var(--accent-gold), transparent)', 
    margin: '1.5rem auto' 
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
    className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className || ''}`}
  >
    {children}
  </button>
);

export const SectionHeading: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-20">
    <span className="text-[10px] uppercase tracking-[0.5em] text-accent-gold mb-4 block">{subtitle}</span>
    <h2 className="text-5xl font-light text-white mb-6 uppercase tracking-tight">{title}</h2>
    <GoldLine />
  </div>
);

export const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  // Simple Mock for UI display - in real app, use a hook
  return (
    <div className="flex gap-4 justify-center items-center font-serif text-accent-gold">
      <div className="text-center">
        <span className="text-2xl block">02</span>
        <span className="text-[8px] uppercase tracking-widest text-gray-500">Hours</span>
      </div>
      <span className="opacity-30">:</span>
      <div className="text-center">
        <span className="text-2xl block">45</span>
        <span className="text-[8px] uppercase tracking-widest text-gray-500">Mins</span>
      </div>
      <span className="opacity-30">:</span>
      <div className="text-center">
        <span className="text-2xl block">12</span>
        <span className="text-[8px] uppercase tracking-widest text-gray-500">Secs</span>
      </div>
    </div>
  );
};
