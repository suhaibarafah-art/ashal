import WealthVision from '@/components/WealthVision';
import { GlassCard, SectionHeading } from '@/components/DesignSystem';

/**
 * Saudi Luxury Store - CEO Command Center
 * مركز قيادة الإمبراطورية - لوحة التحكم المالية والاستراتيجية.
 */
export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] p-12 overflow-hidden">
      <SectionHeading title="مركز القيادة السيادية" subtitle="EMPIRE COMMAND CENTER" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12 mb-20">
         <GlassCard className="border-accent-gold/50">
            <p className="text-[10px] uppercase tracking-widest text-[#f8f6f2] mb-1">صافي الأرباح اليوم</p>
            <h4 className="text-3xl text-accent-gold font-light">42,500 SAR</h4>
            <div className="mt-4 text-[8px] text-green-500 font-bold">+12% vs Yesterday</div>
         </GlassCard>
         <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-[#f8f6f2] mb-1">عدد الطلبات (24ساعة)</p>
            <h4 className="text-3xl text-accent-gold font-light">84</h4>
         </GlassCard>
         <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-[#f8f6f2] mb-1">صحة النظام</p>
            <h4 className="text-3xl text-green-500 font-light">100%</h4>
         </GlassCard>
         <GlassCard>
            <p className="text-[10px] uppercase tracking-widest text-[#f8f6f2] mb-1">رادار الهبّة</p>
            <h4 className="text-3xl text-accent-gold font-light">Active</h4>
         </GlassCard>
      </div>

      <WealthVision />

      <div className="mt-20 border-t border-white/5 pt-12">
        <h5 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-8">Pulse History</h5>
        <div className="space-y-4 font-mono text-[10px]">
            <div className="flex justify-between text-gray-400">
                <span>[09:00:00] P&L Report Generated: Net 42.5k SAR.</span>
                <span className="text-accent-gold">OK</span>
            </div>
            <div className="flex justify-between text-gray-400">
                <span>[03:00:00] System Backup Completed (Sovereign Cloud).</span>
                <span className="text-accent-gold">OK</span>
            </div>
            <div className="flex justify-between text-gray-400">
                <span>[00:00:00] Nightly Code Audit: No security leaks detected.</span>
                <span className="text-accent-gold">OK</span>
            </div>
        </div>
      </div>
    </main>
  );
}
