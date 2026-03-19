/**
 * CHIEF EXECUTIVE AGENT — The Manager (Orchestrator)
 * Commands the entire agent pipeline:
 *   Scout → Copywriter → Design Critic → Publisher
 *
 * Outputs a final approved JSON package and POSTs to the
 * Next.js webhook for database insertion.
 */

import { createAgentLogger } from './logger.js';
import { runScoutAgent } from './scout-agent.js';
import { runCopywriterAgent } from './copywriter-agent.js';
import { runDesignCriticAgent } from './design-critic-agent.js';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import axios from 'axios';
import 'dotenv/config';

const log = createAgentLogger('CEO Agent');

// ── Ensure output dirs ────────────────────────────────────────────────────────
async function ensureDirs() {
  const dirs = ['logs', 'output'];
  for (const dir of dirs) {
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  }
}

// ── Publish to Next.js via Webhook ────────────────────────────────────────────
async function publishToStore(approvedProducts) {
  const webhookUrl = process.env.NEXTJS_WEBHOOK_URL;
  const token = process.env.N8N_TO_NEXTJS_SECRET;

  if (!webhookUrl || !token) {
    log.warn('NEXTJS_WEBHOOK_URL or N8N_TO_NEXTJS_SECRET not set — skipping publish');
    return { published: 0, skipped: approvedProducts.length };
  }

  log.info(`📡 Publishing ${approvedProducts.length} products to store...`);

  let published = 0;
  const errors = [];

  for (const product of approvedProducts) {
    try {
      const payload = buildProductPayload(product);
      const res = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-n8n-secret': token,
        },
        timeout: 15000,
      });

      if (res.data?.success) {
        published++;
        log.info(`✓ Published: ${product.titleAr} → ID ${res.data.productId}`);
      } else {
        errors.push({ product: product.titleAr, error: res.data?.error });
        log.warn(`Failed to publish ${product.titleAr}: ${res.data?.error}`);
      }
    } catch (err) {
      errors.push({ product: product.titleAr, error: err.message });
      log.error(`Publish error for ${product.titleAr}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  return { published, errors, skipped: approvedProducts.length - published };
}

// ── Build Final Product Payload ───────────────────────────────────────────────
function buildProductPayload(product) {
  return {
    // Identity
    slug: product.slug,
    supplierSku: product.supplierSku || product.pid,
    source: product.source,

    // Bilingual content
    titleAr: product.titleAr,
    titleEn: product.titleEn,
    shortDescAr: product.shortDescAr,
    shortDescEn: product.shortDescEn,
    descAr: product.descAr,
    descEn: product.descEn,
    bulletsAr: product.bulletsAr || [],
    bulletsEn: product.bulletsEn || [],

    // SEO
    metaTitleAr: product.metaTitleAr,
    metaTitleEn: product.metaTitleEn,
    metaDescAr: product.metaDescAr,
    metaDescEn: product.metaDescEn,

    // Pricing
    sellingPrice: product.pricing?.sellingPrice || product.sellingPrice,
    comparePrice: product.pricing?.compareAtPrice || product.comparePrice,
    costPrice: product.pricing?.costSAR || product.costPrice,

    // Media
    images: Array.isArray(product.images) ? product.images : [product.images].filter(Boolean),

    // Supplier
    supplierId: process.env.DEFAULT_SUPPLIER_ID || null,
    supplierSku: product.pid || product.supplierSku,

    // Status & flags
    isActive: false,    // NEVER auto-publish — admin must review
    isFeatured: false,
    codEnabled: true,
    stock: product.variants?.reduce((s, v) => s + (parseInt(v.variantStock || v.inventory || 0)), 0) || 50,
    leadTimeDays: parseInt(product.shippingTime) || 7,

    // Audit trail
    luxuryScore: product.luxuryScore,
    criticScore: product.criticReport?.overallScore,
    luxuryTag: product.luxuryTag,
    agentBatch: new Date().toISOString().split('T')[0],
  };
}

// ── Notification ──────────────────────────────────────────────────────────────
async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
  } catch { /* silent */ }
}

// ── Main CEO Execution ────────────────────────────────────────────────────────
export async function runCEOAgent({
  maxProducts = 10,
  minLuxuryScore = 50,
  dryRun = false,
} = {}) {
  const startTime = Date.now();
  await ensureDirs();

  log.info('👑 ════════════════════════════════════════');
  log.info('👑  CHIEF EXECUTIVE AGENT — SESSION START');
  log.info('👑 ════════════════════════════════════════');
  log.info(`Mode: ${dryRun ? '🔵 DRY RUN' : '🔴 LIVE'} | Target: ${maxProducts} products`);

  const report = {
    sessionId: `ceo-${Date.now()}`,
    startedAt: new Date().toISOString(),
    dryRun,
    stages: {},
  };

  try {
    // ── STAGE 1: Scout ──────────────────────────────────────────────────────
    log.info('\n── STAGE 1: Scout ──────────────────────────────');
    const scoutedProducts = await runScoutAgent({ maxProducts, minScore: minLuxuryScore });
    report.stages.scout = { count: scoutedProducts.length, status: 'done' };

    if (scoutedProducts.length === 0) {
      log.warn('Scout returned 0 products. Ending session.');
      return { ...report, finalStatus: 'no_products_found' };
    }

    // ── STAGE 2: Copywriter ─────────────────────────────────────────────────
    log.info('\n── STAGE 2: Copywriter ─────────────────────────');
    const copywrittenProducts = await runCopywriterAgent(scoutedProducts);
    report.stages.copywriter = {
      success: copywrittenProducts.filter(p => p.status === 'copywritten').length,
      failed: copywrittenProducts.filter(p => p.status === 'copy_failed').length,
    };

    // ── STAGE 3: Design Critic ──────────────────────────────────────────────
    log.info('\n── STAGE 3: Design Critic ──────────────────────');
    const { approved, needsReview, rejected } = await runDesignCriticAgent(copywrittenProducts);
    report.stages.critic = {
      approved: approved.length,
      needsReview: needsReview.length,
      rejected: rejected.length,
    };

    // ── STAGE 4: Publish ────────────────────────────────────────────────────
    log.info('\n── STAGE 4: Publish ────────────────────────────');
    let publishResult = { published: 0, skipped: approved.length, dryRun: true };

    if (!dryRun && approved.length > 0) {
      publishResult = await publishToStore(approved);
    } else if (dryRun) {
      log.info(`[DRY RUN] Would publish ${approved.length} approved products`);
    } else {
      log.warn('No approved products to publish');
    }

    report.stages.publish = publishResult;

    // ── STAGE 5: Save Output ────────────────────────────────────────────────
    const outputFile = `output/session-${report.sessionId}.json`;
    await writeFile(outputFile, JSON.stringify({
      report,
      approved,
      needsReview,
      rejected,
      publishResult,
    }, null, 2));
    log.info(`\n💾 Full output saved: ${outputFile}`);

    // ── Final Report ────────────────────────────────────────────────────────
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    report.finishedAt = new Date().toISOString();
    report.elapsedSeconds = elapsed;
    report.finalStatus = 'success';

    const summary = `
👑 CEO AGENT SESSION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Scouted:      ${scoutedProducts.length}
✍️  Copywritten: ${copywrittenProducts.filter(p => p.status === 'copywritten').length}
✅ Approved:     ${approved.length}
⚠️  Review:      ${needsReview.length}
❌ Rejected:     ${rejected.length}
📡 Published:    ${publishResult.published}
⏱  Duration:     ${elapsed}s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    log.info(summary);

    // Send Telegram notification
    await sendTelegramAlert(
      `<b>🛍 أسهل — Agent Run Complete</b>\n\n` +
      `✅ Approved: <b>${approved.length}</b> products\n` +
      `📡 Published: <b>${publishResult.published}</b> (pending admin review)\n` +
      `⏱ Duration: ${elapsed}s\n\n` +
      `<i>${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</i>`
    );

    return { report, approved, needsReview, rejected, publishResult };

  } catch (err) {
    log.error(`CEO Agent fatal error: ${err.message}\n${err.stack}`);
    report.finalStatus = 'fatal_error';
    report.error = err.message;

    await sendTelegramAlert(`<b>⚠️ أسهل — Agent ERROR</b>\n\n${err.message}`);

    return report;
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1].endsWith('chief-executive-agent.js')) {
  const dryRun = process.argv.includes('--dry-run');
  const maxProducts = parseInt(process.argv.find(a => a.startsWith('--max='))?.split('=')[1] || '10');

  log.info(`Starting CEO Agent | maxProducts=${maxProducts} | dryRun=${dryRun}`);

  runCEOAgent({ maxProducts, dryRun })
    .then(result => {
      console.log('\n=== CEO SESSION OUTPUT ===');
      console.log(JSON.stringify(result?.report || result, null, 2));
      process.exit(0);
    })
    .catch(err => {
      log.error(`Fatal: ${err.message}`);
      process.exit(1);
    });
}
