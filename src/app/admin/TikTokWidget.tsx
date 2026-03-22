/**
 * TikTok Content Calendar Widget
 * Shows today's video idea + 3 ready-to-copy captions from the 7-day plan
 */

const CONTENT_CALENDAR = [
  {
    day: 'الأحد',
    type: 'Unboxing',
    concept: 'تصوير فتح "بوكس" فخم جداً، يظهر فيه الفستان الأحمر وتفاصيل القماش.',
    goal: 'إثارة الفضول',
    goalColor: '#F59E0B',
    icon: '📦',
    tips: ['ابدأ بصوت فتح الكرتون — أول 3 ثوانٍ هي كل شيء', 'أظهر اللون الأحمر تحت الضوء الطبيعي', 'لا تنسَ إظهار الباكيج الفاخر قبل الفستان'],
    captions: [
      'أول مرة أشوف فستان يجي بهالباكج الفخم 😍 Crimson Petal وصل! #فساتين_مناسبات #أسهل',
      'اللون، القماش، التفصيل... كل شي بيقول «فخامة» 🔴 #فستان_احمر #زواجات_الرياض',
      'فتحت الباكج ومستحق! Crimson Petal من أسهل — التوصيل بـ 48 ساعة 🚀 #تجهيزات_الصيف',
    ],
  },
  {
    day: 'الاثنين',
    type: 'The Look',
    concept: 'تنسيق الفستان مع حذاء ذهبي وشنطة — رفع قيمة السلة.',
    goal: 'رفع قيمة السلة',
    goalColor: '#3B82F6',
    icon: '👗',
    tips: ['ابدأ بـ close-up على الحذاء الذهبي ثم ارتفع للفستان', 'أظهري ٣ قطع كـ "اللوك الكامل"', 'استخدمي موسيقى ترند هادئة'],
    captions: [
      'الحذاء الذهبي + الشنطة المطابقة = LOOK 🔥 كيف تنسقين Crimson Petal؟ #أسهل_للفخامة',
      'لما الفستان يتكلم بنفسه وما تحتاجين أكسسوارات كثير 👑 #ستايل_خليجي #فساتين_مناسبات',
      'ثلاث قطع = لوك كامل للزواج 💫 الفستان + الحذاء + الشنطة كلها من أسهل #fashion',
    ],
  },
  {
    day: 'الثلاثاء',
    type: 'Detail Shot',
    concept: 'زووم قريييب على خامة الـ Silk Crepe تحت إضاءة الشمس لإثبات الجودة.',
    goal: 'إثبات الجودة',
    goalColor: '#8B5CF6',
    icon: '🔍',
    tips: ['التصوير في الضوء الطبيعي يظهر القماش أجمل', 'حركي يدك على القماش عشان تظهر الملمس', 'زووم تدريجي = تشويق'],
    captions: [
      'Silk Crepe تحت الشمس... شوفي كيف تلمع هالخامة ✨ #جودة_فاخرة #أسهل',
      'لما الخيوط تحكي قصة فخامة 🪡 Crimson Petal — الخامة مش كلام #فساتين_فاخرة',
      'زووم على التفصيل الحقيقي 🔍 هذا مو مجرد فستان، هذا استثمار في إطلالتك #luxury',
    ],
  },
  {
    day: 'الأربعاء',
    type: 'Problem / Solution',
    concept: '"توهقتي بزواج قريب؟ Crimson Petal يوصلك بـ 48 ساعة" — استغلال عامل الاستعجال.',
    goal: 'الاستعجال',
    goalColor: '#EF4444',
    icon: '⚡',
    tips: ['ابدأ بالمشكلة (وجه قلقان) ثم انتقل للحل (الفستان)', 'أظهري شاشة التتبع اللي تقول "قيد التوصيل"', 'Call-to-action واضح في آخر ثانية'],
    captions: [
      'توهقتي بزواج قريب ومافي وقت؟ 😰 Crimson Petal يوصلك بـ 48 ساعة! #حل_سريع #أسهل',
      'آخر لحظة؟ لا مشكلة! أسهل توصل لكل مدن السعودية خلال يومين 🚀 #توصيل_سريع',
      'الحل للبنت اللي ما قررت إيش تلبس للزواج 😅 اطلبي الآن وجهزي نفسك! #زواجات_الرياض',
    ],
  },
  {
    day: 'الخميس',
    type: 'The Vibe',
    concept: 'فيديو قصير لمودل تمشي بالفستان مع موسيقى ترند هادئة وفخمة.',
    goal: 'براندينج',
    goalColor: '#10B981',
    icon: '✨',
    tips: ['استخدمي كاميرا سلو موشن إذا ممكن', 'الموسيقى تصنع 70% من المشاعر — اختاريها بعناية', 'لا كلام — اتركي الفستان يتكلم'],
    captions: [
      'لما تمشين وكل العيون عليك... 👁️ هذا هو Crimson Petal Vibe ✨ #أسهل_للفخامة',
      'الفخامة مش في الثمن، في الذوق 💎 Crimson Petal من أسهل #ستايل_راقي #فساتين',
      'Feeling yourself في Crimson Petal 🌹 رابط الطلب في البايو! #فساتين_مناسبات #luxury',
    ],
  },
  {
    day: 'الجمعة',
    type: 'Behind the Scenes',
    concept: '"الوكلاء الرقميين" وهم يجهزون الطلبيات — شاشة الـ Dashboard في الخلفية.',
    goal: 'بناء الثقة',
    goalColor: '#06B6D4',
    icon: '🤖',
    tips: ['اظهر الـ Dashboard وأرقام الطلبيات الحقيقية', 'شرح بسيط: "كل طلب يوصل خلال 48 ساعة تلقائياً"', 'الشفافية = ثقة = مبيعات'],
    captions: [
      'شوفوا كيف الطلبيات تتجهز تلقائياً! 🤖 الذكاء الاصطناعي في خدمتكم #تقنية_فاخرة #أسهل',
      'الوكلاء الرقميين ما ينامون عشان طلبيتك توصل بسرعة 💻 #أسهل_للتقنية #ksa',
      'Dashboard real-time + تتبع مباشر + توصيل سريع ⚡ أسهل يعمل 24/7 لأجلك #ثقة',
    ],
  },
  {
    day: 'السبت',
    type: 'FAQ / Call to Action',
    concept: 'رد على سؤال "كيف الخامة؟" مع استعراض مرونة القماش وكود الخصم.',
    goal: 'الإغلاق',
    goalColor: '#F59E0B',
    icon: '🎯',
    tips: ['اقرأي التعليق الفعلي (Reply with Video) لرفع التفاعل 10x', 'أظهري مرونة القماش بيديك', 'كود الخصم في آخر ثانية — اجعليه واضحاً'],
    captions: [
      'سؤال: كيف الخامة؟ 🤔 الجواب: شوفي هالمرونة! Silk Crepe الأصلي #جودة_مضمونة #أسهل',
      'يتمدد مع جسمك — مناسب لكل الأجسام 💕 استخدمي LUXURY10 للخصم #فساتين_فاخرة',
      'آخر فرصة هالأسبوع! كود LUXURY10 = 10% خصم على Crimson Petal 🎁 #عرض_محدود',
    ],
  },
];

const HASHTAG_BANK = [
  '#فساتين_مناسبات', '#زواجات_الرياض', '#أسهل_للفخامة', '#تجهيزات_الصيف',
  '#فستان_احمر', '#ستايل_خليجي', '#جودة_فاخرة', '#توصيل_سريع',
];

export function TikTokWidget() {
  // Get current day of week (0=Sun, 1=Mon, ..., 6=Sat)
  const dayIndex = new Date().getDay();
  const today = CONTENT_CALENDAR[dayIndex];
  const tomorrow = CONTENT_CALENDAR[(dayIndex + 1) % 7];

  return (
    <div style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-black flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
          <span>🎵</span> مهمة تيك توك اليوم
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: `${today.goalColor}22`, color: today.goalColor, border: `1px solid ${today.goalColor}44`, fontFamily: 'var(--font-montserrat)' }}>
            {today.goal}
          </span>
          <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>{today.day}</span>
        </div>
      </div>

      {/* Today's Task */}
      <div className="p-4 rounded-xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(232,118,26,0.08), rgba(0,35,102,0.3))', border: '1px solid rgba(232,118,26,0.3)' }}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{today.icon}</span>
          <div className="flex-1">
            <p className="text-[16px] font-black mb-1" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-cairo)' }}>
              {today.type}
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}>
              {today.concept}
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-3 space-y-1">
          {today.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-black" style={{ color: 'var(--color-orange)', marginTop: '2px' }}>▸</span>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Ready-to-Copy Captions */}
      <p className="text-[11px] font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
        3 كابشنز جاهزة للنسخ
      </p>
      <div className="space-y-2 mb-4">
        {today.captions.map((caption, i) => (
          <div key={i} className="p-3 rounded-lg relative group" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <span className="absolute top-2 left-2 text-[10px] font-black" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
              #{i + 1}
            </span>
            <p className="text-[12px] leading-relaxed pr-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>
              {caption}
            </p>
          </div>
        ))}
      </div>

      {/* Hashtag Bank */}
      <div className="flex flex-wrap gap-2 mb-4">
        {HASHTAG_BANK.map((tag, i) => (
          <span key={i} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.12)', color: '#90CAF9', fontFamily: 'var(--font-cairo)', border: '1px solid rgba(59,130,246,0.25)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '12px' }} />

      {/* Tomorrow preview + link to hub */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>
            غداً ({tomorrow.day}):
          </span>
          <span className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-cairo)' }}>
            {tomorrow.icon} {tomorrow.type}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${tomorrow.goalColor}18`, color: tomorrow.goalColor, fontFamily: 'var(--font-montserrat)' }}>
            {tomorrow.goal}
          </span>
        </div>
        <a href="/admin/marketing">
          <span className="text-[11px] font-bold px-3 py-1 rounded-lg" style={{ background: 'rgba(232,118,26,0.15)', color: '#FF8C00', border: '1px solid rgba(232,118,26,0.4)', cursor: 'pointer', fontFamily: 'var(--font-cairo)' }}>
            محور التسويق ←
          </span>
        </a>
      </div>
    </div>
  );
}

export function WeeklyCalendarWidget() {
  const todayIndex = new Date().getDay();

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 className="text-[18px] font-black mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}>
        <span>📅</span> جدول الأسبوع — تيك توك
      </h2>
      <div className="space-y-2">
        {CONTENT_CALENDAR.map((item, i) => {
          const isToday = i === todayIndex;
          const isPast = i < todayIndex;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                background: isToday ? 'rgba(232,118,26,0.12)' : 'var(--bg-tertiary)',
                border: isToday ? '1px solid rgba(232,118,26,0.5)' : '1px solid var(--border-color)',
                opacity: isPast ? 0.5 : 1,
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black" style={{ color: isToday ? 'var(--color-orange)' : 'var(--text-primary)', fontFamily: 'var(--font-cairo)' }}>
                    {item.day}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-montserrat)' }}>
                    {item.type}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,118,26,0.3)', color: '#FF8C00', fontFamily: 'var(--font-montserrat)' }}>
                      TODAY
                    </span>
                  )}
                  {isPast && (
                    <span className="text-[9px]" style={{ color: '#16A34A' }}>✓</span>
                  )}
                </div>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cairo)' }}>{item.concept}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: `${item.goalColor}18`, color: item.goalColor, fontFamily: 'var(--font-cairo)' }}>
                {item.goal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
