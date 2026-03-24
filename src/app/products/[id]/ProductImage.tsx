'use client';

interface ProductImageProps {
  src: string;
  alt: string;
  soldCount: number;
}

export function ProductImage({ src, alt, soldCount }: ProductImageProps) {
  // Deterministic picsum seed from alt text length + sold count
  const fallbackSeed = (alt.length * 7 + soldCount) % 1000;

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ aspectRatio: '1/1', background: 'var(--bg-tertiary)', boxShadow: 'var(--shadow-card)', position: 'relative' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          img.src = `https://picsum.photos/seed/${fallbackSeed}/800/800`;
        }}
      />
      {/* Sold badge */}
      <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '4px 12px' }}>
        <span style={{ color: 'white', fontFamily: 'var(--font-cairo)', fontSize: '12px', fontWeight: 700 }}>
          🔥 {soldCount}+ مبيعة
        </span>
      </div>
    </div>
  );
}
