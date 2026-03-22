'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * AgentHeartbeat — Titan-5 live status panel
 * Fetches /api/agents/status every 30s — shows real env var checks + DB log timestamps
 */

type AgentStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'MISSING_KEY';

interface AgentInfo {
  id: number;
  nameAr: string;
  nameEn: string;
  role: string;
  status: AgentStatus;
  lastRun: string | null;
  lastMessage: string | null;
  keyRequired: string | null;
}

interface StatusResponse {
  agents: AgentInfo[];
  summary: { activeCount: number; missingCount: number; errorCount: number; total: number };
  checkedAt: string;
  envFlags: { hasGemini: boolean; hasCJ: boolean; hasN8N: boolean; hasTelegram: boolean };
}

const STATUS_CONFIG: Record<AgentStatus, { dot: string; label: string; labelColor: string; pulse: boolean }> = {
  ACTIVE:      { dot: 'bg-green-500',  label: 'نشط',         labelColor: 'text-green-400',  pulse: true  },
  IDLE:        { dot: 'bg-yellow-500', label: 'في الانتظار', labelColor: 'text-yellow-400', pulse: false },
  ERROR:       { dot: 'bg-red-500',    label: 'خطأ',          labelColor: 'text-red-400',    pulse: true  },
  MISSING_KEY: { dot: 'bg-orange-500', label: 'مفتاح ناقص',  labelColor: 'text-orange-400', pulse: false },
};

export default function AgentHeartbeat() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<string>('---');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/status', { cache: 'no-store' });
      if (!res.ok) throw new Error(`${res.status}`);
      const json: StatusResponse = await res.json();
      setData(json);
      setLastFetch(new Date().toLocaleTimeString('ar-SA'));
    } catch {
      // keep stale data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const agents = data?.agents ?? [];
  const summary = data?.summary;
  const flags   = data?.envFlags;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.4em] text-gray-500">TITAN-5 AGENT SQUAD</h5>
          {summary && (
            <p className="text-[10px] text-gray-600 mt-1">
              {summary.activeCount}/{summary.total} نشط
              {summary.missingCount > 0 && ` — ${summary.missingCount} يتطلب مفاتيح`}
              {summary.errorCount > 0 && ` — ${summary.errorCount} خطأ`}
            </p>
          )}
        </div>
        <button
          onClick={() => { setLoading(true); fetchStatus(); }}
          className="text-[9px] font-mono text-gray-600 hover:text-gray-400 transition-colors"
        >
          ↻ آخر فحص: {lastFetch}
        </button>
      </div>

      {/* Env flags row */}
      {flags && (
        <div className="flex gap-3 flex-wrap mb-5">
          {[
            { label: 'Gemini', ok: flags.hasGemini },
            { label: 'CJ API', ok: flags.hasCJ },
            { label: 'Telegram', ok: flags.hasTelegram },
            { label: 'n8n', ok: flags.hasN8N },
          ].map(f => (
            <span
              key={f.label}
              className={`text-[8px] font-mono px-2 py-0.5 rounded-sm border ${
                f.ok
                  ? 'border-green-500/30 text-green-400 bg-green-500/5'
                  : 'border-orange-500/30 text-orange-400 bg-orange-500/5'
              }`}
            >
              {f.ok ? '✓' : '✗'} {f.label}
            </span>
          ))}
        </div>
      )}

      {/* Agent list */}
      {loading && !data ? (
        <div className="text-center py-8 text-[10px] text-gray-600 font-mono">جارٍ التحقق من حالة الوكلاء...</div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => {
            const cfg = STATUS_CONFIG[agent.status];
            return (
              <div
                key={agent.id}
                className="border border-white/5 bg-white/[0.02] p-4 rounded-sm hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Status dot */}
                    <span className="relative flex h-2 w-2 flex-shrink-0 mt-1">
                      {cfg.pulse && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-white font-mono">[{agent.nameEn}]</span>
                        <span className="text-[11px] text-gray-300">{agent.nameAr}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{agent.role}</p>
                      {agent.lastMessage && (
                        <p className="text-[9px] text-gray-600 mt-1 truncate max-w-xs">{agent.lastMessage}</p>
                      )}
                      {agent.keyRequired && (
                        <p className="text-[9px] text-orange-500/80 mt-1 font-mono">⚠ يتطلب: {agent.keyRequired}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${cfg.labelColor}`}>
                      {cfg.label}
                    </span>
                    <div className="text-[8px] text-gray-600 mt-1">
                      {agent.lastRun ? `آخر تشغيل: ${agent.lastRun}` : 'لم يعمل بعد'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Missing keys warning */}
      {(summary?.missingCount ?? 0) > 0 && (
        <div className="mt-4 border border-orange-500/20 bg-orange-500/5 p-3 text-center rounded-sm">
          <p className="text-[9px] text-orange-400 font-mono">
            ⚠ أضف المفاتيح الناقصة في Vercel Dashboard → Environment Variables
          </p>
        </div>
      )}
    </div>
  );
}
