'use client';

import React from 'react';

const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-12">
    <h3 className="text-xs text-[var(--accent-gold)] tracking-[0.3em] uppercase mb-4">{subtitle}</h3>
    <h2 className="text-3xl font-bold text-white font-arabic-heading">{title}</h2>
  </div>
);

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
    <div className="py-20 bg-[#121212] flex flex-col items-center">
      <SectionHeading title="رؤية الثروة السيادية" subtitle="30-YEAR PROJECTION" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-20 w-full max-w-5xl px-6">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">رأس المال المستهدف (2056)</p>
            <h4 className="text-4xl text-[var(--accent-gold)] font-light tabular-nums">
                {Math.round(projection[29].wealth).toLocaleString()} SAR
            </h4>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">معدل النمو السنوي المركب</p>
            <h4 className="text-4xl text-[var(--accent-gold)] font-light">25%</h4>
        </div>
        <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">درجة الأمان المالي</p>
            <h4 className="text-4xl text-[var(--accent-gold)] font-light">Sovereign Grade</h4>
        </div>
      </div>

      <div className="h-64 flex items-end gap-1 opacity-50 w-full max-w-5xl px-6">
        {projection.map((d, i) => (
          <div 
            key={i} 
            className="bg-[var(--accent-gold)] flex-1 hover:opacity-100 transition-opacity cursor-pointer group relative rounded-t-sm"
            style={{ height: `${(d.wealth / projection[29].wealth) * 100}%` }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#121212] text-white p-2 text-[10px] whitespace-nowrap border border-[#333] rounded z-10">
                {d.year}: {Math.round(d.wealth).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-8 uppercase tracking-[0.4em] font-sans">Compound Interest is the Eighth Wonder of the World</p>
    </div>
  );
}
