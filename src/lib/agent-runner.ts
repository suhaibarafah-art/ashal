/**
 * TITAN-10 Agent Runner — Shared utility for all agents
 * Handles: auth validation, logging, config, queue management
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export type AgentName =
  | 'SCOUT' | 'COPYWRITER' | 'CRITIC' | 'STRATEGIST' | 'CEO'
  | 'ORDER_MANAGER' | 'PRICE_WATCHER' | 'INVENTORY' | 'RECOVERY' | 'ANALYST';

export type LogStatus = 'SUCCESS' | 'ERROR' | 'INFO' | 'PENDING' | 'WARN';

export interface AgentLogEntry {
  id: string;
  agent: AgentName;
  action: string;
  details: string;
  status: LogStatus;
  createdAt: string;
}

const MAX_LOGS = 300;
const LOGS_KEY = 'titan10_logs';
const CONFIG_KEY = 'titan10_config';
const SCOUT_QUEUE_KEY = 'agent_scout_queue';
const APPROVED_QUEUE_KEY = 'agent_approved_queue';

/* ── Auth ──────────────────────────────────────────────────────────────────── */

export function validateAgentAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  const secret = req.headers.get('x-cron-secret');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // dev mode
  return auth === `Bearer ${cronSecret}` || secret === cronSecret;
}

/* ── Logging ───────────────────────────────────────────────────────────────── */

export async function logAgent(
  agent: AgentName,
  action: string,
  status: LogStatus,
  details = ''
): Promise<void> {
  try {
    const entry: AgentLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      agent,
      action,
      details,
      status,
      createdAt: new Date().toISOString(),
    };

    const existing = await prisma.siteSetting.findUnique({ where: { key: LOGS_KEY } });
    const logs: AgentLogEntry[] = existing ? JSON.parse(existing.value) : [];
    logs.unshift(entry);
    if (logs.length > MAX_LOGS) logs.splice(MAX_LOGS);

    await prisma.siteSetting.upsert({
      where: { key: LOGS_KEY },
      create: { key: LOGS_KEY, value: JSON.stringify(logs) },
      update: { value: JSON.stringify(logs) },
    });
  } catch { /* non-blocking */ }
}

export async function getLogs(agent?: AgentName): Promise<AgentLogEntry[]> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: LOGS_KEY } });
    const logs: AgentLogEntry[] = row ? JSON.parse(row.value) : [];
    return agent ? logs.filter(l => l.agent === agent) : logs;
  } catch { return []; }
}

/* ── Config ────────────────────────────────────────────────────────────────── */

export interface AgentConfig {
  autonomousMode: boolean;
  agentEnabled: Partial<Record<AgentName, boolean>>;
  minLuxuryScore: number;
  maxProductsPerRun: number;
}

export async function getConfig(): Promise<AgentConfig> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: CONFIG_KEY } });
    return row ? JSON.parse(row.value) : defaultConfig();
  } catch { return defaultConfig(); }
}

export async function saveConfig(config: Partial<AgentConfig>): Promise<void> {
  const current = await getConfig();
  const merged = { ...current, ...config };
  await prisma.siteSetting.upsert({
    where: { key: CONFIG_KEY },
    create: { key: CONFIG_KEY, value: JSON.stringify(merged) },
    update: { value: JSON.stringify(merged) },
  });
}

function defaultConfig(): AgentConfig {
  return {
    autonomousMode: true,
    agentEnabled: {},
    minLuxuryScore: 50,
    maxProductsPerRun: 15,
  };
}

/* ── Queues ────────────────────────────────────────────────────────────────── */

export async function getQueue<T>(key: string): Promise<T[]> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row ? JSON.parse(row.value) : [];
  } catch { return []; }
}

export async function setQueue<T>(key: string, data: T[]): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: JSON.stringify(data) },
    update: { value: JSON.stringify(data) },
  });
}

export async function clearQueue(key: string): Promise<void> {
  await setQueue(key, []);
}

export const QUEUES = { SCOUT: SCOUT_QUEUE_KEY, APPROVED: APPROVED_QUEUE_KEY };

/* ── withRetry — wraps any async DB/API call with exponential backoff ─────── */

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw lastError;
}
