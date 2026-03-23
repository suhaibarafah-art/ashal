import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const LOGS_KEY = 'titan5_logs';
const MAX_LOGS = 200;

async function requireAdmin(req: NextRequest) {
  const apiKey = req.headers.get('x-admin-key');
  if (apiKey && apiKey === process.env.CRON_SECRET) return true;
  const session = await auth();
  return session?.user && (session.user as any).role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: LOGS_KEY } });
    const logs = setting ? JSON.parse(setting.value) : [];
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}

export async function POST(req: NextRequest) {
  // Allow agents to post logs via cron secret
  const apiKey = req.headers.get('x-admin-key');
  const isAgent = apiKey && apiKey === process.env.CRON_SECRET;
  if (!isAgent && !await requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { agent, action, details, status = 'SUCCESS' } = body;

  if (!agent || !action) {
    return NextResponse.json({ error: 'agent and action required' }, { status: 400 });
  }

  const newLog = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    agent,
    action,
    details: details || null,
    status,
    createdAt: new Date().toISOString(),
  };

  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: LOGS_KEY } });
    const logs = setting ? JSON.parse(setting.value) : [];
    logs.unshift(newLog);
    const trimmed = logs.slice(0, MAX_LOGS);

    await prisma.siteSetting.upsert({
      where: { key: LOGS_KEY },
      update: { value: JSON.stringify(trimmed) },
      create: { key: LOGS_KEY, value: JSON.stringify(trimmed) },
    });

    return NextResponse.json({ ok: true, log: newLog });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.siteSetting.upsert({
    where: { key: LOGS_KEY },
    update: { value: '[]' },
    create: { key: LOGS_KEY, value: '[]' },
  });
  return NextResponse.json({ ok: true });
}
