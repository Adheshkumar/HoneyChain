import { useState } from 'react';
import { Link } from '@/components/Link';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useHashRoute } from '@/lib/router';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, UserCheck, ScanLine, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const demoAccounts = [
  { role: 'fpo_officer', label: 'FPO / KVIC Officer', email: 'officer@honeychain.demo', icon: ShieldCheck, color: 'honey' },
  { role: 'beekeeper', label: 'Beekeeper', email: 'beekeeper@honeychain.demo', icon: UserCheck, color: 'forest' },
  { role: 'consumer', label: 'Consumer', email: 'consumer@honeychain.demo', icon: ScanLine, color: 'ink' },
];

const roleRedirects: Record<string, string> = {
  fpo_officer: '/dashboard',
  beekeeper: '/beekeeper',
  consumer: '/batch/HC-001',
};

export function Login() {
  const { signIn, error, clearError, profile } = useAuth();
  const { navigate } = useHashRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setLocalError(null);
    clearError();

    const result = await signIn(email, password);

    if (result.success) {
      const role = profile?.role;
      const { data: fetchedProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      const redirectTo = roleRedirects[fetchedProfile?.role || role || 'consumer'] || '/batch/HC-001';
      navigate(redirectTo);
    } else {
      setLocalError(result.error || 'Sign in failed.');
    }
    setLoading(false);
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('HoneyChain@123');
    setLocalError(null);
    clearError();
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-ink-900">Sign in to HONEYCHAIN</h1>
          <p className="text-sm text-ink-500 mt-2">Enter your credentials to access your dashboard.</p>
        </div>

        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@honeychain.demo"
              className="input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo accounts panel */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-ink-200" />
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Demo Accounts</p>
            <div className="flex-1 h-px bg-ink-200" />
          </div>
          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                onClick={() => fillDemoAccount(acc.email)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-ink-200 hover:border-honey-300 hover:bg-honey-50/50 transition-all text-left"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${acc.color === 'honey' ? 'bg-honey-50 text-honey-600' : acc.color === 'forest' ? 'bg-forest-50 text-forest-600' : 'bg-ink-100 text-ink-600'}`}>
                  <acc.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-800">{acc.label}</p>
                  <p className="text-xs text-ink-400 font-mono">{acc.email}</p>
                </div>
                <span className="text-xs text-honey-600 font-semibold">Fill</span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-ink-400 mt-3">
            Click a role above to auto-fill credentials, then press Sign In.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/batch/HC-001" className="text-sm text-honey-600 font-semibold hover:text-honey-700">
            Explore public batch without login
          </Link>
        </div>

        <p className="text-center text-xs text-ink-400 mt-4">
          Production deployment uses FPO/KVIC-assisted authentication. Sensitive identity documents are not stored on-chain.
        </p>
      </div>
    </div>
  );
}
