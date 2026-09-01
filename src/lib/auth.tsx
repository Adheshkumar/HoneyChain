import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export type Role = 'fpo_officer' | 'beekeeper' | 'consumer';

export interface Profile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role: Role;
  beekeeper_id: string | null;
  verification_status: string;
  fpo_id: string | null;
}

interface DemoUser {
  email: string;
  password: string;
  profile: Profile;
}

interface AuthState {
  session: { user: { id: string; email: string } } | null;
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const DEMO_USERS: DemoUser[] = [
  {
    email: 'officer@honeychain.demo',
    password: 'HoneyChain@123',
    profile: {
      id: 'profile-officer-001',
      auth_user_id: 'user-officer-001',
      name: 'KVIC / FPO Officer',
      email: 'officer@honeychain.demo',
      role: 'fpo_officer',
      beekeeper_id: null,
      verification_status: 'verified',
      fpo_id: 'FPO-001',
    },
  },
  {
    email: 'beekeeper@honeychain.demo',
    password: 'HoneyChain@123',
    profile: {
      id: 'profile-beekeeper-001',
      auth_user_id: 'user-beekeeper-001',
      name: 'Ravi Kumar',
      email: 'beekeeper@honeychain.demo',
      role: 'beekeeper',
      beekeeper_id: 'BK-001',
      verification_status: 'verified',
      fpo_id: 'FPO-001',
    },
  },
  {
    email: 'consumer@honeychain.demo',
    password: 'HoneyChain@123',
    profile: {
      id: 'profile-consumer-001',
      auth_user_id: 'user-consumer-001',
      name: 'Honey Chain Consumer',
      email: 'consumer@honeychain.demo',
      role: 'consumer',
      beekeeper_id: null,
      verification_status: 'verified',
      fpo_id: null,
    },
  },
];

const STORAGE_KEY = 'honeychain_demo_user';

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildSession = useCallback((p: Profile | null) => {
    if (!p) return null;

    return {
      user: {
        id: p.auth_user_id,
        email: p.email,
      },
    };
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (savedUser) {
      try {
        const savedProfile = JSON.parse(savedUser) as Profile;
        setProfile(savedProfile);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);

      const normalizedEmail = email.trim().toLowerCase();

      const demoUser = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail &&
          u.password === password
      );

      if (!demoUser) {
        const msg = 'Invalid email or password.';
        setError(msg);
        return {
          success: false,
          error: msg,
        };
      }

      setProfile(demoUser.profile);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(demoUser.profile)
      );

      return { success: true };
    },
    []
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const user = profile
    ? {
        id: profile.auth_user_id,
        email: profile.email,
      }
    : null;

  const session = buildSession(profile);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}