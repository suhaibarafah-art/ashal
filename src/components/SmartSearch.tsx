'use client';

import React, { useState } from 'react';

/**
 * Saudi Luxury Store - Smart Riyadh Search
 * نظام بحث تنبئي مخصص لتوقعات عملاء العاصمة وبقية مناطق المملكة.
 */
export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length > 1) {
      // Logic simulation for localized expectations
      const riyadhTrends = ['عود ملكي', 'ساعة الماس', 'عباية سهرة', 'قهوة العلا', 'تمور النخبة'];
      setSuggestions(riyadhTrends.filter(t => t.includes(val)));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mb-12">
      <input 
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="ابحث عن قطعتك السيادية..."
        className="w-full bg-white/5 border-b border-white/10 p-4 text-center text-[#f8f6f2] focus:outline-none focus:border-accent-gold transition-colors font-light"
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a09] border border-white/5 z-50 p-4 space-y-4 shadow-2xl">
          <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-2">توقعات عراف الهبّة لمدينة الرياض</p>
          <div className="flex flex-wrap gap-4">
            {suggestions.map((s, i) => (
              <span key={i} className="text-xs text-accent-gold cursor-pointer hover:text-white transition-colors">
                #{s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
