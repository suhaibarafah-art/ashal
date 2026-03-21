export default function ProductLoading() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="container py-12">
      <div className="skeleton" style={{ height: 16, width: 200, borderRadius: 6, marginBottom: 32 }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 16 }} />
        <div className="flex flex-col gap-5">
          <div className="skeleton" style={{ height: 20, width: 120, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 52, width: '80%', borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 32, width: 140, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 100, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 56, borderRadius: 30 }} />
        </div>
      </div>
    </div>
  );
}
