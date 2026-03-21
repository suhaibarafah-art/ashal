export default function CollectionsLoading() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="container py-12">
      <div className="skeleton" style={{ height: 40, width: 260, borderRadius: 8, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 18, width: 180, borderRadius: 6, marginBottom: 40 }} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
        ))}
      </div>
    </div>
  );
}
