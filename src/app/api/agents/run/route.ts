/**
 * Titan-5 Agent API
 * POST /api/agents/run → triggers all 5 agents sequentially
 * GET  /api/agents/run → returns last 10 agent run logs
 */

import { NextResponse } from 'next/server';
import { runTitan5 } from '@/lib/agents/titan5';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const report = await runTitan5();
    return NextResponse.json({ success: true, report });
  } catch (error) {
    await prisma.systemLog.create({
      data: { level: 'ERROR', source: 'api/agents/run', message: `Titan-5 run failed: ${String(error)}` },
    }).catch(() => {});
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  const logs = await prisma.systemLog.findMany({
    where: { source: { startsWith: 'agent/' } },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  return NextResponse.json({ success: true, logs });
}
