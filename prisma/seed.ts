import { PrismaClient } from '@prisma/client'
import { calculateLuxuryPrice } from '../src/lib/pricing'
import { fetchSupplierProducts } from '../src/lib/suppliers'

const prisma = new PrismaClient()

async function main() {
  console.log("🌟 God-Mode Autonomous Seed Initiated...")

  // 1. Identify Trends (Oracle)
  const trends = ["ديكور فخم", "عطريات ذكية", "إضاءة ملكية"];

  for (const trend of trends) {
    const trendRecord = await prisma.predictiveOracle.upsert({
      where: { keyword: trend },
      update: {},
      create: {
        keyword: trend,
        source: 'AI Integration',
        saudiRelevance: 0.9 + Math.random() * 0.1,
        status: 'APPROVED'
      },
    })

    // 2. Fetch Supplier Products for this Trend
    const supplierProducts = await fetchSupplierProducts(trend);

    // 3. Apply Wealth Engine and Save
    for (const sp of supplierProducts) {
      const finalPrice = calculateLuxuryPrice(sp.cost, sp.shipping);
      
      await prisma.product.upsert({
        where: { titleEn: sp.id },
        update: {
          finalPrice: finalPrice,
          descAr: sp.description
        },
        create: {
          titleEn: sp.id,
          titleAr: sp.name,
          descAr: sp.description,
          baseCost: sp.cost,
          shippingCost: sp.shipping,
          finalPrice: finalPrice,
          oracleId: trendRecord.id
        }
      });
      console.log(`✅ Seeded: ${sp.name} | Price: SAR ${finalPrice}`);
    }
  }

  console.log("🚀 God-Mode Autonomous Seed Complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
