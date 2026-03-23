'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/**
 * /admin/monitor — Mobile-first live system monitor
 * Polls /api/sys/pulsar every 30s — shows real DB stats, revenue, recent logs
 */

type PulseStatus = 'ACTIVE' | 'LOADING' | 'OFFLINE' | 'DB_ERROR';

interface PulsarData {
  status: string;
  checkedAt: string;
  db: string;
  stats: {
    totalOrders: number;
    ordersToday: number;
    revenue24h: string;
    revenueTotal: string;
    productCount: number;
    lastOrderAt: string | null;
    lastOrderCity: string | null;
  };
  recentLogs: Array<{
    level: string;
    message: string;
    source: string;
    createdAt: string;
  }>;
}

const LOG_COLOR: Record<string, string> = {
  SUCCESS: 'text-green-400',
  INFO:    'text-blue-400',
  WARN:    'text-yellow-400',
  ERROR:   'text-red-400',
};

export default function LiveMonitor() {
  const [pulse, setPulse]         = useState<PulseStatus>('LOADING');
  const [data, setData]           = useState<PulsarData | null>(null);
  const [lastPulse, setLastPulse] = useState('---');
  const [countdown, setCountdown] = useState(30);

  const fetchPulse = useCallback(async () => {
    setPulse('LOADING');
    try {
      const res  = await fetch('/api/sys/pulsar', { cache: 'no-store' });
      const json: PulsarData = await res.json();
      if (json.status === 'HEARTBEAT_ACTIVE') {
        setPulse('ACTIVE');
        setData(json);
        setLastPulse(new Date().toLocaleTimeString('ar-SA'));
        setCountdown(30);
      } else {
        setPulse('DB_ERROR');
      }
    } catch {
      setPulse('OFFLINE');
    }
  }, []);

  useEffect(() => {
    fetchPulse();
    const poll   = setInterval(fetchPulse, 30_000);
    const ticker = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 30)), 1_000);
    return () => { clearInterval(poll); clearInterval(ticker); };
  }, [fetchPulse]);

  const isLive = pulse === 'ACTIVE';
  const stats  = data?.stats;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9F6F0] p-5 font-sans" dir="rtl">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-bold tracking-widest uppercase" style={{ color: '#C5A059' }}>
            Sovereign Monitor
          </h1>
          <p className="text-[9px] text-gray-600 font-mono mt-0.5">
            SAUDILUX · تحديث كل {countdown}ث
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPulse}
            className="text-[9px] text-gray-500 hover:text-gray-300 border border-white/10 px-3 py-1 rounded-sm transition-colors"
          >
            ↻ تحديث
          </button>
          <Link href="/admin" className="text-[9px] text-gray-500 hover:text-gray-300">
            ← Admin
          </Link>
        </div>
      </div>

      {/* Heartbeat Card */}
      <div className="bg-[#111] border border-[#C5A059]/20 p-5 rounded-xl mb-4">
        <p className="text-[9px] text-[#C5A059] uppercase tracking-[0.3em] mb-2">System Heartbeat</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-green-500' : 'bg-red-500'}`} />
            </span>
            <span className={`text-2xl font-bold font-mono ${isLive ? 'text-green-400' : 'text-red-400'}`}>
              {pulse === 'LOADING' ? '...' : isLive ? 'ONLINE' : pulse}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-600">آخر فحص</p>
            <p className="text-[10px] font-mono text-gray-400">{lastPulse}</p>
          </div>
        </div>
        <div className="mt-3 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${isLive ? 'bg-[#C5A059]' : 'bg-red-900'}`}
            style={{ width: `${((30 - countdown) / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Revenue + Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'إيرادات 24h',       value: stats ? `${stats.revenue24h} ر.س` : '---' },
          { label: 'إجمالي الإيرادات',  value: stats ? `${stats.revenueTotal} ر.س` : '---' },
          { label: 'طلبات اليوم',        value: stats ? `${stats.ordersToday}` : '---', sub: stats ? `من ${stats.totalOrders} إجمالي` : '' },
          { label: 'المنتجات',           value: stats ? `${stats.productCount}` : '---', sub: 'منتج نشط' },
        ].map(card => (
          <div key={card.label} className="bg-[#111] border border-[#C5A059]/15 p-4 rounded-xl">
            <p className="text-[8px] text-[#C5A059] uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-xl font-bold text-white">{card.value}</p>
            {card.sub && <p className="text-[8px] text-gray-600 mt-0.5">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Last Order */}
      {stats?.lastOrderAt && (
        <div className="bg-[#111] border border-green-500/10 p-4 rounded-xl mb-4">
          <p className="text-[8px] text-green-400 uppercase tracking-widest mb-1">آخر طلب</p>
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-white font-mono">
              {new Date(stats.lastOrderAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
            {stats.lastOrderCity && (
              <span className="text-[9px] text-gray-500 border border-white/10 px-2 py-0.5 rounded-sm">
                📍 {stats.lastOrderCity}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent System Logs */}
      {(data?.recentLogs?.length ?? 0) > 0 && (
        <div className="bg-[#111] border border-[#C5A059]/10 p-4 rounded-xl mb-24">
          <p className="text-[8px] text-[#C5A059] uppercase tracking-widest mb-3">سجلات النظام الأخيرة</p>
          <div className="space-y-2">
            {data!.recentLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-[8px] font-mono font-bold flex-shrink-0 ${LOG_COLOR[log.level] ?? 'text-gray-500'}`}>
                  [{log.level}]
                </span>
                <p className="text-[9px] text-gray-500 leading-tight line-clamp-2">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-6 left-5 right-5 flex gap-3">
        <Link
          href="/admin/war-room"
          className="flex-1 text-center bg-transparent border border-[#C5A059]/40 py-3 rounded-full text-[10px] uppercase tracking-widest text-[#C5A059] active:scale-95 transition-transform"
        >
          ⚔️ War Room
        </Link>
        <button
          onClick={fetchPulse}
          className="flex-1 bg-[#C5A059]/10 border border-[#C5A059]/40 py-3 rounded-full text-[10px] uppercase tracking-widest text-[#C5A059] active:scale-95 transition-transform"
        >
          ↻ Force Sync
        </button>
      </div>
    </div>
  );
}
