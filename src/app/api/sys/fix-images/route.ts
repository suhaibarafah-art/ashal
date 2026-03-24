import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// One-time: update all product images from Unsplash (503) to picsum.photos
const IMAGE_MAP: Record<string, string> = {
  'Elite Oud Diffuser':              'https://picsum.photos/seed/oud-diffuser/600/600',
  'Smart Prayer Wall Clock':          'https://picsum.photos/seed/prayer-clock/600/600',
  'Gold-Leaf Coffee Set':             'https://picsum.photos/seed/gold-coffee/600/600',
  'Minimalist Desert Abaya':          'https://picsum.photos/seed/desert-abaya/600/600',
  'Sovereign Marble Coasters':        'https://picsum.photos/seed/marble-coasters/600/600',
  'Antique Calligraphy Lamp':         'https://picsum.photos/seed/calligraphy-lamp/600/600',
  'Royal Sand Hourglass':             'https://picsum.photos/seed/sand-hourglass/600/600',
  'Velvet Bedouin Throw':             'https://picsum.photos/seed/velvet-throw/600/600',
  'Pure Saffron Mist':                'https://picsum.photos/seed/saffron-mist/600/600',
  'Onyx Incense Burner':              'https://picsum.photos/seed/onyx-incense/600/600',
  'Saudi Vision Luxury Pen':          'https://picsum.photos/seed/luxury-pen/600/600',
  'Silk Prayer Rug Elite':            'https://picsum.photos/seed/prayer-rug/600/600',
  'Electronic Bakhour Wand':          'https://picsum.photos/seed/bakhour-wand/600/600',
  'Handcrafted Riyadh Leather Trunk': 'https://picsum.photos/seed/leather-trunk/600/600',
  'Modern Arabic Wall Art Canvas':    'https://picsum.photos/seed/arabic-art/600/600',
  'Elite Camel Leather Wallet':       'https://picsum.photos/seed/camel-wallet/600/600',
  'Smart Thobe Steamer':              'https://picsum.photos/seed/thobe-steamer/600/600',
  'Desert Night Candle Set':          'https://picsum.photos/seed/desert-candle/600/600',
  'Platinum Tea Warmer Ceramic':      'https://picsum.photos/seed/tea-warmer/600/600',
  'Nomad Copper Serving Tray':        'https://picsum.photos/seed/copper-tray/600/600',
};

export async function POST() {
  const products = await prisma.product.findMany({ select: { id: true, titleEn: true } });
  let updated = 0;

  for (const p of products) {
    const newImg = IMAGE_MAP[p.titleEn];
    if (newImg) {
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: newImg } });
      updated++;
    } else {
      // Fallback: deterministic picsum by id
      const seed = p.id.slice(0, 8);
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: `https://picsum.photos/seed/${seed}/600/600` } });
      updated++;
    }
  }

  return NextResponse.json({ success: true, updated, total: products.length });
}
