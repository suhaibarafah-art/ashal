import Link from 'next/link';

export default function EmpireFooter() {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 pb-8 mt-auto px-5 lg:px-20 text-center md:text-right font-arabic-body">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2 text-center md:text-right">
          <h2 className="text-3xl font-serif text-[var(--accent-gold)] tracking-widest mb-6">SOVEREIGN EMPIRE</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm font-light mx-auto md:mx-0">
            الوجهة الأولى للنخبة في المملكة العربية السعودية. ننتقي أدق تفاصيل الفخامة لنضعها بين يديك بأعلى معايير الخدمة والموثوقية.
          </p>
        </div>
        
        <div className="text-center md:text-right">
          <h4 className="font-bold text-[var(--accent-gold)] mb-6 uppercase tracking-wider text-sm font-arabic-heading">السيادة القانونية</h4>
          <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
            <li><Link href="/return-policy" className="hover:text-[var(--accent-gold)] transition">سياسة الاسترجاع (7 أيام)</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-[var(--accent-gold)] transition">سياسة الشحن والتوصيل</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--accent-gold)] transition">الشروط والأحكام</Link></li>
            <li><Link href="/privacy" className="hover:text-[var(--accent-gold)] transition">الخصوصية وسرية البيانات</Link></li>
          </ul>
        </div>
        
        <div className="text-center md:text-right">
          <h4 className="font-bold text-[var(--accent-gold)] mb-6 uppercase tracking-wider text-sm font-arabic-heading">الموثوقية الرسمية</h4>
          <div className="space-y-4">
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg flex items-center justify-between border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-tertiary)]">السجل التجاري</span>
              <span className="text-sm text-white font-mono">1010893321</span>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg flex items-center justify-between border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-tertiary)] ml-2">الرقم الضريبي (ZATCA)</span>
              <span className="text-sm text-white font-mono">300582910300003</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-tertiary)]">
        <p>&copy; {new Date().getFullYear()} Sovereign Empire Inc. جميع الحقوق محفوظة لكيان السيادة.</p>
        <div className="flex gap-4 opacity-70 items-center justify-center">
          <span className="font-sans font-bold text-[10px] tracking-widest uppercase">Apple Pay</span>
          <span className="font-sans font-bold text-[10px] tracking-widest uppercase">Mada</span>
          <span className="font-sans font-bold text-[10px] tracking-widest uppercase">Visa</span>
          <span className="font-sans font-bold text-[10px] tracking-widest uppercase">Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
