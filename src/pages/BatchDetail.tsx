import { Link } from '@/components/Link';
import { Logo, Card, Check } from '@/components/ui';
import { useStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import {
  Trees,
  Droplets,
  Package,
  Factory,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  Link2,
  ArrowRight,
  MapPin,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';

export function BatchDetail({ batchId }: { batchId: string }) {
  const { batches, harvests, blocks } = useStore();
  const batch = batches.find((b) => b.id === batchId) || batches[0];
  const batchHarvests = harvests.filter((h) => h.batchId === batch.id);
  const batchBlocks = blocks.filter((b) => b.batchId === batch.id);
  const primaryHarvest = batchHarvests[0] || harvests[0];

  const timelineIcons = [Trees, Droplets, Package, Factory, FlaskConical, Package, ScanLine];

  return (
    <div className="min-h-screen bg-gradient-to-b from-honey-50/30 to-ink-50">
      {/* Header */}
      <header className="bg-white border-b border-ink-200/70">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-forest-600 font-semibold">
            <BadgeCheck className="w-4 h-4" />
            Verified Honey Journey
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Batch summary */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED
          </div>
          <h1 className="font-display font-extrabold text-3xl text-ink-900">Batch {batch.id}</h1>
          <p className="text-sm text-ink-500 mt-2">Scan to verify this honey batch — complete traceability from hive to consumer.</p>
        </div>

        {/* QR Code */}
        <Card className="p-8 mb-8 text-center">
          <h2 className="font-display font-bold text-ink-900 mb-1">Consumer Verification</h2>
          <p className="text-sm text-ink-500 mb-5">Scan to verify this honey batch.</p>
          <Link to={`/batch/${batch.id}`} className="inline-block">
            <div className="p-5 bg-white rounded-2xl border-2 border-honey-200 inline-block hover:border-honey-400 transition-all hover:shadow-card-hover">
              <QRCodeSVG
                value={`${window.location.origin}${window.location.pathname}#/batch/${batch.id}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#411f0c"
                level="M"
              />
            </div>
          </Link>
          <p className="text-xs text-ink-400 mt-3 font-mono">/#/batch/{batch.id}</p>
        </Card>

        {/* Batch info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Batch ID', value: batch.id },
            { label: 'Origin', value: batch.origin },
            { label: 'Source', value: `Hive ${primaryHarvest?.hiveId || '12'}` },
            { label: 'Harvest', value: `${primaryHarvest?.quantityKg || 3} kg` },
          ].map((item) => (
            <Card key={item.label} className="p-4 text-center">
              <p className="text-xs text-ink-400 font-semibold uppercase">{item.label}</p>
              <p className="font-display font-bold text-lg text-ink-900 mt-1">{item.value}</p>
            </Card>
          ))}
        </div>

        {/* Traceability timeline */}
        <Card className="p-8 mb-8">
          <h2 className="font-display font-bold text-xl text-ink-900 mb-6 text-center">Honey Journey</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-honey-200" />

            {batch.events.map((event, i) => {
              const Icon = timelineIcons[i] || Package;
              return (
                <div key={i} className="relative flex items-start gap-4 mb-6 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-white border-2 border-honey-300 flex items-center justify-center text-honey-600 shadow-sm flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-ink-900">{event.label}</p>
                      <p className="text-xs text-ink-400">{event.date}</p>
                    </div>
                    <p className="text-sm text-ink-600 mt-0.5">{event.detail}</p>
                    {i === 0 && primaryHarvest && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-forest-100 text-forest-700 px-2.5 py-1 rounded-full font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Evidence Supported
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Consumer at end */}
            <div className="relative flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${batch.events.length * 100}ms` }}>
              <div className="relative z-10 w-12 h-12 rounded-xl bg-forest-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-display font-bold text-ink-900">Consumer</p>
                <p className="text-sm text-ink-600">You — verifying this batch now</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Blockchain integrity */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-ink-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-honey-500" />
              Blockchain Integrity
            </h2>
            <span className="badge bg-forest-100 text-forest-700">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
              VERIFIED
            </span>
          </div>
          <div className="space-y-2">
            {batchBlocks.map((block) => (
              <div key={block.index} className="flex items-center justify-between p-3 bg-ink-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-honey-600">#{String(block.index).padStart(3, '0')}</span>
                  <span className="text-sm font-semibold text-ink-800">{block.event}</span>
                </div>
                <span className="font-mono text-xs text-ink-500">{block.hash}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification details */}
        <Card className="p-6 mb-8">
          <h2 className="font-display font-bold text-lg text-ink-900 mb-4">Verification Details</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'FPO-verified beekeeper',
              'Registered hive',
              'Beekeeper confirmation',
              'IoT supporting evidence',
              'Quality verification',
              'Blockchain integrity',
            ].map((v) => (
              <div key={v} className="flex items-center gap-2.5 p-3 bg-forest-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-forest-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-semibold text-ink-800">{v}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Trust confidence */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-forest-50 to-white border-forest-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-600">Traceability confidence</p>
              <p className="font-display font-extrabold text-2xl text-forest-700 mt-1">HIGH</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-forest-500" />
              <div className="w-2 h-2 rounded-full bg-forest-500" />
              <div className="w-2 h-2 rounded-full bg-forest-500" />
              <div className="w-2 h-2 rounded-full bg-forest-500" />
              <div className="w-2 h-2 rounded-full bg-ink-200" />
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-5 bg-ink-50/50 mb-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs text-ink-500 leading-relaxed">
                Blockchain verifies the integrity of recorded supply-chain events. It does not independently chemically authenticate honey.
              </p>
              <p className="text-xs text-ink-500 leading-relaxed">
                IoT sensor data shown is simulated for prototype purposes. Production deployment uses real hive sensors.
              </p>
              <p className="text-xs text-ink-500 leading-relaxed">
                No private beekeeper personal information is displayed on this consumer page.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link to="/blockchain" className="btn-secondary">
            <Link2 className="w-4 h-4 text-honey-600" />
            View Blockchain Ledger
          </Link>
          <Link to="/" className="btn-ghost">
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-ink-200/70 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-ink-400">
            HONEYCHAIN · Evidence-Backed Honey Traceability · SIH26021 Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
