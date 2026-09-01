import { Link } from '@/components/Link';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Link2,
  QrCode,
  Mic,
  Cpu,
  Boxes,
  ScanLine,
  UserCheck,
  Trees,
  Droplets,
  Factory,
  FlaskConical,
  Package,
  Play,
} from 'lucide-react';

export function Home() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Nav */}
      <nav className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            {profile ? (
              <>
                <span className="text-sm text-ink-600 font-medium">
                  {profile.name} · {profile.role.replace('_', ' ')}
                </span>
                {profile.role === 'fpo_officer' && (
                  <Link to="/dashboard" className="btn-secondary text-sm">
                    Dashboard
                  </Link>
                )}
                {profile.role === 'beekeeper' && (
                  <Link to="/beekeeper" className="btn-secondary text-sm">
                    Beekeeper Interface
                  </Link>
                )}
                <button onClick={() => signOut()} className="btn-ghost text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/batch/HC-001" className="btn-secondary text-sm">
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-32 pb-20 px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="absolute -top-24 right-0 w-[600px] h-[600px] bg-honey-100/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-forest-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-honey-200 rounded-full px-4 py-1.5 text-xs font-semibold text-honey-700 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-honey-500 animate-pulse-soft" />
            SIH26021 · Smart India Hackathon Prototype
          </div>

          <h1 className="font-display font-extrabold text-5xl lg:text-7xl tracking-tight text-ink-900 text-balance animate-fade-in">
            HONEY<span className="text-honey-500">CHAIN</span>
          </h1>

          <p className="mt-5 text-lg lg:text-xl text-ink-600 max-w-2xl mx-auto text-balance animate-fade-in">
            Evidence-backed honey traceability for rural beekeeping.
            First we verify <span className="font-semibold text-ink-900">who</span> the beekeeper is and{' '}
            <span className="font-semibold text-ink-900">which</span> hives are legitimate — then we chain the evidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            {profile ? (
              <>
                {profile.role === 'fpo_officer' && (
                  <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
                    <ShieldCheck className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                )}
                {profile.role === 'beekeeper' && (
                  <Link to="/beekeeper" className="btn-primary text-base px-6 py-3">
                    <MessageSquare className="w-4 h-4" />
                    Beekeeper Interface
                  </Link>
                )}
                <Link to="/batch/HC-001" className="btn-secondary text-base px-6 py-3">
                  <QrCode className="w-4 h-4 text-honey-600" />
                  View QR Batch
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary text-base px-6 py-3">
                  <Play className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/batch/HC-001" className="btn-secondary text-base px-6 py-3">
                  <QrCode className="w-4 h-4 text-honey-600" />
                  Explore Public Batch
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-ink-400">
            The full demo flow runs in about 2–3 minutes — beekeeper chat → evidence → blockchain → QR
          </p>
        </div>
      </header>

      {/* Feature cards */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { icon: Cpu, title: 'Smart Beekeeping', desc: 'AI + IoT-assisted hive monitoring with simulated sensor data.', color: 'honey' },
            { icon: Link2, title: 'Trusted Traceability', desc: 'Evidence-backed blockchain records — not just a chain, a chain of proof.', color: 'forest' },
            { icon: Mic, title: 'Rural-First Access', desc: 'Voice-first beekeeper interaction in Hindi/English mixed language.', color: 'honey' },
          ].map((f) => (
            <div key={f.title} className="card p-6 card-hover animate-fade-in">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color === 'honey' ? 'bg-honey-50 text-honey-600' : 'bg-forest-50 text-forest-600'}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900">{f.title}</h3>
              <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust flow */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title text-2xl">The Evidence Chain</h2>
            <p className="text-sm text-ink-500 mt-1">Every step adds proof. Blockchain protects the integrity of what was verified — it does not magically prove honey is genuine.</p>
          </div>

          <div className="card p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {[
                { icon: UserCheck, label: 'Beekeeper', sub: 'FPO verified' },
                { icon: Trees, label: 'Registered Hive', sub: 'Asset trust' },
                { icon: MessageSquare, label: 'AI Capture', sub: 'Voice + text' },
                { icon: ShieldCheck, label: 'Evidence', sub: 'IoT + confirm' },
                { icon: Boxes, label: 'Honey Batch', sub: 'Aggregated' },
                { icon: Link2, label: 'Blockchain', sub: 'Hash-linked' },
                { icon: QrCode, label: 'QR Code', sub: 'Consumer scan' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex flex-col items-center text-center w-20">
                    <div className="w-12 h-12 rounded-xl bg-white border border-ink-200 flex items-center justify-center text-honey-600 shadow-sm">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-ink-800 mt-2">{step.label}</p>
                    <p className="text-[10px] text-ink-400">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-ink-300 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust model */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title text-2xl">Four-Layer Trust Model</h2>
            <p className="text-sm text-ink-500 mt-1">Trust is built layer by layer — identity, asset, event, then record integrity.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Identity Trust', q: 'Is the beekeeper authorized?', a: 'FPO/KVIC verification', icon: UserCheck },
              { n: '02', title: 'Asset Trust', q: 'Does the hive belong to them?', a: 'Registered hive', icon: Trees },
              { n: '03', title: 'Event Trust', q: 'Is the claim supported?', a: 'Confirmation + IoT evidence', icon: ShieldCheck },
              { n: '04', title: 'Record Integrity', q: 'Has the record been modified?', a: 'Blockchain hash verification', icon: Link2 },
            ].map((l) => (
              <div key={l.n} className="card p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-honey-500">{l.n}</span>
                  <l.icon className="w-5 h-5 text-ink-400" />
                </div>
                <h3 className="font-display font-bold text-ink-900">{l.title}</h3>
                <p className="text-xs text-ink-500 mt-1 italic">"{l.q}"</p>
                <div className="mt-3 pt-3 border-t border-ink-100">
                  <p className="text-xs font-semibold text-forest-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {l.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supply chain lifecycle */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title text-2xl">Batch Lifecycle</h2>
            <p className="text-sm text-ink-500 mt-1">From hive to consumer — every event is a verified, hash-linked record.</p>
          </div>
          <div className="card p-8">
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {[
                { icon: Trees, label: 'Hive', color: 'forest' },
                { icon: Droplets, label: 'Harvest', color: 'honey' },
                { icon: Package, label: 'Collection', color: 'honey' },
                { icon: Factory, label: 'Processing', color: 'ink' },
                { icon: FlaskConical, label: 'Quality', color: 'forest' },
                { icon: Package, label: 'Packaging', color: 'honey' },
                { icon: ScanLine, label: 'Consumer', color: 'forest' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color === 'honey' ? 'bg-honey-50 text-honey-600' : s.color === 'forest' ? 'bg-forest-50 text-forest-600' : 'bg-ink-100 text-ink-600'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-ink-700 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto card p-10 text-center bg-gradient-to-br from-honey-50 to-white border-honey-200">
          <h2 className="section-title text-2xl">Ready to see the full flow?</h2>
          <p className="text-sm text-ink-600 mt-2 max-w-md mx-auto">
            Walk through the complete demo: beekeeper voice capture → AI extraction → evidence verification → blockchain → consumer QR.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {profile ? (
              <Link to="/batch/HC-001" className="btn-primary text-base px-6 py-3">
                <QrCode className="w-4 h-4" />
                View Consumer QR Page
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-primary text-base px-6 py-3">
                  <Play className="w-4 h-4" />
                  Login to Start
                </Link>
                <Link to="/batch/HC-001" className="btn-secondary text-base px-6 py-3">
                  <QrCode className="w-4 h-4 text-honey-600" />
                  View Consumer QR Page
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200/70 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-xs text-ink-400">
            Prototype Hash-Linked Blockchain · Simulated Sensor Data · Not connected to real WhatsApp API
          </p>
          <p className="text-xs text-ink-400">SIH26021 · Smart India Hackathon 2026</p>
        </div>
      </footer>
    </div>
  );
}
