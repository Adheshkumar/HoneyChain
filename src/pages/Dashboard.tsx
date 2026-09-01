import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader, StatCard, StatusBadge, Check } from '@/components/ui';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { dashboardStats, productionTimeline, hiveHealthData, recentActivity } from '@/lib/mockData';
import {
  Users,
  UserCheck,
  Trees,
  Droplets,
  Package,
  AlertTriangle,
  ShieldCheck,
  Link2,
  QrCode,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

export function Dashboard() {
  const { harvests, batches, hives } = useStore();

  const maxProd = Math.max(...productionTimeline.map((d) => d.kg));

  return (
    <DashboardLayout current="/dashboard">
      <SectionHeader
        title="Overview"
        subtitle="Evidence-backed honey traceability — live prototype dashboard."
        action={
          <Link to="/beekeeper" className="btn-primary text-sm">
            Open Beekeeper Chat
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Beekeepers" value={dashboardStats.totalBeekeepers} />
        <StatCard icon={<UserCheck className="w-5 h-5" />} label="Verified" value={dashboardStats.verifiedBeekeepers} accent="text-forest-600" />
        <StatCard icon={<Trees className="w-5 h-5" />} label="Active Hives" value={dashboardStats.activeHives} />
        <StatCard icon={<Droplets className="w-5 h-5" />} label="Honey Produced" value={`${dashboardStats.honeyProducedKg} kg`} accent="text-honey-600" />
        <StatCard icon={<Package className="w-5 h-5" />} label="Verified Batches" value={dashboardStats.verifiedBatches} accent="text-forest-600" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Alerts" value={dashboardStats.alerts} accent="text-red-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent activity */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-honey-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-ink-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-honey-50 text-honey-600 flex items-center justify-center font-mono text-xs font-bold">
                    {a.beekeeperId}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{a.action}</p>
                    <p className="text-xs text-ink-500">{a.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge level={a.status === 'Flagged' ? 'PENDING' : a.status === 'Pending' ? 'PENDING' : a.status === 'Verified' ? 'VERIFIED' : 'EVIDENCE_SUPPORTED'} />
                  <p className="text-xs text-ink-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Evidence overview */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            Evidence Overview
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Identity', detail: 'FPO Verified', ok: true },
              { label: 'Hive', detail: 'Registered', ok: true },
              { label: 'Claim', detail: 'User Confirmed', ok: true },
              { label: 'Sensor', detail: 'Supporting Evidence', ok: true },
              { label: 'Supervisor', detail: 'Verified', ok: true },
              { label: 'Blockchain', detail: 'Integrity Verified', ok: true },
            ].map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${e.ok ? 'bg-forest-100 text-forest-600' : 'bg-red-100 text-red-600'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{e.label}</p>
                    <p className="text-xs text-ink-500">{e.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Production chart */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-honey-500" />
            Honey Production Over Time
          </h3>
          <div className="flex items-end justify-between h-40 gap-3">
            {productionTimeline.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-honey-100 rounded-t-lg flex items-end" style={{ height: '100%' }}>
                  <div
                    className="w-full bg-gradient-to-t from-honey-500 to-honey-400 rounded-t-lg transition-all hover:from-honey-600 hover:to-honey-500"
                    style={{ height: `${(d.kg / maxProd) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-ink-700">{d.kg}kg</p>
                  <p className="text-xs text-ink-400">{d.month}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Hive health */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-forest-500" />
            Hive Health Distribution
          </h3>
          <div className="space-y-4">
            {hiveHealthData.map((h) => (
              <div key={h.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-ink-700">{h.label}</span>
                  <span className="text-sm font-bold text-ink-900">{h.count}</span>
                </div>
                <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(h.count / 148) * 100}%`, backgroundColor: h.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-ink-100">
            <div className="flex items-start gap-3 p-3 bg-honey-50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-honey-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-ink-800">Hive 15 — Attention</p>
                <p className="text-xs text-ink-600 mt-0.5">Possible colony stress. Manual inspection recommended.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trust model */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-ink-900 mb-1">Trust Model</h3>
        <p className="text-sm text-ink-500 mb-5">Trust is built layer by layer — from identity to blockchain integrity.</p>
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {[
            { label: 'IDENTITY', sub: 'FPO/KVIC verification', icon: UserCheck },
            { label: 'REGISTERED HIVE', sub: 'Asset ownership', icon: Trees },
            { label: 'CLAIM', sub: 'Beekeeper confirmation', icon: ShieldCheck },
            { label: 'EVIDENCE', sub: 'IoT + AI analysis', icon: Activity },
            { label: 'VERIFICATION', sub: 'Evidence supported', icon: Check },
            { label: 'BLOCKCHAIN', sub: 'Hash-linked integrity', icon: Link2 },
            { label: 'QR', sub: 'Consumer access', icon: QrCode },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              <div className="flex-1 p-3 rounded-xl bg-ink-50 border border-ink-100 text-center">
                <s.icon className="w-5 h-5 text-honey-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-ink-800">{s.label}</p>
                <p className="text-[10px] text-ink-400">{s.sub}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-ink-300 hidden md:block flex-shrink-0" />}
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
