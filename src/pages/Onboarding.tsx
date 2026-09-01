import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader, StatusBadge, Check, XMark } from '@/components/ui';
import { useStore } from '@/lib/store';
import { UserCheck, Trees, ShieldCheck, Plus, Clock, MapPin, BadgeCheck, XCircle } from 'lucide-react';

export function Onboarding() {
  const { beekeepers, hives, verifyBeekeeper, rejectBeekeeper, addHive } = useStore();
  const [showAddHive, setShowAddHive] = useState(false);
  const [newHiveId, setNewHiveId] = useState('');
  const [newApiary, setNewApiary] = useState('');
  const [verifiedFlash, setVerifiedFlash] = useState<string | null>(null);

  const pending = beekeepers.filter((b) => b.status === 'PENDING');
  const verified = beekeepers.filter((b) => b.status === 'VERIFIED');

  const handleVerify = (id: string) => {
    verifyBeekeeper(id);
    setVerifiedFlash(id);
    setTimeout(() => setVerifiedFlash(null), 3000);
  };

  const handleAddHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiveId) return;
    addHive({
      id: newHiveId,
      beekeeperId: 'BK-001',
      apiary: newApiary || 'Mysuru Cluster A',
      cluster: 'Mysuru',
      status: 'Healthy',
      temperature: 35 + Math.random() * 2,
      humidity: 68 + Math.random() * 8,
      weight: 40 + Math.random() * 12,
      activity: 'Normal',
    });
    setNewHiveId('');
    setNewApiary('');
    setShowAddHive(false);
  };

  const bk001Hives = hives.filter((h) => h.beekeeperId === 'BK-001');

  return (
    <DashboardLayout current="/onboarding">
      <SectionHeader
        title="FPO / KVIC Beekeeper Onboarding"
        subtitle="Institutional verification — only FPO-verified beekeepers can register hives and create trusted harvest records."
      />

      {/* Pending verification */}
      <div className="mb-8">
        <h3 className="font-display font-bold text-ink-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-honey-500" />
          Pending Verification
        </h3>
        <div className="space-y-3">
          {pending.length === 0 && (
            <Card className="p-6 text-center text-sm text-ink-500">
              No pending applications. All beekeepers verified.
            </Card>
          )}
          {pending.map((b) => (
            <Card key={b.id} className={`p-5 ${verifiedFlash === b.id ? 'ring-2 ring-forest-300' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-honey-50 text-honey-600 flex items-center justify-center font-display font-bold text-lg">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink-900">{b.name}</p>
                    <p className="text-sm text-ink-500">{b.fpo}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" />Membership: {b.membershipId}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge level="PENDING" />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleVerify(b.id)} className="btn-primary text-sm px-4 py-2">
                    <Check className="w-4 h-4" />
                    Verify Beekeeper
                  </button>
                  <button onClick={() => rejectBeekeeper(b.id)} className="btn text-sm px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100">
                    <XMark className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Verified beekeepers */}
      <div className="mb-8">
        <h3 className="font-display font-bold text-ink-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          Verified Beekeepers
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {verified.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center font-display font-bold">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink-900">{b.name}</p>
                    <p className="text-xs text-ink-500">{b.id} · {b.fpo}</p>
                  </div>
                </div>
                <StatusBadge level="VERIFIED" />
              </div>
              <div className="space-y-1.5 pt-3 border-t border-ink-100">
                <p className="text-xs text-ink-600 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-forest-500" />Identity verified</p>
                <p className="text-xs text-ink-600 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-forest-500" />FPO membership verified</p>
                <p className="text-xs text-ink-600 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-forest-500" />Verified by FPO Officer</p>
                {b.verifiedAt && (
                  <p className="text-xs text-ink-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(b.verifiedAt).toLocaleString()}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Registered hives */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-ink-900 flex items-center gap-2">
            <Trees className="w-4 h-4 text-forest-600" />
            Registered Hives — BK-001 Ramesh Kumar
          </h3>
          <button onClick={() => setShowAddHive(!showAddHive)} className="btn-secondary text-sm">
            <Plus className="w-4 h-4" />
            Add Hive
          </button>
        </div>

        {showAddHive && (
          <Card className="p-5 mb-4 animate-slide-in">
            <form onSubmit={handleAddHive} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-ink-500 mb-1 block">Hive ID</label>
                <input className="input" value={newHiveId} onChange={(e) => setNewHiveId(e.target.value)} placeholder="e.g. 25" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-semibold text-ink-500 mb-1 block">Apiary / Cluster</label>
                <input className="input" value={newApiary} onChange={(e) => setNewApiary(e.target.value)} placeholder="Mysuru Cluster A" />
              </div>
              <button type="submit" className="btn-primary">
                <Check className="w-4 h-4" />
                Register Hive
              </button>
            </form>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {bk001Hives.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink-900">Hive {h.id}</p>
                    <p className="text-xs text-ink-500">{h.apiary}</p>
                  </div>
                </div>
                <StatusBadge level="VERIFIED" />
              </div>
              <div className="space-y-1 pt-3 border-t border-ink-100 text-xs text-ink-500">
                <p>Beekeeper: BK-001 — Ramesh Kumar</p>
                <p>Registered: {h.registeredAt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <Card className="mt-8 p-5 bg-ink-50/50 border-ink-200">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ink-700">Privacy & Identity</p>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              Production deployment can use authorized identity/beneficiary verification. Sensitive identity documents (e.g. Aadhaar) are not stored on-chain. This prototype uses institutional FPO membership ID only.
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
