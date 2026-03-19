'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: { url: string; altAr: string | null; altEn: string | null }[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-brand-100 rounded-xl flex items-center justify-center">
        <p className="text-ink-4 text-sm">{title}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-50">
        <Image
          src={images[activeIdx].url}
          alt={images[activeIdx].altEn ?? title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                i === activeIdx ? 'border-brand-500' : 'border-transparent hover:border-brand-200'
              )}
            >
              <Image
                src={img.url}
                alt={img.altEn ?? `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
