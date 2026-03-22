/**
 * TITAN-10 DEEP LOOP — Master Orchestrator
 *
 * Full pipeline (runs at 06:00 AM):
 *   Scout → Critic → Copywriter → Strategist → CEO → Analyst
 *
 * Surveillance (runs on every 4h tick):
 *   Guardian + OrdersSync + Recovery
 */

import { runScout }       from './scout';
import { runCritic }      from './critic';
import { runCopywriter }  from './copywriter';
import { runStrategist }  from './strategist';
import { runCEO, notifyCritical } from './ceo';
import { runGuardian }    from './guardian';
import { runOrdersSync }  from './orders';
import { runRecovery }    from './recovery';
import { runAnalyst }     from './analyst';
import { prisma }         from '@/lib/prisma';

export type TitanRunMode = 'FULL_PIPELINE' | 'SURVEILLANCE' | 'ALL';

export interface TitanRunResult {
  mode:      TitanRunMode;
  duration:  number;
  pipeline?: Record<string, unknown>;
  surveillance?: Record<string, unknown>;
  errors:    string[];
}

// ─── FULL PIPELINE: Scout → Critic → Copy → Strategy → CEO ─────────────────
async function runPipeline(): Promise<Record<string, unknown>> {
  const results: Record<string, unknown> = {};

  try {
    results.scout = await runScout();
  } catch (err) {
    results.scout = { error: String(err) };
    await notifyCritical('Scout', 'Scout pipeline step failed', err);
  }

  try {
    results.critic = await runCritic();
  } catch (err) {
    results.critic = { error: String(err) };
    await notifyCritical('Critic', 'Critic pipeline step failed', err);
  }

  try {
    results.copywriter = await runCopywriter();
  } catch (err) {
    results.copywriter = { error: String(err) };
    await notifyCritical('Copywriter', 'Copywriter pipeline step failed', err);
  }

  try {
    results.strategist = await runStrategist();
  } catch (err) {
    results.strategist = { error: String(err) };
    await notifyCritical('Strategist', 'Strategist pipeline step failed', err);
  }

  try {
    results.ceo = await runCEO();
  } catch (err) {
    results.ceo = { error: String(err) };
    await notifyCritical('CEO', 'CEO publish step failed', err);
  }

  try {
    results.analyst = await runAnalyst();
  } catch (err) {
    results.analyst = { error: String(err) };
  }

  return results;
}

// ─── SURVEILLANCE: Guardian + Orders + Recovery ─────────────────────────────
async function runSurveillance(): Promise<Record<string, unknown>> {
  const results: Record<string, unknown> = {};

  await Promise.allSettled([
    runGuardian().then(r  => { results.guardian = r; }),
    runOrdersSync().then(r => { results.orders  = r; }),
    runRecovery().then(r   => { results.recovery = r; }),
  ]);

  return results;
}

// ─── MAIN ENTRY ─────────────────────────────────────────────────────────────
export async function runTitan10(mode: TitanRunMode = 'ALL'): Promise<TitanRunResult> {
  const start  = Date.now();
  const errors: string[] = [];

  const result: TitanRunResult = { mode, duration: 0, errors };

  if (mode === 'FULL_PIPELINE' || mode === 'ALL') {
    result.pipeline = await runPipeline();
  }

  if (mode === 'SURVEILLANCE' || mode === 'ALL') {
    result.surveillance = await runSurveillance();
  }

  result.duration = Date.now() - start;

  await prisma.systemLog.create({
    data: {
      level: 'INFO',
      source: 'titan10',
      message: `TITAN-10 run complete [${mode}] in ${(result.duration / 1000).toFixed(1)}s`,
      metadata: JSON.stringify({ mode, pipeline: result.pipeline, surveillance: result.surveillance }),
    },
  });

  return result;
}
