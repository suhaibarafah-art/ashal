'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SerializedLog {
  id: string;
  source: string;
  message: string;
  createdAt: string;
  level: string;
}

interface StatusData {
  inventory: boolean;
  content: boolean;
  finance: boolean;
  operations: boolean;
}

interface AuditResult {
  name: string;
  nameAr: string;
  ok: boolean;
  latencyMs: number;
  detail: string;
}

interface ControlRoomClientProps {
  statusData: StatusData;
  heartbeatLogs: SerializedLog[];
}

// ─── Source → Arabic label map ────────────────────────────────────────────────

const SOURCE_AR: Record<string, string> = {
  scout: 'الكاشف',
  payment: 'نظام الدفع',
  webhook: 'خطاف الدفع',
  order: 'الطلبات',
  cron: 'المهام الدورية',
  'health-check': 'فحص الصحة',
  agent: 'الوكيل الذكي',
  titan10: 'تيتان-10',
  copywriter: 'كاتب الإعلانات',
  analyst: 'المحلل',
  guardian: 'الحارس',
  'supply-chain': 'سلسلة التوريد',
  logistics: 'اللوجستيات',
  checkout: 'الدفع',
  'ab-test': 'اختبار A/B',
  'ab-evolution': 'اختبار A/B',
  ceo: 'وكيل المدير',
  audit: 'التدقيق',
  'products/sync': 'مزامنة المنتجات',
  seed: 'تهيئة البيانات',
};

function formatHeartbeatArabic(log: SerializedLog): string {
  const time = new Date(log.createdAt).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const sourceName = SOURCE_AR[log.source] ?? log.source;
  return `${time} — ${sourceName} — ${log.message}`;
}

// ─── Status Dot Component ─────────────────────────────────────────────────────

function StatusDot({ label, labelAr, ok }: { label: string; labelAr: string; ok: boolean }) {
  const green = '#22C55E';
  const red = '#EF4444';
  const color = ok ? green : red;
  const statusAr = ok ? 'يعمل' : 'متوقف';

  return (
    <div
      className="flex flex-col items-center gap-4 p-6 rounded-2xl"
      style={{
        background: ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
        border: `1px solid ${color}30`,
        boxShadow: `0 0 40px ${color}15`,
      }}
    >
      {/* Big pulsing dot */}
      <div className="relative flex items-center justify-center">
        {ok && (
          <span
            className="absolute rounded-full animate-ping"
            style={{
              width: 72,
              height: 72,
              background: `${color}25`,
            }}
          />
        )}
        <div
          className="relative rounded-full"
          style={{
            width: 64,
            height: 64,
            background: ok ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
            border: `3px solid ${color}`,
            boxShadow: ok
              ? `0 0 30px ${color}60, 0 0 60px ${color}25`
              : `0 0 20px ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="rounded-full"
            style={{ width: 28, height: 28, background: color }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-1"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
        >
          {label}
        </p>
        <p
          className="text-[18px] font-black"
          style={{ color: 'white', fontFamily: 'var(--font-cairo)', lineHeight: 1.1 }}
        >
          {labelAr}
        </p>
        <p
          className="text-[12px] font-bold mt-1"
          style={{ color, fontFamily: 'var(--font-montserrat)' }}
        >
          ● {statusAr}
        </p>
      </div>
    </div>
  );
}

// ─── Toast Component ──────────────────────────────────────────────────────────

function Toast({ message, score, onClose }: { message: string; score: number; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl"
      style={{
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #0D1F0A 0%, #0A2E12 100%)',
        border: '1px solid rgba(34,197,94,0.5)',
        boxShadow: '0 8px 64px rgba(34,197,94,0.25)',
        minWidth: 320,
        direction: 'rtl',
      }}
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          background: 'rgba(34,197,94,0.2)',
          border: '2px solid rgba(34,197,94,0.6)',
        }}
      >
        <span style={{ fontSize: 20 }}>✅</span>
      </div>
      <div className="flex-1">
        <p
          className="text-[15px] font-black"
          style={{ color: '#86EFAC', fontFamily: 'var(--font-cairo)' }}
        >
          {message}
        </p>
        <p
          className="text-[11px] mt-0.5"
          style={{ color: 'rgba(134,239,172,0.6)', fontFamily: 'var(--font-montserrat)' }}
        >
          تم إرسال التقرير إلى تيليجرام · {new Date().toLocaleTimeString('ar-SA')}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-[18px]"
        style={{ color: 'rgba(134,239,172,0.5)', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function ControlRoomClient({ statusData, heartbeatLogs }: ControlRoomClientProps) {
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[] | null>(null);
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; score: number } | null>(null);

  const systemOk = Object.values(statusData).filter(Boolean).length >= 3;

  const dots = [
    { key: 'inventory', label: 'INVENTORY', labelAr: 'المخزون', ok: statusData.inventory },
    { key: 'content', label: 'CONTENT', labelAr: 'المحتوى', ok: statusData.content },
    { key: 'finance', label: 'FINANCE', labelAr: 'المالية', ok: statusData.finance },
    { key: 'operations', label: 'OPERATIONS', labelAr: 'العمليات', ok: statusData.operations },
  ];

  async function runFullAudit() {
    setAuditing(true);
    setAuditResults(null);
    setAuditScore(null);

    try {
      const res = await fetch('/api/admin/audit', { method: 'POST' });
      const data = await res.json();

      setAuditResults(data.results);
      setAuditScore(data.score);

      const label = data.allOk
        ? `System Health: ${data.score}/10`
        : `تحذير: ${data.passCount}/4 خدمات تعمل — ${data.score}/10`;

      setToast({ message: label, score: data.score });
      setTimeout(() => setToast(null), 6000);
    } catch {
      setToast({ message: 'تعذّر الاتصال بالخادم', score: 0 });
      setTimeout(() => setToast(null), 6000);
    } finally {
      setAuditing(false);
    }
  }

  return (
    <main className="admin-bg" dir="rtl">

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div
        className="w-full px-8 py-4 flex items-center justify-between"
        style={{ background: '#002366', borderBottom: '3px solid #FF8C00' }}
      >
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-[12px] font-bold" style={{ color: 'rgba(144,202,249,0.6)', fontFamily: 'var(--font-montserrat)' }}>
              ⟨ مركز القيادة
            </Link>
            <span style={{ color: 'rgba(144,202,249,0.3)' }}>/</span>
            <span className="text-[12px] font-bold" style={{ color: 'rgba(144,202,249,0.6)', fontFamily: 'var(--font-montserrat)' }}>
              غرفة التحكم
            </span>
          </div>
          <h1 className="text-[22px] font-black text-white mt-0.5" style={{ fontFamily: 'var(--font-cairo)' }}>
            غرفة التحكم التنفيذية
          </h1>
          <p className="text-[11px]" style={{ color: 'rgba(144,202,249,0.6)', fontFamily: 'var(--font-montserrat)' }}>
            CEO CONTROL ROOM · REAL-TIME SYSTEM INTELLIGENCE
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* System OK badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: systemOk ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${systemOk ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: systemOk ? '#22C55E' : '#EF4444',
                display: 'inline-block',
                boxShadow: systemOk ? '0 0 8px #22C55E' : '0 0 8px #EF4444',
              }}
            />
            <span
              className="text-[11px] font-bold"
              style={{
                color: systemOk ? '#86EFAC' : '#FCA5A5',
                fontFamily: 'var(--font-montserrat)',
              }}
            >
              {systemOk ? 'SYSTEM NOMINAL' : 'SYSTEM DEGRADED'}
            </span>
          </div>
          <Link href="/">
            <button
              className="px-4 py-2 rounded-md font-bold text-[13px]"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-cairo)', cursor: 'pointer', border: 'none' }}
            >
              الواجهة
            </button>
          </Link>
        </div>
      </div>

      <div className="container py-10 space-y-8">

        {/* ── Section 1: 4 Status Dots ──────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: 'rgba(201,168,76,0.18)', color: '#C9A84C', fontFamily: 'var(--font-montserrat)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              VISUAL STATUS
            </span>
            <h2 className="text-[18px] font-black" style={{ color: '#F5D06E', fontFamily: 'var(--font-cairo)' }}>
              حالة المنظومة
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dots.map(dot => (
              <StatusDot key={dot.key} label={dot.label} labelAr={dot.labelAr} ok={dot.ok} />
            ))}
          </div>
        </div>

        {/* ── Section 2+3: Heartbeat + Audit ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Heartbeat Feed */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #050E1A 0%, #061524 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 4px 40px rgba(59,130,246,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', fontFamily: 'var(--font-montserrat)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                HEARTBEAT FEED
              </span>
              <h3 className="text-[16px] font-black" style={{ color: '#93C5FD', fontFamily: 'var(--font-cairo)' }}>
                نبضات النظام
              </h3>
              <div
                className="mr-auto rounded-full animate-pulse"
                style={{ width: 8, height: 8, background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}
              />
            </div>

            {heartbeatLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="text-3xl">📭</span>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-cairo)', fontSize: '14px' }}>
                  لا توجد نبضات بعد
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {heartbeatLogs.map((log, i) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{
                      background: i === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                      border: i === 0 ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      className="flex-shrink-0 rounded-full mt-1"
                      style={{
                        width: 7,
                        height: 7,
                        background: i === 0 ? '#22C55E' : 'rgba(134,239,172,0.4)',
                        boxShadow: i === 0 ? '0 0 6px #22C55E' : 'none',
                      }}
                    />
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{
                        color: i === 0 ? '#86EFAC' : 'rgba(255,255,255,0.55)',
                        fontFamily: 'var(--font-cairo)',
                        lineHeight: 1.6,
                      }}
                    >
                      {formatHeartbeatArabic(log)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Trigger + Audit Results */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-5"
            style={{
              background: 'linear-gradient(135deg, #0D1200 0%, #1A1F00 100%)',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 4px 40px rgba(201,168,76,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(201,168,76,0.18)', color: '#C9A84C', fontFamily: 'var(--font-montserrat)', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                MANUAL TRIGGER
              </span>
              <h3 className="text-[16px] font-black" style={{ color: '#F5D06E', fontFamily: 'var(--font-cairo)' }}>
                الفحص الشامل
              </h3>
            </div>

            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'rgba(245,208,110,0.55)', fontFamily: 'var(--font-cairo)' }}
            >
              اضغط لفحص جميع الخدمات دفعةً واحدة: قاعدة البيانات، بوابة الدفع، المورد، والأتمتة.
              سيصلك تقرير فوري على تيليجرام.
            </p>

            {/* RUN FULL AUDIT button */}
            <button
              onClick={runFullAudit}
              disabled={auditing}
              className="w-full py-4 rounded-xl font-black text-[16px] transition-all duration-200"
              style={{
                background: auditing
                  ? 'rgba(201,168,76,0.1)'
                  : 'linear-gradient(135deg, #C9A84C 0%, #F5D06E 50%, #C9A84C 100%)',
                color: auditing ? '#C9A84C' : '#0D0900',
                border: `2px solid ${auditing ? 'rgba(201,168,76,0.3)' : '#C9A84C'}`,
                fontFamily: 'var(--font-cairo)',
                cursor: auditing ? 'not-allowed' : 'pointer',
                boxShadow: auditing ? 'none' : '0 4px 32px rgba(201,168,76,0.35)',
                letterSpacing: '0.05em',
              }}
            >
              {auditing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  جارٍ الفحص...
                </span>
              ) : (
                '🔍 RUN FULL AUDIT'
              )}
            </button>

            {/* Audit Results */}
            {auditResults && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-montserrat)' }}
                  >
                    نتائج الفحص
                  </p>
                  <span
                    className="text-[20px] font-black"
                    style={{ color: auditScore === 10 ? '#86EFAC' : auditScore! >= 7.5 ? '#FCD34D' : '#FCA5A5', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {auditScore}/10
                  </span>
                </div>
                {auditResults.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{
                      background: r.ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${r.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14 }}>{r.ok ? '✅' : '❌'}</span>
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: r.ok ? '#86EFAC' : '#FCA5A5', fontFamily: 'var(--font-cairo)' }}
                      >
                        {r.nameAr}
                      </span>
                    </div>
                    <span
                      className="text-[11px]"
                      style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {r.detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          score={toast.score}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
