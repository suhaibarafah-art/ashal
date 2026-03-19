'use client';
import { useState, use } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const isAr = locale === 'ar';
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-12 md:py-16" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold text-ink mb-2">{isAr ? 'اتصل بنا' : 'Contact Us'}</h1>
        <p className="text-ink-3 mb-8">{isAr ? 'نحن هنا للمساعدة — تواصل معنا بأي طريقة' : "We're here to help — reach us any way"}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: Mail, label: isAr ? 'البريد الإلكتروني' : 'Email', value: 'hello@ashal.store', href: 'mailto:hello@ashal.store' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+966 50 000 0000', href: 'https://wa.me/966500000000' },
              { icon: Phone, label: isAr ? 'الدعم' : 'Support', value: isAr ? 'الأحد–الخميس 9ص–5م' : 'Sun–Thu 9am–5pm', href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-brand-500" />
                </div>
                <div>
                  <div className="text-sm text-ink-4">{label}</div>
                  {href ? (
                    <a href={href} className="font-medium text-ink hover:text-brand-500">{value}</a>
                  ) : (
                    <div className="font-medium text-ink">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✓</div>
                <p className="font-medium text-ink">{isAr ? 'تم إرسال رسالتك!' : 'Message sent!'}</p>
                <p className="text-sm text-ink-4 mt-1">{isAr ? 'سنرد عليك خلال 24 ساعة' : "We'll reply within 24 hours"}</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }} className="btn-secondary mt-4 text-sm">
                  {isAr ? 'إرسال رسالة أخرى' : 'Send another'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-semibold text-ink">{isAr ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{isAr ? 'الاسم' : 'Name'}</label>
                  <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input className="input" type="email" required dir="ltr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">{isAr ? 'الرسالة' : 'Message'}</label>
                  <textarea className="input h-28 resize-none" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                <button type="submit" className="btn-primary w-full">{isAr ? 'إرسال' : 'Send'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
