export default function Loading() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <div className="skeleton" style={{ height: '520px', borderRadius: 0 }} />

      <div className="container py-16">
        {/* Section title skeleton */}
        <div className="skeleton" style={{ height: 36, width: 220, borderRadius: 8, marginBottom: 32 }} />

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 340, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
