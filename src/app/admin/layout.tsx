import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Floating theme toggle for all admin pages */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
      }}>
        <ThemeToggle />
      </div>
    </>
  );
}
