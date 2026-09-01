import { useEffect } from 'react';
import { StoreProvider } from '@/lib/store';
import { AuthProvider, useAuth, type Role } from '@/lib/auth';
import { useHashRoute } from '@/lib/router';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Onboarding } from '@/pages/Onboarding';
import { Beekeeper } from '@/pages/Beekeeper';
import { Dashboard } from '@/pages/Dashboard';
import { Hives } from '@/pages/Hives';
import { Harvests } from '@/pages/Harvests';
import { Batches } from '@/pages/Batches';
import { Blockchain } from '@/pages/Blockchain';
import { BatchDetail } from '@/pages/BatchDetail';
import { Unauthorized } from '@/pages/Unauthorized';

const officerRoutes = ['/dashboard', '/onboarding', '/hives', '/harvests', '/batches', '/blockchain'];
const beekeeperRoutes = ['/beekeeper', '/hives', '/harvests'];
const consumerRoutes = ['/batch/HC-001'];

function roleCanAccess(role: Role | null, path: string, segments: string[]): boolean {
  if (segments[0] === 'batch') return true; // public
  if (path === '/login' || path === '/' || path === '') return true;

  if (!role) return false;

  if (role === 'fpo_officer') return officerRoutes.includes(path);
  if (role === 'beekeeper') return beekeeperRoutes.includes(path);
  if (role === 'consumer') return consumerRoutes.includes(path) || segments[0] === 'batch';
  return false;
}

function RouterInner() {
  const { route, navigate } = useHashRoute();
  const { profile, loading } = useAuth();

  const path = route.path;
  const segments = route.segments;
  const isPublicRoute = segments[0] === 'batch' || path === '/' || path === '' || path === '/login';

  // Redirect to login if accessing protected route without auth
  useEffect(() => {
    if (!loading && !profile && !isPublicRoute) {
      navigate('/login');
    }
  }, [loading, profile, isPublicRoute, navigate]);

  // If still loading auth state, show nothing (prevents flash)
  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-honey-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '2px' }} />
      </div>
    );
  }

  // Check role-based access
  if (profile && !roleCanAccess(profile.role, path, segments) && !isPublicRoute) {
    return <Unauthorized />;
  }

  if (path === '/' || path === '') return <Home />;
  if (path === '/login') return <Login />;
  if (path === '/onboarding') return <Onboarding />;
  if (path === '/beekeeper') return <Beekeeper />;
  if (path === '/dashboard') return <Dashboard />;
  if (path === '/hives') return <Hives />;
  if (path === '/harvests') return <Harvests />;
  if (path === '/batches') return <Batches />;
  if (path === '/blockchain') return <Blockchain />;
  if (segments[0] === 'batch') return <BatchDetail batchId={segments[1] || 'HC-001'} />;

  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterInner />
      </StoreProvider>
    </AuthProvider>
  );
}
