/**
 * Saudi Luxury Store - Collections Page
 * صفحة المجموعات المختارة
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Collections() {
  const categories = ["ديكور فخم", "عطريات ذكية", "إضاءة ملكية"];

  return (
    <main style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '10rem 0' }}>
        <h1 style={{ fontFamily: 'var(--font-family-serif)', fontSize: '4rem', marginBottom: '4rem', textAlign: 'center' }}>
           المجموعات <span style={{ color: 'var(--accent-gold)' }}>السيادية</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
          {categories.map((cat) => (
            <div key={cat} className="product-card" style={{ padding: '4rem 2rem', border: '1px solid var(--border-color)', textAlign: 'center', backgroundColor: '#000' }}>
              <h2 style={{ fontFamily: 'var(--font-family-serif)', fontSize: '2rem', marginBottom: '1rem' }}>{cat}</h2>
              <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--accent-gold)', margin: '0 auto 2rem' }}></div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                 تشكيلة منسقة بعناية لتعكس فخامة 2026 في منازل النخبة.
              </p>
              <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>تصفح الآن</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
