import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader, StatusBadge, EmptyState } from '@/components/ui';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { Droplets, Trees, ArrowRight, ShieldCheck } from 'lucide-react';

export function Harvests() {
  const { harvests } = useStore();

  return (
    <DashboardLayout current="/harvests">
      <SectionHeader
        title="Harvests"
        subtitle="Every harvest is verified — identity, hive ownership, beekeeper confirmation, and IoT evidence."
      />

      {harvests.length === 0 ? (
        <Card className="p-6">
          <EmptyState icon={<Droplets className="w-6 h-6" />} title="No harvests yet" subtitle="Record a harvest from the beekeeper chat interface." />
        </Card>
      ) : (
        <div className="space-y-4">
          {harvests.map((h) => (
            <Card key={h.id} className="p-5 card-hover">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-honey-50 text-honey-600 flex items-center justify-center">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink-900">Harvest {h.id}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><Trees className="w-3.5 h-3.5" />Hive {h.hiveId}</span>
                      <span>{h.quantityKg} kg</span>
                      <span>{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>Beekeeper: {h.beekeeperId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <StatusBadge level={h.verification} />
                    <p className="text-xs text-ink-400 mt-1">AI confidence: {h.aiConfidence}%</p>
                  </div>
                  <Link to="/batches" className="btn-ghost text-sm border border-ink-200">
                    View Batch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* IoT evidence summary */}
              <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-xs">
                  <p className="text-ink-400">Weight before</p>
                  <p className="font-bold text-ink-800">{h.iot.weightBefore} kg</p>
                </div>
                <div className="text-xs">
                  <p className="text-ink-400">Weight after</p>
                  <p className="font-bold text-ink-800">{h.iot.weightAfter} kg</p>
                </div>
                <div className="text-xs">
                  <p className="text-ink-400">Observed change</p>
                  <p className="font-bold text-forest-600">{h.iot.observedChange} kg</p>
                </div>
                <div className="text-xs">
                  <p className="text-ink-400">AI Analysis</p>
                  <p className="font-semibold text-ink-700 text-balance">{h.aiAnalysis}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                IoT data is supporting evidence, not absolute proof. SIMULATED SENSOR DATA — PROTOTYPE.
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
