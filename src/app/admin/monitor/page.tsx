'use client';

import React, { useState, useEffect } from 'react';

/**
 * Saudi Luxury Store - Mobile Live Monitor
 * لوحة القائد الجوالة - متابعة نبض النظام اللحظي.
 */
export default function LiveMonitor() {
  const [pulseStatus, setPulseStatus] = useState<'ACTIVE' | 'LOADING' | 'OFFLINE'>('LOADING');
  const [lastPulse, setLastPulse] = useState<string>('---');
  const [salesStatus, setSalesStatus] = useState('0.00 SAR');
  const [adsStatus, setAdsStatus] = useState('Idle');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/sys/pulsar');
        const data = await res.json();
        if (data.status === 'HEARTBEAT_ACTIVE') {
          setPulseStatus('ACTIVE');
          setLastPulse(new Date().toLocaleTimeString('ar-SA'));
        } else {
          setPulseStatus('OFFLINE');
        }
      } catch (err) {
        setPulseStatus('OFFLINE');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F6F0] p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-serif tracking-widest uppercase">Sovereign Monitor</h1>
        <div className={`h-3 w-3 rounded-full shadow-[0_0_10px] ${pulseStatus === 'ACTIVE' ? 'bg-green-500 shadow-green-500' : 'bg-red-500 shadow-red-500'}`}></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Heartbeat Card */}
        <div className="bg-[#111] border border-[#C5A059]/20 p-6 rounded-2xl backdrop-blur-md">
          <p className="text-xs text-[#C5A059] uppercase tracking-tighter mb-1">System Heartbeat</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-serif">{pulseStatus}</h2>
            <span className="text-xs text-gray-500">Last: {lastPulse}</span>
          </div>
          <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${pulseStatus === 'ACTIVE' ? 'w-full bg-[#C5A059]' : 'w-0'}`}></div>
          </div>
        </div>

        {/* Financial Flow Card */}
        <div className="bg-[#111] border border-[#C5A059]/20 p-6 rounded-2xl">
          <p className="text-xs text-[#C5A059] uppercase tracking-tighter mb-1">Live Sales (24h)</p>
          <h2 className="text-4xl font-serif">{salesStatus}</h2>
          <p className="text-xs text-green-500 mt-2">↑ 100% (Sovereign Activation)</p>
        </div>

        {/* Ads Activity Card */}
        <div className="bg-[#111] border border-[#C5A059]/20 p-6 rounded-2xl">
          <p className="text-xs text-[#C5A059] uppercase tracking-tighter mb-1">Ads Engine Status</p>
          <div className="flex items-center gap-3">
            <div className="animate-pulse h-2 w-2 rounded-full bg-[#C5A059]"></div>
            <h2 className="text-xl">{adsStatus}</h2>
          </div>
        </div>

        {/* Global Catalog Sync */}
        <div className="bg-[#111] border border-[#C5A059]/10 p-4 rounded-2xl text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Always-On Protocol v1.0</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-10 left-6 right-6 flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 bg-transparent border border-[#C5A059] py-4 rounded-full text-xs uppercase tracking-widest active:scale-95 transition-transform"
        >
          Force Sync
        </button>
      </div>
    </div>
  );
}
