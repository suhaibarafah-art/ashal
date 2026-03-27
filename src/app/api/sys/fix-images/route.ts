import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Full image fix map — all products that need correct Unsplash images
const IMAGE_MAP: Record<string, string> = {
  // ── Previously wrong images (headphones/skincare/picsum) ─────────────────
  'Diamond Necklace':        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85',
  'Luxury High Heel':        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85',
  'Classic Leather Bag':     'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
  // ── Products fixed from random picsum → matching Unsplash ────────────────
  'Saudi Vision Luxury Pen': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=85',
  'Nomad Copper Serving Tray': 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=800&q=85',
  'Elite Camel Leather Wallet': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',
  'Smart Prayer Wall Clock': 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=800&q=85',
};

export async function POST() {
  const products = await prisma.product.findMany({ select: { id: true, titleEn: true } });
  let updated = 0;

  for (const p of products) {
    const newImg = IMAGE_MAP[p.titleEn ?? ''];
    if (newImg) {
      await prisma.product.update({ where: { id: p.id }, data: { imageUrl: newImg } });
      updated++;
    }
    // Skip products not in IMAGE_MAP — don't overwrite valid existing images
  }

  return NextResponse.json({ success: true, updated, total: products.length });
}
