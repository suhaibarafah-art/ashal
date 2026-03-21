import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Phase 5: System Logs API (Stealth Protocol)
 * No Telegram/Email — all events logged here only.
 *
 * GET  /api/sys/logs        — fetch recent logs
 * POST /api/sys/logs        — write a new log entry
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level') ?? undefined;
  const source = searchParams.get('source') ?? undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);

  const logs = await prisma.systemLog.findMany({
    where: {
      ...(level  ? { level }  : {}),
      ...(source ? { source } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ success: true, count: logs.length, logs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      level?: string;
      source: string;
      message: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.source || !body.message) {
      return NextResponse.json({ success: false, error: 'source and message required' }, { status: 400 });
    }

    const log = await prisma.systemLog.create({
      data: {
        level:    body.level ?? 'INFO',
        source:   body.source,
        message:  body.message,
        metadata: body.metadata ? JSON.stringify(body.metadata) : '',
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
