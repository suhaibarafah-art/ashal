'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, Upload, Settings, LogOut, Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'العملاء', icon: Users },
  { href: '/admin/suppliers', label: 'الموردون', icon: Truck },
  { href: '/admin/imports', label: 'الاستيراد', icon: Upload },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-ink text-white flex flex-col" dir="rtl">
      <div className="p-5 border-b border-ink-2">
        <Link href="/admin" className="flex items-center gap-2">
          <Store size={20} className="text-brand-400" />
          <span className="font-bold text-lg">أسهل <span className="text-brand-400 text-sm font-normal">Admin</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href || (href !== '/admin' && pathname.startsWith(href))
                ? 'bg-brand-500 text-white'
                : 'text-ink-5 hover:text-white hover:bg-ink-2'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-ink-2">
        <Link href="/ar" className="flex items-center gap-3 px-3 py-2 text-sm text-ink-5 hover:text-white">
          <Store size={16} />
          عرض المتجر
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/ar/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink-5 hover:text-red-400 mt-1"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
