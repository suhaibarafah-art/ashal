'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const SETTINGS_KEYS = [
  { key: 'store_name_ar', label: 'اسم المتجر (عربي)', default: 'أسهل' },
  { key: 'store_name_en', label: 'اسم المتجر (إنجليزي)', default: 'Ashal' },
  { key: 'contact_email', label: 'البريد الإلكتروني للتواصل', default: 'hello@ashal.store' },
  { key: 'whatsapp_number', label: 'رقم واتساب', default: '+966500000000' },
  { key: 'shipping_threshold', label: 'حد الشحن المجاني (ر.س)', default: '200' },
  { key: 'instagram_url', label: 'رابط إنستغرام', default: '' },
  { key: 'twitter_url', label: 'رابط تويتر/إكس', default: '' },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const defaults: Record<string, string> = {};
    SETTINGS_KEYS.forEach(s => { defaults[s.key] = s.default; });
    setValues(defaults);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // In production, POST to /api/admin/settings
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">الإعدادات</h1>
        <p className="text-sm text-ink-4 mt-1">إعدادات المتجر الأساسية</p>
      </div>

      <div className="card p-5 space-y-4 max-w-xl">
        {SETTINGS_KEYS.map(s => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-ink mb-1">{s.label}</label>
            <input
              className="input"
              value={values[s.key] ?? s.default}
              onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
            />
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} />
          {saved ? 'تم الحفظ ✓' : saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}
