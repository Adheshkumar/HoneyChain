<<<<<<< HEAD
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
=======
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6

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

<<<<<<< HEAD
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
=======
interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
  signOut: () => Promise<void>;
  clearError: () => void;
}

<<<<<<< HEAD
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
=======
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
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
=======
  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', uid)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
    return data as Profile | null;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    let mounted = true;
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (!mounted) return;
      if (newSession?.user) {
        setTimeout(() => {
          if (mounted) {
            fetchProfile(newSession.user.id).then((p) => {
              if (mounted) setProfile(p);
            });
          }
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const raw = signInError.message;
      let msg: string;
      if (raw.includes('Invalid login')) {
        msg = 'Invalid email or password. If this is a demo account, it may not have been configured in Supabase Auth yet. Please contact the administrator.';
      } else if (raw.includes('Email not confirmed')) {
        msg = 'Email not confirmed. Please check your inbox for a confirmation link.';
      } else {
        msg = raw;
      }
      setError(msg);
      return { success: false, error: msg };
    }

    if (data.user) {
      const p = await fetchProfile(data.user.id);
      setProfile(p);
    }

    return { success: true };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, error, signIn, signOut, clearError }}>
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
<<<<<<< HEAD

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
=======
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
>>>>>>> 55c13742b2b40ab37ad8e0da10183586db2d41d6
