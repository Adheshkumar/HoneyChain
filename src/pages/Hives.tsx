import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, SectionHeader, StatusBadge } from '@/components/ui';
import { useStore } from '@/lib/store';
import {
  Trees,
  Thermometer,
  Droplets,
  Weight,
  Activity,
  AlertTriangle,
  Upload,
  ShieldCheck,
  Cpu,
  Camera,
  X,
} from 'lucide-react';

export function Hives() {
  const { hives } = useStore();
  const [showScreening, setShowScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState(false);

  const handleUpload = () => {
    setShowScreening(true);
    setTimeout(() => setScreeningResult(true), 1500);
  };

  return (
    <DashboardLayout current="/hives">
      <SectionHeader
        title="Apiaries & Hives"
        subtitle="Registered hives with simulated IoT sensor monitoring. SIMULATED SENSOR DATA — PROTOTYPE."
      />

      {/* Hive cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {hives.map((hive) => {
          const isAttention = hive.status === 'Attention';
          return (
            <Card key={hive.id} className={`p-5 ${isAttention ? 'border-honey-300' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isAttention ? 'bg-honey-100 text-honey-700' : 'bg-forest-50 text-forest-600'}`}>
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink-900">Hive {hive.id}</p>
                    <p className="text-xs text-ink-500">{hive.apiary}</p>
                  </div>
                </div>
                <StatusBadge level={isAttention ? 'PENDING' : 'VERIFIED'} />
              </div>

              {/* Sensor grid */}
              <div className="grid grid-cols-2 gap-3">
                <Sensor icon={<Thermometer className="w-4 h-4" />} label="Temperature" value={`${hive.temperature}°C`} alert={hive.temperature > 37} />
                <Sensor icon={<Droplets className="w-4 h-4" />} label="Humidity" value={`${hive.humidity}%`} alert={hive.humidity > 80} />
                <Sensor icon={<Weight className="w-4 h-4" />} label="Weight" value={`${hive.weight} kg`} />
                <Sensor icon={<Activity className="w-4 h-4" />} label="Activity" value={hive.activity} alert={hive.activity === 'Low'} />
              </div>

              {/* Status bar */}
              <div className={`mt-4 pt-4 border-t border-ink-100 flex items-center gap-2 ${isAttention ? 'text-honey-700' : 'text-forest-600'}`}>
                {isAttention ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-xs font-semibold">Status: Attention — manual inspection recommended</p>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <p className="text-xs font-semibold">Status: Healthy</p>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Smart Hive Insights */}
      <Card className="p-6 mb-6">
        <h3 className="font-display font-bold text-ink-900 mb-1 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-honey-500" />
          Smart Hive Insights
        </h3>
        <p className="text-sm text-ink-500 mb-5">AI-assisted analysis of sensor patterns. Not a disease diagnosis.</p>

        <div className="p-4 bg-honey-50 border border-honey-200 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-honey-100 text-honey-700 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-ink-900">⚠ Hive 15 — Elevated temperature and humidity detected</p>
            <p className="text-sm text-ink-600 mt-1">Temperature 38.2°C and humidity 81% are outside normal range. Possible colony stress.</p>
            <div className="mt-3 p-3 bg-white rounded-lg border border-honey-200">
              <p className="text-xs font-semibold text-ink-700">Recommendation:</p>
              <p className="text-sm text-ink-800 mt-0.5">"Manual inspection required."</p>
            </div>
            <p className="text-xs text-ink-400 mt-2 italic">
              AI-assisted disease-risk screening. Not a definitive disease diagnosis.
            </p>
          </div>
        </div>
      </Card>

      {/* AI Image Screening */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-ink-900 mb-1 flex items-center gap-2">
          <Camera className="w-5 h-5 text-honey-500" />
          AI Image Screening
        </h3>
        <p className="text-sm text-ink-500 mb-5">Upload a hive image for simulated AI risk screening.</p>

        {!showScreening ? (
          <button onClick={handleUpload} className="w-full border-2 border-dashed border-ink-200 rounded-2xl p-10 text-center hover:border-honey-300 hover:bg-honey-50/50 transition-all group">
            <Upload className="w-8 h-8 text-ink-400 mx-auto mb-3 group-hover:text-honey-500 transition-colors" />
            <p className="font-semibold text-ink-700">Upload Hive Image</p>
            <p className="text-xs text-ink-400 mt-1">Click to simulate image upload and AI screening</p>
          </button>
        ) : (
          <div className="animate-pop">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                hive_15_sample.jpg
              </p>
              <button onClick={() => { setShowScreening(false); setScreeningResult(false); }} className="text-ink-400 hover:text-ink-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!screeningResult ? (
              <div className="p-8 text-center bg-ink-50 rounded-xl">
                <div className="w-10 h-10 border-3 border-honey-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: '3px' }} />
                <p className="text-sm text-ink-600">Analyzing image...</p>
              </div>
            ) : (
              <div className="p-5 bg-honey-50 border border-honey-200 rounded-xl animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-honey-100 text-honey-700 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-ink-900">Possible abnormality detected</p>
                    <p className="text-sm text-ink-600 mt-1">Confidence: <span className="font-bold text-honey-700">87%</span></p>
                    <div className="mt-3 p-3 bg-white rounded-lg border border-honey-200">
                      <p className="text-xs font-semibold text-ink-700">Recommendation:</p>
                      <p className="text-sm text-ink-800 mt-0.5">"Manual inspection required."</p>
                    </div>
                    <p className="text-xs text-ink-400 mt-2 italic">
                      Prototype AI screening. Not a definitive disease diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

function Sensor({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: string; alert?: boolean }) {
  return (
    <div className={`p-2.5 rounded-lg ${alert ? 'bg-honey-50' : 'bg-ink-50'}`}>
      <div className={`flex items-center gap-1.5 text-xs ${alert ? 'text-honey-700' : 'text-ink-400'}`}>
        {icon}
        {label}
      </div>
      <p className={`text-sm font-bold mt-0.5 ${alert ? 'text-honey-800' : 'text-ink-800'}`}>{value}</p>
    </div>
  );
}
