import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader, StatusBadge } from '@/components/ui';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { Package, Trees, MapPin, ArrowRight, QrCode } from 'lucide-react';

export function Batches() {
  const { batches } = useStore();

  return (
    <DashboardLayout current="/batches">
      <SectionHeader
        title="Honey Batches"
        subtitle="Aggregated, verified honey batches with full lifecycle tracking."
      />

      <div className="space-y-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-honey-50 text-honey-600 flex items-center justify-center">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-xl text-ink-900">Batch {batch.id}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Origin: {batch.origin}</span>
                    <span>Total: {batch.totalKg} kg</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge level={batch.status} />
                <Link to={`/batch/${batch.id}`} className="btn-primary text-sm">
                  <QrCode className="w-4 h-4" />
                  View QR & Trace
                </Link>
              </div>
            </div>

            {/* Source hives aggregation */}
            <div className="p-4 bg-ink-50 rounded-xl mb-5">
              <p className="text-xs font-bold text-ink-500 uppercase tracking-wide mb-3">Batch Aggregation — Source Hives</p>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-honey-500" />
                <p className="font-mono font-bold text-ink-800">{batch.id}</p>
              </div>
              <div className="ml-6 border-l-2 border-honey-200 space-y-2">
                {batch.sourceHives.map((s) => (
                  <div key={s.hiveId} className="flex items-center gap-2 pl-4 py-1">
                    <Trees className="w-3.5 h-3.5 text-forest-500" />
                    <span className="text-sm text-ink-700">Hive {s.hiveId} — {s.quantityKg} kg</span>
                  </div>
                ))}
              </div>
              <div className="ml-6 pl-4 mt-2 pt-2 border-t border-ink-200">
                <p className="text-sm font-bold text-ink-900">Total: {batch.totalKg} kg</p>
              </div>
            </div>

            {/* Lifecycle */}
            <div>
              <p className="text-xs font-bold text-ink-500 uppercase tracking-wide mb-3">Batch Lifecycle</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {batch.events.map((e, i, arr) => (
                  <div key={i} className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex flex-col items-center text-center w-28">
                      <div className="w-10 h-10 rounded-xl bg-white border border-ink-200 flex items-center justify-center text-lg shadow-sm">
                        {e.icon}
                      </div>
                      <p className="text-[10px] font-bold text-ink-700 mt-1.5 leading-tight">{e.label}</p>
                      <p className="text-[10px] text-ink-400">{e.date}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-ink-300 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
