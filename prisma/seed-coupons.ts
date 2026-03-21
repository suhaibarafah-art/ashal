/**
 * Phase 4 + 5: Seed coupons — SAVE10, ROYAL20, VIP15
 * Run: npx ts-node prisma/seed-coupons.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coupons = [
    { code: 'SAVE10',  discountPct: 0.10, maxUsage: 10000 },
    { code: 'ROYAL20', discountPct: 0.20, maxUsage: 1000  },
    { code: 'VIP15',   discountPct: 0.15, maxUsage: 500   },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: { discountPct: c.discountPct, isActive: true, maxUsage: c.maxUsage },
      create: { code: c.code, discountPct: c.discountPct, isActive: true, maxUsage: c.maxUsage },
    });
    console.log(`✅ Coupon upserted: ${c.code} (${c.discountPct * 100}% off)`);
  }

  console.log('🎟️  All coupons ready.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
