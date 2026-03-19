import { NextResponse } from 'next/server';

/**
 * Vercel Cron Endpoint — triggers the CEO Agent daily at 04:00 Riyadh time.
 * Vercel calls this; the agent runs as a Railway background worker.
 *
 * Security: Vercel sends the Authorization header automatically for cron jobs.
 * Additionally validates a CRON_SECRET for manual triggers.
 */

function validateCronAuth(request) {
  const authHeader = request.headers.get('authorization');
  // Vercel cron automatic header
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  // Allow internal trigger from n8n or admin
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret && cronSecret === process.env.CRON_SECRET) return true;
  return false;
}

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max on Vercel Pro, adjust as needed

export async function GET(request) {
  if (!validateCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[CRON] CEO Agent triggered at:', new Date().toISOString());

  try {
    // Option A: Trigger Railway worker via webhook (recommended for long-running tasks)
    const railwayWebhook = process.env.RAILWAY_AGENT_WEBHOOK_URL;
    const agentSecret = process.env.RAILWAY_AGENT_SECRET;

    if (railwayWebhook) {
      const response = await fetch(railwayWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-agent-secret': agentSecret || '',
        },
        body: JSON.stringify({
          action: 'run_ceo_agent',
          config: {
            maxProducts: parseInt(process.env.AGENT_MAX_PRODUCTS || '15'),
            minLuxuryScore: parseInt(process.env.AGENT_MIN_SCORE || '50'),
            dryRun: process.env.AGENT_DRY_RUN === 'true',
          },
          triggeredAt: new Date().toISOString(),
          triggeredBy: 'vercel_cron',
        }),
        signal: AbortSignal.timeout(30000), // 30s to initiate
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Railway agent webhook failed: ${response.status} — ${errText}`);
      }

      const result = await response.json();

      return NextResponse.json({
        status: 'triggered',
        message: 'CEO Agent dispatched to Railway worker',
        railwayResponse: result,
        triggeredAt: new Date().toISOString(),
        elapsedMs: Date.now() - startTime,
      });
    }

    // Option B: Run inline if no Railway webhook (for small runs / Vercel Pro 300s timeout)
    // Dynamic import to avoid bundling the entire agent in the Next.js build
    const { runCEOAgent } = await import('@/../agents-team/chief-executive-agent.js');

    const agentResult = await runCEOAgent({
      maxProducts: parseInt(process.env.AGENT_MAX_PRODUCTS || '10'),
      minLuxuryScore: parseInt(process.env.AGENT_MIN_SCORE || '50'),
      dryRun: process.env.AGENT_DRY_RUN === 'true',
    });

    return NextResponse.json({
      status: 'completed',
      report: agentResult.report,
      summary: {
        approved: agentResult.approved?.length || 0,
        published: agentResult.publishResult?.published || 0,
        rejected: agentResult.rejected?.length || 0,
      },
      elapsedMs: Date.now() - startTime,
    });

  } catch (err) {
    console.error('[CRON] CEO Agent error:', err.message);
    return NextResponse.json({
      status: 'error',
      error: err.message,
      elapsedMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Allow manual POST trigger from admin dashboard
export async function POST(request) {
  return GET(request);
}
