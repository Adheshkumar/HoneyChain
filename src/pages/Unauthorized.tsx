import { Link } from '@/components/Link';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function Unauthorized() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>

      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink-900">Access Denied</h1>
        <p className="text-sm text-ink-500 mt-2">
          {profile
            ? `Your role (${profile.role.replace('_', ' ')}) does not have access to this section.`
            : 'Please sign in to access this section.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          {profile ? (
            <button onClick={() => signOut()} className="btn-ghost">
              Sign out
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
