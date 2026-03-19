'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(isAr ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password');
    } else {
      router.push(`/${locale}/account/orders`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-3xl font-bold text-brand-500">أسهل</Link>
          <p className="text-ink-3 mt-2">{isAr ? 'تسجيل الدخول' : 'Sign In'}</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? '...' : isAr ? 'دخول' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-ink-4">
            {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/register`} className="text-brand-500 hover:underline font-medium">
              {isAr ? 'إنشاء حساب' : 'Register'}
            </Link>
          </div>

          <div className="mt-4 p-3 bg-brand-50 rounded-lg text-xs text-ink-4 text-center">
            {isAr ? 'للتجربة: admin@ashal.test / Admin123!' : 'Demo: admin@ashal.test / Admin123!'}
          </div>
        </div>
      </div>
    </div>
  );
}
