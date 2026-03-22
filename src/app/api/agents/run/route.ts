/**
 * TITAN-10 Agent API
 * POST /api/agents/run          → runs full TITAN-10 pipeline (all 10 agents)
 * POST /api/agents/run?mode=... → mode: FULL_PIPELINE | SURVEILLANCE | ALL
 * GET  /api/agents/run          → returns last 30 agent logs + queue stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { runTitan10, TitanRunMode } from '@/lib/agents/titan10';
import { prisma } from '@/lib/prisma';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get('mode') ?? 'ALL') as TitanRunMode;

  try {
    const result = await runTitan10(mode);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    await prisma.systemLog.create({
      data: {
        level:   'ERROR',
        source:  'api/agents/run',
        message: `TITAN-10 manual run failed: ${String(error)}`,
        metadata: '{}',
      },
    }).catch(() => {});
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  const [logs, queueStats, lastReport] = await Promise.all([
    prisma.systemLog.findMany({
      where: { source: { startsWith: 'agent/' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.agentTaskQueue.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.dailyReport.findFirst({
      orderBy: { date: 'desc' },
    }),
  ]);

  const queue = Object.fromEntries(
    queueStats.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
  );

  return NextResponse.json({ success: true, logs, queue, lastReport });
}
