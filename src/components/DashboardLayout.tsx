import type { ReactNode } from 'react';
import { Link } from './Link';
import { Logo } from './ui';
import { useAuth } from '@/lib/auth';
import { useHashRoute } from '@/lib/router';
import {
  LayoutDashboard,
  Users,
  Trees,
  Home as HiveIcon,
  Droplets,
  Package,
  ShieldCheck,
  Link2,
  QrCode,
  MessageSquare,
  LogOut,
} from 'lucide-react';

const officerNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Beekeepers', icon: Users },
  { to: '/hives', label: 'Apiaries & Hives', icon: HiveIcon },
  { to: '/harvests', label: 'Harvests', icon: Droplets },
  { to: '/batches', label: 'Honey Batches', icon: Package },
  { to: '/blockchain', label: 'Blockchain', icon: Link2 },
  { to: '/batch/HC-001', label: 'QR Traceability', icon: QrCode },
];

const beekeeperNav = [
  { to: '/beekeeper', label: 'Assistant', icon: MessageSquare },
  { to: '/hives', label: 'My Hives', icon: HiveIcon },
  { to: '/harvests', label: 'My Harvests', icon: Droplets },
];

export function DashboardLayout({ children, current }: { children: ReactNode; current: string }) {
  const { profile, signOut } = useAuth();
  const { navigate } = useHashRoute();

  const nav = profile?.role === 'beekeeper' ? beekeeperNav : officerNav;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-ink-200/70 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-5 border-b border-ink-200/70">
          <Logo />
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-ink-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-honey-50 text-honey-600 flex items-center justify-center font-display font-bold text-sm">
              {profile?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-900 truncate">{profile?.name || 'User'}</p>
              <p className="text-xs text-ink-400 capitalize">{profile?.role?.replace('_', ' ') || 'unknown'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider px-3 mb-2">
            {profile?.role === 'beekeeper' ? 'Beekeeper' : 'FPO Dashboard'}
          </p>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = current === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-honey-50 text-honey-700 border border-honey-200'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-honey-600' : 'text-ink-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-ink-200/70 space-y-2">
          {profile?.role === 'fpo_officer' && (
            <Link to="/beekeeper" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-forest-50 transition-colors">
              <MessageSquare className="w-4 h-4 text-forest-600" />
              Beekeeper Chat
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        <div className="px-8 py-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

export { Trees, ShieldCheck };
