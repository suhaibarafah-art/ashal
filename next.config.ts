import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Never fail Vercel builds on TypeScript errors
  typescript: { ignoreBuildErrors: true },

  // Phase 7: Image optimization — allow all external image sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.cjdropshipping.com' },
      { protocol: 'https', hostname: 'mkhazen.com' },
      { protocol: 'https', hostname: '**.mkhazen.com' },
      { protocol: 'https', hostname: 'cjdropshipping.com' },
      { protocol: 'https', hostname: '**.cjdropshipping.com' },
      { protocol: 'https', hostname: 'cdn.moyasar.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24h
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance: compress responses
  compress: true,

  // Experimental: optimize package imports for Framer Motion
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Phase 7: Extended for Moyasar CDN, Google Fonts, and Apple Pay
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.moyasar.com https://cdn.jsdelivr.net https://applePay.cdn.apple.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.moyasar.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https://cdn.moyasar.com",
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
