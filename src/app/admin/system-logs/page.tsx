import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * Phase 5: Stealth System Logs Page
 * No Telegram/Email — all events logged here only.
 * /admin/system-logs
 */
export default async function SystemLogsPage() {
  const logs = await prisma.systemLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const levelColor: Record<string, { bg: string; text: string; border: string }> = {
    SUCCESS: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
    INFO:    { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
    WARN:    { bg: '#FEF9C3', text: '#A16207', border: '#FDE047' },
    ERROR:   { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' },
  };

  const counts = {
    total:   logs.length,
    success: logs.filter(l => l.level === 'SUCCESS').length,
    info:    logs.filter(l => l.level === 'INFO').length,
    warn:    logs.filter(l => l.level === 'WARN').length,
    error:   logs.filter(l => l.level === 'ERROR').length,
  };

  return (
    <main className="admin-bg">
      {/* Header */}
      <div className="w-full px-8 py-4 flex items-center justify-between" style={{ background: '#002366', borderBottom: '3px solid #FF8C00' }}>
        <div>
          <h1 className="text-[22px] font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>
            سجلات النظام — Stealth Mode
          </h1>
          <p className="text-[11px]" style={{ color: 'rgba(144,202,249,0.7)', fontFamily: 'var(--font-montserrat)' }}>
            SYSTEM LOGS — NO TELEGRAM, NO EMAIL — LOCAL ONLY
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <button className="px-4 py-2 rounded-md font-bold text-[13px]" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none' }}>
              ← لوحة التحكم
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-[11px] font-semibold" style={{ color: '#86EFAC', fontFamily: 'var(--font-montserrat)' }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="container py-8">

        {/* Level counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'إجمالي', value: counts.total, color: '#002366' },
            { label: 'SUCCESS', value: counts.success, color: '#15803D' },
            { label: 'INFO', value: counts.info, color: '#1D4ED8' },
            { label: 'WARN', value: counts.warn, color: '#A16207' },
            { label: 'ERROR', value: counts.error, color: '#DC2626' },
          ].map((item, i) => (
            <div key={i} className="kpi-card" style={{ borderLeft: `4px solid ${item.color}` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>{item.label}</p>
              <p className="text-[28px] font-black" style={{ color: item.color, fontFamily: 'var(--font-montserrat)' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Logs table */}
        <div className="card-luxury">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-black" style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}>
              🔍 كل السجلات ({counts.total})
            </h2>
            <form method="POST" action="/api/sys/logs">
              <button
                type="button"
                onClick={async () => {
                  await fetch('/api/sys/logs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'admin', level: 'INFO', message: 'Admin viewed system logs page' }),
                  });
                }}
                className="text-[12px] font-semibold px-3 py-2 rounded"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
              >
                تسجيل زيارة
              </button>
            </form>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[40px] mb-4">📋</p>
              <p className="text-[16px] font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                لا توجد سجلات بعد. ستظهر هنا عند تشغيل العمليات.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const lc = levelColor[log.level] ?? { bg: '#F9FAFB', text: '#374151', border: '#D1D5DB' };
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{ background: lc.bg, borderColor: lc.border }}
                  >
                    {/* Level badge */}
                    <span
                      className="text-[10px] font-black px-2 py-1 rounded flex-shrink-0 mt-0.5"
                      style={{ background: lc.border, color: lc.text, fontFamily: 'var(--font-montserrat)', minWidth: '64px', textAlign: 'center' }}
                    >
                      {log.level}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(27,42,107,0.1)', color: '#002366', fontFamily: 'var(--font-montserrat)' }}>
                          {log.source}
                        </span>
                        <span className="text-[13px] font-semibold" style={{ color: lc.text, fontFamily: 'var(--font-cairo)' }}>
                          {log.message}
                        </span>
                      </div>
                      {log.metadata && log.metadata !== '' && (
                        <p className="text-[11px] font-mono truncate" style={{ color: 'rgba(0,0,0,0.45)' }}>
                          {log.metadata}
                        </p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-montserrat)' }}>
                      {new Date(log.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
