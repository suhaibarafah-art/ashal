/**
 * GET /api/agents/status
 * Returns real-time status for each Titan-5 agent:
 * - Checks env vars (GEMINI_API_KEY, CJ_API_KEY, N8N_WEBHOOK_URL, TELEGRAM_BOT_TOKEN)
 * - Reads last SystemLog entry per agent from DB
 * - Returns statuses: ACTIVE | IDLE | ERROR | MISSING_KEY
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function GET() {
  // Check which env vars are set
  const hasGemini   = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  const hasCJ       = !!(process.env.CJ_API_KEY && process.env.CJ_API_KEY !== 'PENDING');
  const hasCJToken  = !!(process.env.CJ_ACCESS_TOKEN);
  const hasN8N      = !!(process.env.N8N_WEBHOOK_URL);
  const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN);

  // Fetch last SystemLog entry per agent from DB
  let logs: Record<string, { createdAt: Date; level: string; message: string }> = {};
  try {
    const rows = await prisma.systemLog.findMany({
      where: { source: { in: ['agent/scout', 'agent/copywriter', 'agent/critic', 'agent/strategist', 'agent/ceo'] } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    for (const row of rows) {
      if (!logs[row.source]) logs[row.source] = { createdAt: row.createdAt, level: row.level, message: row.message };
    }
  } catch {
    // DB not available — continue with env-only status
  }

  function deriveStatus(source: string, hasKeys: boolean): AgentStatus {
    if (!hasKeys) return 'MISSING_KEY';
    const log = logs[source];
    if (!log) return 'IDLE';
    const ageMin = (Date.now() - new Date(log.createdAt).getTime()) / 60000;
    if (log.level === 'ERROR') return 'ERROR';
    if (ageMin < 120) return 'ACTIVE'; // ran within 2h
    return 'IDLE';
  }

  function fmt(source: string): string | null {
    const log = logs[source];
    if (!log) return null;
    return new Date(log.createdAt).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });
  }

  const agents: AgentInfo[] = [
    {
      id: 1,
      nameAr: 'الكاشف',
      nameEn: 'THE SCOUT',
      role: 'مسح CJ / Zendrop عن المنتجات عالية الهامش',
      status: deriveStatus('agent/scout', hasGemini && (hasCJ || hasCJToken)),
      lastRun: fmt('agent/scout'),
      lastMessage: logs['agent/scout']?.message ?? null,
      keyRequired: (!hasGemini || (!hasCJ && !hasCJToken)) ? 'GEMINI_API_KEY + CJ_API_KEY' : null,
    },
    {
      id: 2,
      nameAr: 'الكاتب الملكي',
      nameEn: 'ROYAL COPYWRITER',
      role: 'كتابة صفحات منتج بلهجة سعودية راقية',
      status: deriveStatus('agent/copywriter', hasGemini),
      lastRun: fmt('agent/copywriter'),
      lastMessage: logs['agent/copywriter']?.message ?? null,
      keyRequired: !hasGemini ? 'GEMINI_API_KEY' : null,
    },
    {
      id: 3,
      nameAr: 'الناقد البصري',
      nameEn: 'VISUAL CRITIC',
      role: 'تدقيق جمالي تلقائي — رفض أي صورة رخيصة',
      status: deriveStatus('agent/critic', hasGemini),
      lastRun: fmt('agent/critic'),
      lastMessage: logs['agent/critic']?.message ?? null,
      keyRequired: !hasGemini ? 'GEMINI_API_KEY' : null,
    },
    {
      id: 4,
      nameAr: 'استراتيجي السوشيال',
      nameEn: 'SOCIAL STRATEGIST',
      role: 'توليد كيت تسويقي فيروسي لكل منتج',
      status: deriveStatus('agent/strategist', true), // no external keys needed
      lastRun: fmt('agent/strategist'),
      lastMessage: logs['agent/strategist']?.message ?? null,
      keyRequired: null,
    },
    {
      id: 5,
      nameAr: 'المدير التنفيذي',
      nameEn: 'THE CEO',
      role: 'تنسيق كامل + Telegram + إشعارات فورية',
      status: deriveStatus('agent/ceo', hasN8N || hasTelegram),
      lastRun: fmt('agent/ceo'),
      lastMessage: logs['agent/ceo']?.message ?? null,
      keyRequired: (!hasN8N && !hasTelegram) ? 'TELEGRAM_BOT_TOKEN أو N8N_WEBHOOK_URL' : null,
    },
  ];

  const activeCount   = agents.filter(a => a.status === 'ACTIVE').length;
  const missingCount  = agents.filter(a => a.status === 'MISSING_KEY').length;
  const errorCount    = agents.filter(a => a.status === 'ERROR').length;

  return NextResponse.json({
    agents,
    summary: { activeCount, missingCount, errorCount, total: 5 },
    checkedAt: new Date().toISOString(),
    envFlags: { hasGemini, hasCJ: hasCJ || hasCJToken, hasN8N, hasTelegram },
  });
}
