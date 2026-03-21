import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        background: 'var(--bg-primary)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '40px 24px' }}>
        {/* Logo */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#002366',
            fontFamily: 'var(--font-montserrat)',
            marginBottom: 8,
          }}
        >
          SAUDI<span style={{ color: '#FF8C00' }}>LUX</span>
        </div>

        {/* 404 */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: 'var(--bg-secondary)',
            lineHeight: 1,
            fontFamily: 'var(--font-montserrat)',
            letterSpacing: '-4px',
            marginBottom: -8,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-cairo)',
            margin: '24px 0 12px',
          }}
        >
          الصفحة غير موجودة
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-cairo)',
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          يبدو أن هذه الصفحة لا وجود لها أو تم نقلها.
          <br />استكشف مجموعتنا الفاخرة من المنتجات.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/">
            <button className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
              العودة للرئيسية
            </button>
          </Link>
          <Link href="/collections">
            <button className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px' }}>
              المجموعات
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
