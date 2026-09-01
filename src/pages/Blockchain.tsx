import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader } from '@/components/ui';
import { useStore } from '@/lib/store';
import { verifyChain } from '@/lib/blockchain';
import { Link2, ShieldCheck, Check, X, Lock, ArrowDown } from 'lucide-react';

export function Blockchain() {
  const { blocks } = useStore();
  const [verification, setVerification] = useState<boolean[] | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    const results = await verifyChain(blocks);
    setVerification(results);
    setVerifying(false);
  };

  const allValid = verification?.every(Boolean);

  return (
    <DashboardLayout current="/blockchain">
      <SectionHeader
        title="Blockchain Integrity Layer"
        subtitle="Critical verified supply-chain events are represented as hash-linked records. Detailed operational data remains in the database."
      />

      {/* Prototype banner */}
      <Card className="p-4 mb-6 bg-honey-50 border-honey-200">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-honey-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-honey-800">Prototype Hash-Linked Blockchain</p>
            <p className="text-xs text-ink-600 mt-0.5">
              This is a demonstration SHA-256 hash-linked ledger — not connected to a public blockchain.
              Production deployment can anchor critical event hashes to a permissioned blockchain network.
            </p>
          </div>
        </div>
      </Card>

      {/* Chain visualization */}
      <div className="space-y-3 mb-6">
        {blocks.map((block, i) => (
          <div key={block.index}>
            <Card className={`p-5 ${verification && verification[i] ? 'border-forest-300' : verification && !verification[i] ? 'border-red-400' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Block number */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-honey-400 to-honey-600 text-white flex flex-col items-center justify-center font-display font-bold shadow-sm">
                    <span className="text-[9px] uppercase opacity-80">Block</span>
                    <span className="text-lg leading-none">#{String(block.index).padStart(3, '0')}</span>
                  </div>
                </div>

                {/* Block content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display font-bold text-ink-900">{block.event}</p>
                      <p className="text-xs text-ink-500">Batch: {block.batchId}</p>
                    </div>
                    {verification && (
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${verification[i] ? 'text-forest-600' : 'text-red-600'}`}>
                        {verification[i] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {verification[i] ? 'Valid' : 'Invalid'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-ink-50 rounded-lg">
                      <p className="text-ink-400 mb-0.5">Previous Hash</p>
                      <p className="font-mono font-bold text-ink-700 break-all">{block.prevHash}</p>
                    </div>
                    <div className="p-2.5 bg-honey-50 rounded-lg">
                      <p className="text-honey-600 mb-0.5">Current Hash</p>
                      <p className="font-mono font-bold text-honey-800 break-all">{block.hash}</p>
                    </div>
                  </div>

                  <div className="mt-2 p-2.5 bg-ink-50 rounded-lg">
                    <p className="text-ink-400 mb-0.5 text-xs">Payload</p>
                    <p className="font-mono text-xs text-ink-600 break-all">{block.payload}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Link between blocks */}
            {i < blocks.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="w-5 h-5 text-ink-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verify button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="btn-primary text-base px-6 py-3"
        >
          {verifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: '2px' }} />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Verify Chain
            </>
          )}
        </button>

        {verification && (
          <Card className="p-5 w-full max-w-md animate-fade-in">
            <div className="space-y-2">
              {verification.map((v, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${v ? 'text-forest-700' : 'text-red-600'}`}>
                  {v ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  Block {String(i + 1).padStart(3, '0')} {v ? 'valid' : 'invalid'}
                </div>
              ))}
            </div>
            <div className={`mt-4 pt-4 border-t border-ink-100 flex items-center gap-2 font-display font-bold ${allValid ? 'text-forest-700' : 'text-red-600'}`}>
              {allValid ? <ShieldCheck className="w-5 h-5" /> : <X className="w-5 h-5" />}
              CHAIN INTEGRITY: {allValid ? '🟢 VALID' : '🔴 INVALID'}
            </div>
          </Card>
        )}
      </div>

      {/* Explanation */}
      <Card className="p-5 mt-6 bg-ink-50/50">
        <div className="flex items-start gap-3">
          <Link2 className="w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ink-700">How it works</p>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              Each event contains a SHA-256 hash linked to the previous event. Changing an earlier record would cause a hash mismatch, making tampering immediately detectable. Blockchain verifies the integrity of recorded supply-chain events — it does not independently chemically authenticate honey.
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
