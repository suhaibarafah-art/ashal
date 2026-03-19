'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isAr = locale === 'ar';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError(isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    });

    if (!res.ok) {
      const d = await res.json();
      const msg = typeof d.error === 'string' ? d.error : 'Error';
      setError(isAr && msg.includes('ar:') ? msg.split('ar:')[1].split('|')[0] : msg.split('en:')[1] || msg);
      setLoading(false);
      return;
    }

    // Auto-login after registration
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push(`/${locale}/account/orders`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-3xl font-bold text-brand-500">أسهل</Link>
          <p className="text-ink-3 mt-2">{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: isAr ? 'الاسم الكامل' : 'Full Name', type: 'text', dir: 'auto' },
              { key: 'email', label: isAr ? 'البريد الإلكتروني' : 'Email', type: 'email', dir: 'ltr' },
              { key: 'phone', label: isAr ? 'رقم الجوال' : 'Phone', type: 'tel', dir: 'ltr' },
              { key: 'password', label: isAr ? 'كلمة المرور' : 'Password', type: 'password', dir: 'ltr' },
              { key: 'confirmPassword', label: isAr ? 'تأكيد كلمة المرور' : 'Confirm Password', type: 'password', dir: 'ltr' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-ink mb-1">{f.label}</label>
                <input
                  className="input"
                  type={f.type}
                  dir={f.dir}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => set(f.key, e.target.value)}
                  required={f.key !== 'phone'}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? '...' : isAr ? 'إنشاء الحساب' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-ink-4">
            {isAr ? 'لديك حساب؟' : 'Already have an account?'}{' '}
            <Link href={`/${locale}/login`} className="text-brand-500 hover:underline font-medium">
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
