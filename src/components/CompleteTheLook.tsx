/**
 * CompleteTheLook — Agent Scout Upsell Section
 * Summer Wedding Season 2026
 *
 * Agent Scout commanded to source 3 upsell categories from CJ Dropshipping:
 *  1. Gold Evening Clutches (حقيبة سهرة ذهبية)
 *  2. Crystal Stiletto Heels (كعب ستيليتو كريستالي)
 *  3. Minimalist Gold Jewelry (مجوهرات ذهبية مينيمالية)
 *
 * This server component renders the upsell cards. CJ products are injected
 * via the static SCOUT_FINDS array (populated by /api/scout/upsell endpoint
 * which scans live CJ catalogue and seeds results to the DB).
 */

import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// ─── Static Scout Finds (CJ Dropshipping — Summer 2026) ───────────────────────
// These represent the 3 categories Agent Scout was commanded to source.
// When /api/scout/upsell runs, it seeds real CJ products into the DB
// and they surface here automatically via the DB query below.
const SCOUT_CATEGORIES = [
  {
    category:  'clutch',
    icon:      '👛',
    titleAr:   'حقيبة السهرة الذهبية',
    titleEn:   'Gold Evening Clutch',
    tagline:   'لمسة ملكية تكمل إطلالتك',
    fallbackPrice: 189,
    fallbackImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    category:  'heels',
    icon:      '👠',
    titleAr:   'كعب ستيليتو كريستالي',
    titleEn:   'Crystal Stiletto Heels',
    tagline:   'خطوة واحدة تغيّر كل شيء',
    fallbackPrice: 349,
    fallbackImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
  },
  {
    category:  'jewelry',
    icon:      '✨',
    titleAr:   'مجوهرات ذهبية مينيمالية',
    titleEn:   'Minimalist Gold Jewelry',
    tagline:   'البساطة هي أعلى مراتب الأناقة',
    fallbackPrice: 229,
    fallbackImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
  },
];

interface Props {
  excludeProductId: string;
}

export default async function CompleteTheLook({ excludeProductId }: Props) {
  // Try to pull Scout-sourced products from DB first
  const dbUpsells = await prisma.product.findMany({
    where: {
      NOT: { id: excludeProductId },
      OR: [
        { category: { contains: 'clutch' } },
        { category: { contains: 'heels' } },
        { category: { contains: 'jewelry' } },
        { titleEn: { contains: 'clutch' } },
        { titleEn: { contains: 'heel' } },
        { titleEn: { contains: 'jewelry' } },
      ],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Build display items: prefer real DB products, fall back to Scout placeholder cards
  const displayItems = SCOUT_CATEGORIES.map((cat, i) => {
    const dbMatch = dbUpsells[i];
    if (dbMatch) {
      return {
        id:       dbMatch.id,
        icon:     cat.icon,
        titleAr:  dbMatch.titleAr,
        tagline:  cat.tagline,
        price:    dbMatch.finalPrice,
        image:    (dbMatch as unknown as Record<string, unknown>).imageUrl as string || cat.fallbackImage,
        isLive:   true,
      };
    }
    return {
      id:       null,
      icon:     cat.icon,
      titleAr:  cat.titleAr,
      tagline:  cat.tagline,
      price:    cat.fallbackPrice,
      image:    cat.fallbackImage,
      isLive:   false,
    };
  });

  return (
    <section className="mt-16 pt-12" style={{ borderTop: '1px solid var(--border-color)' }}>
      {/* Heading */}
      <div className="mb-8">
        <span
          className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #C9A84C22, #F5E6CC44)',
            color: '#8B6914',
            border: '1px solid #C9A84C55',
            fontFamily: 'var(--font-montserrat)',
          }}
        >
          Agent Scout — Complete the Look
        </span>
        <h2
          className="text-[26px] font-black mt-3"
          style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}
        >
          أكملي إطلالتك ✨
        </h2>
        <p className="text-[14px] mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
          اختارها Agent Scout خصيصاً لتناسب عباءة بتلة القرمزي
        </p>
      </div>

      {/* Upsell Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {displayItems.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden group"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-card)',
              transition: 'var(--transition-smooth)',
            }}
          >
            {/* Image */}
            <div
              className="w-full overflow-hidden"
              style={{ aspectRatio: '4/3', background: 'var(--bg-tertiary)', position: 'relative' }}
            >
              <img
                src={item.image}
                alt={item.titleAr}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.7s ease' }}
                loading="lazy"
              />
              {/* Gold overlay badge */}
              <div
                className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                  color: '#2A1F00',
                  fontFamily: 'var(--font-montserrat)',
                }}
              >
                {item.icon} Scout Pick
              </div>
              {!item.isLive && (
                <div
                  className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-montserrat)' }}
                >
                  قريباً
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h4
                className="text-[15px] font-bold mb-1"
                style={{ fontFamily: 'var(--font-cairo)', color: 'var(--text-primary)' }}
              >
                {item.titleAr}
              </h4>
              <p className="text-[12px] mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
                {item.tagline}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-[18px] font-black"
                  style={{ color: '#C9A84C', fontFamily: 'var(--font-cairo)' }}
                >
                  SAR {item.price.toLocaleString('en-US')}
                </span>
                {item.id ? (
                  <Link href={`/products/${item.id}`}>
                    <button
                      className="text-[12px] font-bold px-4 py-2 rounded-md"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #F5D06E)',
                        color: '#2A1F00',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-cairo)',
                      }}
                    >
                      <span className="flex items-center gap-1">أضيفي <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                    </button>
                  </Link>
                ) : (
                  <span
                    className="text-[11px] font-bold px-3 py-1.5 rounded-md"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-cairo)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    قريباً
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
