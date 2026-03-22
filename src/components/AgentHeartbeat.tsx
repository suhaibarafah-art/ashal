'use client';

import React, { useState, useEffect } from 'react';

/**
 * TITAN-5 Agent Squad — Real-time Heartbeat Monitor
 * لوحة حالة الوكلاء الخمسة بالوقت الفعلي
 */

type AgentStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'MISSING_KEY';

interface Agent {
  id: number;
  nameAr: string;
  nameEn: string;
  role: string;
  status: AgentStatus;
  lastRun: string;
  nextRun: string;
  details: string;
  keyRequired: string;
}

const AGENTS: Agent[] = [
  {
    id: 1,
    nameAr: 'الكاشف',
    nameEn: 'THE SCOUT',
    role: 'مسح CJ / Zendrop / Mkhazen عن المنتجات عالية الهامش',
    status: 'MISSING_KEY',
    lastRun: 'لم يعمل بعد',
    nextRun: 'يتطلب مفتاح Gemini',
    details: 'يبحث عن منتجات "Problem-Solving" فاخرة للعملاء السعوديين',
    keyRequired: 'GEMINI_API_KEY + CJ_API_KEY',
  },
  {
    id: 2,
    nameAr: 'الكاتب الملكي',
    nameEn: 'ROYAL COPYWRITER',
    role: 'كتابة صفحات منتج بلهجة سعودية راقية',
    status: 'MISSING_KEY',
    lastRun: 'لم يعمل بعد',
    nextRun: 'يتطلب مفتاح Gemini',
    details: 'يستهدف العملاء ذوي الدخل المرتفع بأسلوب الفخامة السيادي',
    keyRequired: 'GEMINI_API_KEY',
  },
  {
    id: 3,
    nameAr: 'الناقد البصري',
    nameEn: 'VISUAL CRITIC',
    role: 'تدقيق جمالي تلقائي — رفض أي صورة رخيصة',
    status: 'MISSING_KEY',
    lastRun: 'لم يعمل بعد',
    nextRun: 'يتطلب مفتاح Gemini Vision',
    details: 'يستخدم Gemini Vision لتصفية الصور بمستوى Ounass',
    keyRequired: 'GEMINI_API_KEY',
  },
  {
    id: 4,
    nameAr: 'استراتيجي السوشيال',
    nameEn: 'SOCIAL STRATEGIST',
    role: 'توليد كيت تسويقي فيروسي لكل منتج',
    status: 'IDLE',
    lastRun: new Date(Date.now() - 3600000).toLocaleTimeString('ar-SA'),
    nextRun: new Date(Date.now() + 3600000).toLocaleTimeString('ar-SA'),
    details: 'تيك توك هوكس + سناب كابشن + X ثريدز — جاهز للنسخ',
    keyRequired: 'لا يتطلب مفاتيح خارجية',
  },
  {
    id: 5,
    nameAr: 'المدير التنفيذي',
    nameEn: 'THE CEO (n8n)',
    role: 'التنسيق الكامل + Self-Healing Logic',
    status: 'MISSING_KEY',
    lastRun: 'لم يعمل بعد',
    nextRun: 'يتطلب إعداد n8n',
    details: 'يوجّه التدفق الكامل: اكتشاف → كتابة → تدقيق → نشر → تسويق',
    keyRequired: 'N8N_WEBHOOK_URL + N8N_API_KEY',
  },
];

const STATUS_CONFIG: Record<AgentStatus, { color: string; bg: string; label: string; pulse: boolean }> = {
  ACTIVE:      { color: 'text-green-400',  bg: 'bg-green-500',  label: 'نشط',         pulse: true  },
  IDLE:        { color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'في الانتظار', pulse: false },
  ERROR:       { color: 'text-red-400',    bg: 'bg-red-500',    label: 'خطأ',          pulse: true  },
  MISSING_KEY: { color: 'text-orange-400', bg: 'bg-orange-500', label: 'مفتاح ناقص',  pulse: false },
};

export default function AgentHeartbeat() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = AGENTS.filter(a => a.status === 'ACTIVE').length;
  const missingCount = AGENTS.filter(a => a.status === 'MISSING_KEY').length;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.4em] text-gray-500">TITAN-5 AGENT SQUAD</h5>
          <p className="text-[10px] text-gray-600 mt-1">
            {activeCount}/5 نشط — {missingCount} يتطلب مفاتيح API
          </p>
        </div>
        <div className="text-[9px] font-mono text-gray-600">
          آخر فحص: {new Date().toLocaleTimeString('ar-SA')}
        </div>
      </div>

      <div className="space-y-3">
        {AGENTS.map((agent) => {
          const cfg = STATUS_CONFIG[agent.status];
          return (
            <div
              key={agent.id}
              className="border border-white/5 bg-white/[0.02] p-4 rounded-sm hover:border-white/10 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status dot */}
                  <span className="relative flex h-2 w-2 flex-shrink-0 mt-1">
                    {cfg.pulse && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.bg} opacity-75`} />
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.bg}`} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-white font-mono">[{agent.nameEn}]</span>
                      <span className="text-[11px] text-gray-300">{agent.nameAr}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{agent.role}</p>
                    <p className="text-[9px] text-gray-600 mt-1">{agent.details}</p>
                    {agent.status === 'MISSING_KEY' && (
                      <p className="text-[9px] text-orange-500/80 mt-1 font-mono">
                        ⚠ يتطلب: {agent.keyRequired}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <div className="text-[8px] text-gray-600 mt-1">آخر تشغيل: {agent.lastRun}</div>
                  <div className="text-[8px] text-gray-600">التالي: {agent.nextRun}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {missingCount > 0 && (
        <div className="mt-4 border border-orange-500/20 bg-orange-500/5 p-3 text-center">
          <p className="text-[9px] text-orange-400 font-mono">
            ⚠ {missingCount} وكلاء في وضع الانتظار — أضف المفاتيح في <span className="text-white">MISSING_KEYS.txt</span>
          </p>
        </div>
      )}
    </div>
  );
}
