/**
 * System Health Dashboard — /admin/system-health
 * Live ping of all critical services
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getHealthData() {
  const [dbCheck, recentLogs, orderStats, cjTokenRow, cjExpiryRow] = await Promise.all([
    prisma.$queryRaw`SELECT 1 as ok`.then(() => true).catch(() => false),
    prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.order.groupBy({ by: ['paymentStatus'], _count: { id: true } }),
    prisma.siteSetting.findUnique({ where: { key: 'cj_access_token' } }).catch(() => null),
    prisma.siteSetting.findUnique({ where: { key: 'cj_token_expiry' } }).catch(() => null),
  ]);

  // CJ token: check DB first, then env var
  const cjDbValid = !!(cjTokenRow?.value && cjTokenRow.value.length > 10 &&
    (!cjExpiryRow || new Date(cjExpiryRow.value) > new Date()));
  const hasGemini   = !!(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('your_'));
  const hasCJ       = cjDbValid || !!(process.env.CJ_API_KEY && !process.env.CJ_API_KEY.startsWith('your_'));
  const cjExpiry    = cjExpiryRow?.value ?? null;
  const hasMoyasar  = !!(process.env.MOYASAR_API_KEY && process.env.MOYASAR_API_KEY.startsWith('sk_live'));
  const hasWhatsApp = !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_TOKEN !== 'placeholder');
  const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN);
  const hasTabby    = !!(process.env.TABBY_SECRET_KEY);
  const hasTamara   = !!(process.env.TAMARA_API_TOKEN);

  const lastCron = recentLogs.find(l => l.source.includes('cron'));
  const lastTitan = recentLogs.find(l => l.source.includes('titan'));
  const errors = recentLogs.filter(l => l.level === 'ERROR').slice(0, 5);

  return { dbCheck, hasGemini, hasCJ, cjExpiry, cjDbValid, hasMoyasar, hasWhatsApp, hasTelegram, hasTabby, hasTamara, lastCron, lastTitan, errors, orderStats };
}

export default async function SystemHealthPage() {
  const h = await getHealthData();

  const services = [
    { name: 'قاعدة البيانات', nameEn: 'Neon DB', ok: h.dbCheck, icon: '🗄️', detail: h.dbCheck ? 'متصل' : 'غير متصل' },
    { name: 'بوابة الدفع', nameEn: 'Moyasar', ok: h.hasMoyasar, icon: '💳', detail: h.hasMoyasar ? 'مفتاح حي' : 'مفتاح ناقص' },
    { name: 'مورد CJ', nameEn: 'CJ Dropshipping', ok: h.hasCJ, icon: '📦', detail: h.hasCJ ? (h.cjDbValid ? `توكن في DB — ينتهي ${h.cjExpiry ? new Date(h.cjExpiry).toLocaleDateString('ar-SA') : '?'}` : 'CJ_API_KEY موجود') : 'لا يوجد توكن' },
    { name: 'Gemini AI', nameEn: 'Gemini AI', ok: h.hasGemini, icon: '🤖', detail: h.hasGemini ? 'مفتاح موجود' : 'مفتاح ناقص' },
    { name: 'واتساب', nameEn: 'WhatsApp', ok: h.hasWhatsApp, icon: '💬', detail: h.hasWhatsApp ? 'token موجود' : 'لم يُضف بعد' },
    { name: 'تيليجرام', nameEn: 'Telegram', ok: h.hasTelegram, icon: '📱', detail: h.hasTelegram ? 'token موجود' : 'لم يُضف بعد' },
    { name: 'Tabby BNPL', nameEn: 'Tabby', ok: h.hasTabby, icon: '🏦', detail: h.hasTabby ? 'مفعّل' : 'لم يُفعّل بعد' },
    { name: 'Tamara BNPL', nameEn: 'Tamara', ok: h.hasTamara, icon: '🏦', detail: h.hasTamara ? 'مفعّل' : 'لم يُفعّل بعد' },
  ];

  const okCount = services.filter(s => s.ok).length;
  const healthPct = Math.round((okCount / services.length) * 100);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ background: '#0a0a1a', borderBottom: '2px solid #FF8C00', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>ADMIN</Link>
          <span style={{ color: '#444' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '14px' }}>🩺 صحة النظام</span>
        </div>
        <span style={{
          background: healthPct === 100 ? '#16a34a22' : healthPct >= 50 ? '#f59e0b22' : '#dc262622',
          color: healthPct === 100 ? '#4ade80' : healthPct >= 50 ? '#fbbf24' : '#f87171',
          border: `1px solid ${healthPct === 100 ? '#16a34a44' : healthPct >= 50 ? '#f59e0b44' : '#dc262644'}`,
          borderRadius: '6px', padding: '4px 12px', fontFamily: 'var(--font-montserrat)', fontSize: '12px', fontWeight: 700,
        }}>
          {healthPct}% — {okCount}/{services.length} خدمة
        </span>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {services.map(s => (
            <div key={s.nameEn} style={{
              background: 'var(--bg-secondary)', border: `1px solid ${s.ok ? '#16a34a33' : '#6b728033'}`,
              borderRadius: '10px', padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.ok ? '#16a34a' : '#6b7280', boxShadow: s.ok ? '0 0 6px #16a34a' : 'none' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 4px' }}>{s.name}</p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: s.ok ? '#4ade80' : '#9ca3af', margin: 0 }}>{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Cron Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 8px' }}>⏰ آخر تشغيل Cron</h3>
            <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
              {h.lastCron ? new Date(h.lastCron.createdAt).toLocaleString('ar-SA') : 'لم يعمل بعد'}
            </p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 8px' }}>🤖 آخر تشغيل TITAN</h3>
            <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
              {h.lastTitan ? new Date(h.lastTitan.createdAt).toLocaleString('ar-SA') : 'لم يعمل بعد'}
            </p>
          </div>
        </div>

        {/* Order Stats */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 12px' }}>📦 حالة الطلبات</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {h.orderStats.map(s => (
              <div key={s.paymentStatus} style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '8px 12px' }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 2px' }}>{s.paymentStatus}</p>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>{s._count.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Errors */}
        {h.errors.length > 0 && (
          <div style={{ background: '#dc262611', border: '1px solid #dc262633', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px', color: '#f87171', margin: '0 0 12px' }}>⚠️ آخر الأخطاء</h3>
            {h.errors.map(e => (
              <div key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #dc262622' }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#9ca3af', margin: '0 0 2px' }}>{e.source} — {new Date(e.createdAt).toLocaleString('ar-SA')}</p>
                <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: '#f87171', margin: 0 }}>{e.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* What's Missing */}
        {okCount < services.length && (
          <div style={{ marginTop: '24px', background: '#f59e0b11', border: '1px solid #f59e0b33', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px', color: '#fbbf24', margin: '0 0 8px' }}>📋 مفاتيح ناقصة — أضفها في Vercel Dashboard</h3>
            {services.filter(s => !s.ok).map(s => (
              <p key={s.nameEn} style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: '#d1d5db', margin: '4px 0' }}>
                • <strong>{s.nameEn}</strong>: {s.detail}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
