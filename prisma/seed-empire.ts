import { EmpireSeeder } from '../src/lib/empire-seeder';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🏛️ Seeding empire catalog...');
  const count = await EmpireSeeder.seedEmpireCatalog();
  console.log(`✅ Seeded ${count} products`);

  const coupons = [
    { code: 'SAVE10',  discountPct: 0.10, maxUsage: 10000 },
    { code: 'ROYAL20', discountPct: 0.20, maxUsage: 1000  },
    { code: 'VIP15',   discountPct: 0.15, maxUsage: 500   },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: {}, create: c });
    console.log(`🎟️  Coupon ready: ${c.code}`);
  }
  console.log('🚀 Done!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
