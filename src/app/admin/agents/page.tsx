/**
 * TITAN-10 Agents Dashboard — /admin/agents
 * Live status of all 10 agents with run controls
 */

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const AGENTS = [
  { key: 'scout',      nameEn: 'Scout',      nameAr: 'الكاشف',       icon: '🔍', role: 'يبحث عن منتجات من CJ + AliExpress + Zendrop + Spocket' },
  { key: 'critic',     nameEn: 'Critic',      nameAr: 'الناقد',       icon: '🎯', role: 'يفحص جودة الصور ويقيّم المنتجات' },
  { key: 'copywriter', nameEn: 'Copywriter',  nameAr: 'الكاتب',       icon: '✍️', role: 'يكتب وصف عربي مقنع بـ Gemini AI' },
  { key: 'strategist', nameEn: 'Strategist',  nameAr: 'الاستراتيجي',  icon: '📊', role: 'يولّد Social Kit وخطة التسويق' },
  { key: 'ceo',        nameEn: 'CEO',         nameAr: 'المدير',        icon: '👔', role: 'يراجع النتائج ويقرر النشر النهائي' },
  { key: 'analyst',    nameEn: 'Analyst',     nameAr: 'المحلل',        icon: '📈', role: 'يحلل أداء المبيعات والأسعار' },
  { key: 'guardian',   nameEn: 'Guardian',    nameAr: 'الحارس',        icon: '🛡️', role: 'يراقب صحة النظام ويتحقق من المخزون' },
  { key: 'orders',     nameEn: 'Orders',      nameAr: 'الطلبات',       icon: '📦', role: 'يزامن حالة الطلبات مع الموردين' },
  { key: 'recovery',   nameEn: 'Recovery',    nameAr: 'الاسترداد',    icon: '🔄', role: 'يستعيد العربات المهجورة بخصومات' },
  { key: 'titan10',    nameEn: 'TITAN-10',    nameAr: 'القائد الكلي', icon: '🤖', role: 'ينسق جميع الوكلاء — يعمل يومياً 9ص' },
];

export default async function AgentsPage() {
  const logs = await prisma.systemLog.findMany({
    where: {
      source: {
        in: AGENTS.map(a => `agent/${a.key}`).concat(['titan10', 'cron/master']),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const lastRunMap: Record<string, { createdAt: Date; level: string; message: string }> = {};
  for (const log of logs) {
    const key = log.source.replace('agent/', '');
    if (!lastRunMap[key]) lastRunMap[key] = { createdAt: log.createdAt, level: log.level, message: log.message };
  }

  const agentsWithStatus = AGENTS.map(a => {
    const log = lastRunMap[a.key] ?? lastRunMap[`agent/${a.key}`];
    const ageMin = log ? (Date.now() - new Date(log.createdAt).getTime()) / 60000 : Infinity;
    const status = !log ? 'idle' : log.level === 'ERROR' ? 'error' : ageMin < 120 ? 'active' : 'idle';
    return { ...a, log, status, ageMin };
  });

  const activeCount = agentsWithStatus.filter(a => a.status === 'active').length;
  const errorCount  = agentsWithStatus.filter(a => a.status === 'error').length;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: '#0a0a1a', borderBottom: '2px solid #FF8C00', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin" style={{ color: '#FFDB58', fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>ADMIN</Link>
          <span style={{ color: '#444' }}>/</span>
          <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '14px' }}>🤖 وكلاء TITAN-10</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44', borderRadius: '6px', padding: '4px 10px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700 }}>
            {activeCount}/10 نشط
          </span>
          {errorCount > 0 && (
            <span style={{ background: '#dc262622', color: '#f87171', border: '1px solid #dc262644', borderRadius: '6px', padding: '4px 10px', fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700 }}>
              {errorCount} خطأ
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Run Button */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)', fontWeight: 900, fontSize: '16px', margin: 0 }}>تشغيل TITAN-10 يدوياً</h2>
            <p style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0' }}>يعمل تلقائياً كل يوم الساعة 9:00 صباحاً — يمكنك تشغيله الآن</p>
          </div>
          <form action="/api/agents/run" method="POST" target="_blank">
            <button type="submit" style={{
              background: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px',
              padding: '10px 24px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            }}>
              ▶ تشغيل الآن
            </button>
          </form>
        </div>

        {/* Agents Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {agentsWithStatus.map(agent => {
            const dotColor = agent.status === 'active' ? '#16a34a' : agent.status === 'error' ? '#dc2626' : '#6b7280';
            const bgColor  = agent.status === 'active' ? '#16a34a11' : agent.status === 'error' ? '#dc262611' : 'transparent';
            return (
              <div key={agent.key} style={{
                background: 'var(--bg-secondary)', border: `1px solid ${agent.status === 'error' ? '#dc262644' : 'var(--border-color)'}`,
                borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: dotColor }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontSize: '28px', lineHeight: 1 }}>{agent.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '13px', color: 'var(--text-primary)' }}>{agent.nameEn}</span>
                      <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)' }}>{agent.nameAr}</span>
                      <span style={{
                        marginRight: 'auto', width: '8px', height: '8px', borderRadius: '50%',
                        background: dotColor, boxShadow: agent.status === 'active' ? `0 0 6px ${dotColor}` : 'none',
                        flexShrink: 0,
                      }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>{agent.role}</p>
                    {agent.log ? (
                      <div style={{ background: bgColor, borderRadius: '6px', padding: '6px 8px' }}>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>
                          {new Date(agent.log.createdAt).toLocaleString('en-US')}
                        </p>
                        <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: agent.status === 'error' ? '#f87171' : 'var(--text-secondary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {agent.log.message}
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: '#6b7280', margin: 0 }}>لم يعمل بعد</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Logs */}
        <div style={{ marginTop: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>📋 آخر سجلات الوكلاء</h3>
            <Link href="/admin/system-logs" className="flex items-center gap-1" style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: '#FF8C00', textDecoration: 'none' }}>عرض الكل <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
          </div>
          {logs.slice(0, 8).map((log, i) => (
            <div key={log.id} style={{ padding: '10px 20px', borderBottom: i < 7 ? '1px solid var(--border-color)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                background: log.level === 'SUCCESS' ? '#16a34a22' : log.level === 'ERROR' ? '#dc262622' : '#f59e0b22',
                color: log.level === 'SUCCESS' ? '#4ade80' : log.level === 'ERROR' ? '#f87171' : '#fbbf24',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{log.level}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{log.source}</span>
              <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.message}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap', marginRight: 'auto' }}>{new Date(log.createdAt).toLocaleTimeString('ar-SA')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
