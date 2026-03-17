'use client';

import React from 'react';

/**
 * Saudi Luxury Store - Sovereign Pulse (Inventory Indicators)
 * النبض السيادي - مؤشرات لحظية لحالة المخزون والطلب لبناء الثقة والندرة.
 */
export default function SovereignPulse({ stockStatus = 'HIGH' }: { stockStatus?: 'HIGH' | 'LOW' | 'OUT' }) {
  const config = {
    HIGH: { label: 'متوفر للسيادة', color: 'bg-green-500' },
    LOW: { label: 'كمية محدودة جداً', color: 'bg-orange-500' },
    OUT: { label: 'نفدت الكمية للنخبة', color: 'bg-red-500' }
  }[stockStatus];

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}></span>
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
        {config.label}
      </span>
    </div>
  );
}
