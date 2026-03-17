'use client';

import React from 'react';
import { GlassCard, SectionHeading } from './DesignSystem';

/**
 * Saudi Luxury Store - 30-Year Wealth Vision
 * لوحة رؤية الثروة - إسقاط مالي لنمو الإمبراطورية على مدى 30 عاماً.
 */
export default function WealthVision() {
  const annualGrowth = 0.25; // 25% annual growth target
  const initialCapital = 100000; // SAR
  
  const projection = Array.from({ length: 30 }, (_, i) => {
    const year = 2026 + i;
    const wealth = initialCapital * Math.pow(1 + annualGrowth, i);
    return { year, wealth };
  });

  return (
    <div className="py-20 bg-[#050505] text-[#f8f6f2]">
      <SectionHeading title="رؤية الثروة السيادية" subtitle="30-YEAR PROJECTION" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-20">
        <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">رأس المال المستهدف (2056)</p>
            <h4 className="text-4xl text-accent-gold font-light tabular-nums">
                {Math.round(projection[29].wealth).toLocaleString()} SAR
            </h4>
        </GlassCard>
        <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">معدل النمو السنوي المركب</p>
            <h4 className="text-4xl text-accent-gold font-light">25%</h4>
        </GlassCard>
        <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">درجة الأمان المالي</p>
            <h4 className="text-4xl text-accent-gold font-light">Sovereign Grade</h4>
        </GlassCard>
      </div>

      <div className="h-64 flex items-end gap-1 opacity-50">
        {projection.map((d, i) => (
          <div 
            key={i} 
            className="bg-accent-gold flex-1 hover:opacity-100 transition-opacity cursor-pointer group relative"
            style={{ height: `${(d.wealth / projection[29].wealth) * 100}%` }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-onyx p-2 text-[8px] whitespace-nowrap border border-white/5">
                {d.year}: {Math.round(d.wealth).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[9px] text-gray-600 mt-8 uppercase tracking-[0.4em]">Compound Interest is the Eighth Wonder of the World</p>
    </div>
  );
}
