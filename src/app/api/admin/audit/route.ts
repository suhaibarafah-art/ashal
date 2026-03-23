/**
 * CEO Full System Audit — Pings all 4 critical services
 * Neon DB · Moyasar · CJ Dropshipping · Internal Automation
 * Sends Telegram summary on heartbeat success.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/telegram';
import { getCJToken } from '@/lib/cj';

export const dynamic = 'force-dynamic';

interface PingResult {
  name: string;
  nameAr: string;
  ok: boolean;
  latencyMs: number;
  detail: string;
}

async function pingNeon(): Promise<PingResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const ms = Date.now() - start;
    return { name: 'Neon DB', nameAr: 'قاعدة البيانات', ok: true, latencyMs: ms, detail: `${ms}ms` };
  } catch (err) {
    return { name: 'Neon DB', nameAr: 'قاعدة البيانات', ok: false, latencyMs: Date.now() - start, detail: String(err).slice(0, 80) };
  }
}

async function pingMoyasar(): Promise<PingResult> {
  const start = Date.now();
  try {
    const key = process.env.MOYASAR_SECRET_KEY ?? '';
    if (!key) return { name: 'Moyasar', nameAr: 'بوابة الدفع', ok: false, latencyMs: 0, detail: 'مفتاح غير موجود' };

    const res = await fetch('https://api.moyasar.com/v1/payments?per_page=1', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
      },
      signal: AbortSignal.timeout(6000),
    });
    const ms = Date.now() - start;
    return {
      name: 'Moyasar',
      nameAr: 'بوابة الدفع',
      ok: res.status < 500,
      latencyMs: ms,
      detail: `HTTP ${res.status} · ${ms}ms`,
    };
  } catch {
    return { name: 'Moyasar', nameAr: 'بوابة الدفع', ok: false, latencyMs: Date.now() - start, detail: 'انتهت المهلة' };
  }
}

async function pingCJ(): Promise<PingResult> {
  const start = Date.now();
  try {
    const token = await getCJToken();
    const ms = Date.now() - start;
    return {
      name: 'CJ Dropshipping',
      nameAr: 'مورد CJ',
      ok: !!token,
      latencyMs: ms,
      detail: `رمز صالح · ${ms}ms`,
    };
  } catch (err) {
    return { name: 'CJ Dropshipping', nameAr: 'مورد CJ', ok: false, latencyMs: Date.now() - start, detail: String(err).slice(0, 80) };
  }
}

async function pingAutomation(): Promise<PingResult> {
  const start = Date.now();
  try {
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const recentLog = await prisma.systemLog.findFirst({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    });
    const ms = Date.now() - start;
    const ok = recentLog !== null;
    return {
      name: 'Automation',
      nameAr: 'الأتمتة',
      ok,
      latencyMs: ms,
      detail: ok
        ? `آخر نشاط: ${new Date(recentLog!.createdAt).toLocaleTimeString('ar-SA')}`
        : 'لا نشاط في آخر 24 ساعة',
    };
  } catch {
    return { name: 'Automation', nameAr: 'الأتمتة', ok: false, latencyMs: Date.now() - start, detail: 'خطأ في الفحص' };
  }
}

export async function POST() {
  const [neon, moyasar, cj, automation] = await Promise.all([
    pingNeon(),
    pingMoyasar(),
    pingCJ(),
    pingAutomation(),
  ]);

  const results: PingResult[] = [neon, moyasar, cj, automation];
  const passCount = results.filter(r => r.ok).length;
  const score = passCount * 2.5; // out of 10
  const allOk = passCount === 4;

  // Log audit result to SystemLog
  await prisma.systemLog.create({
    data: {
      level: allOk ? 'SUCCESS' : passCount >= 3 ? 'WARN' : 'ERROR',
      source: 'audit',
      message: `فحص شامل للنظام: ${passCount}/4 خدمات تعمل — النتيجة ${score}/10`,
      metadata: JSON.stringify({ results, score }),
    },
  });

  // Send Telegram summary on every successful heartbeat
  if (allOk) {
    const summary =
      `🔍 *تقرير الفحص الشامل*\n\n` +
      results.map(r => `${r.ok ? '✅' : '❌'} ${r.nameAr}: ${r.detail}`).join('\n') +
      `\n\n🏆 *صحة النظام: ${score}/10*\n_${new Date().toLocaleString('ar-SA')}_`;

    await sendTelegramAlert('SUCCESS', summary).catch(() => null);
  }

  return NextResponse.json({ results, score, allOk, passCount });
}
