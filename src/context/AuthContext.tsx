import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface OwnerAccount {
  id: string;
  email: string;
  role: 'primary-owner' | 'owner';
  createdAt: string;
}

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
  currentOwner: OwnerAccount | null;
  owners: OwnerAccount[];
  authError: string;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshOwners: () => Promise<void>;
  addOwner: (email: string) => Promise<{ success: boolean; message: string }>;
  removeOwner: (id: string) => Promise<{ success: boolean; message: string }>;
  updateOwnerPassword: () => Promise<{ success: boolean; message: string }>;
}

type AdminRow = {
  id: string;
  email: string;
  role?: string | null;
  created_at?: string | null;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const rowToOwner = (row: AdminRow): OwnerAccount => ({
  id: row.id,
  email: normalizeEmail(row.email),
  role: row.role === 'primary-owner' ? 'primary-owner' : 'owner',
  createdAt: row.created_at || new Date().toISOString(),
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentOwner, setCurrentOwner] = useState<OwnerAccount | null>(null);
  const [owners, setOwners] = useState<OwnerAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const refreshOwners = useCallback(async () => {
    if (!supabase || !currentOwner) return;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id,email,role,created_at')
      .order('created_at', { ascending: true });

    if (error) {
      setAuthError(`Could not load owner access list: ${error.message}`);
      return;
    }

    setOwners((data || []).map(row => rowToOwner(row as AdminRow)));
  }, [currentOwner]);

  const verifyAdmin = useCallback(async (activeUser: User | null) => {
    if (!supabase || !activeUser?.email) {
      setCurrentOwner(null);
      setOwners([]);
      return null;
    }

    const email = normalizeEmail(activeUser.email);
    const { data, error } = await supabase
      .from('admin_users')
      .select('id,email,role,created_at')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      setAuthError(`Admin authorization check failed: ${error.message}`);
      setCurrentOwner(null);
      setOwners([]);
      return null;
    }

    if (!data) {
      await supabase.auth.signOut();
      setAuthError('This account is not authorized as an EMOREV admin.');
      setCurrentOwner(null);
      setOwners([]);
      return null;
    }

    const owner = rowToOwner(data as AdminRow);
    setCurrentOwner(owner);
    setAuthError('');

    const { data: ownerRows } = await supabase
      .from('admin_users')
      .select('id,email,role,created_at')
      .order('created_at', { ascending: true });

    setOwners((ownerRows || []).map(row => rowToOwner(row as AdminRow)));
    return owner;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
      return;
    }

    let cancelled = false;

    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return;
      setUser(data.user);
      await verifyAdmin(data.user);
      if (!cancelled) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      verifyAdmin(session?.user || null).finally(() => setLoading(false));
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }

    const owner = await verifyAdmin(data.user);
    setLoading(false);

    if (!owner) {
      return { success: false, message: 'Login worked, but this user is not in the EMOREV admin_users table.' };
    }

    return { success: true, message: 'Welcome back, EMOREV owner.' };
  }, [verifyAdmin]);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setCurrentOwner(null);
    setOwners([]);
  }, []);

  const addOwner = useCallback(async (email: string) => {
    if (!supabase || !currentOwner) {
      return { success: false, message: 'Only an authenticated admin can add owner access.' };
    }

    const normalized = normalizeEmail(email);
    if (!normalized.includes('@') || !normalized.includes('.')) {
      return { success: false, message: 'Enter a valid email address.' };
    }

    const { error } = await supabase.from('admin_users').insert({
      email: normalized,
      role: 'owner',
    });

    if (error) return { success: false, message: error.message };
    await refreshOwners();
    return { success: true, message: `${normalized} is now authorized as an EMOREV owner. Create/invite this user in Supabase Auth so they can log in.` };
  }, [currentOwner, refreshOwners]);

  const removeOwner = useCallback(async (id: string) => {
    if (!supabase || !currentOwner) {
      return { success: false, message: 'Only an authenticated admin can remove owner access.' };
    }

    const target = owners.find(owner => owner.id === id);
    if (target?.role === 'primary-owner') {
      return { success: false, message: 'Primary owner access cannot be removed from the dashboard.' };
    }

    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) return { success: false, message: error.message };
    await refreshOwners();
    return { success: true, message: 'Owner access removed.' };
  }, [currentOwner, owners, refreshOwners]);

  const updateOwnerPassword = useCallback(async () => {
    return {
      success: false,
      message: 'Passwords are managed securely in Supabase Authentication, not in the website frontend.',
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      isAdmin: Boolean(currentOwner),
      loading,
      user,
      currentOwner,
      owners,
      authError,
      login,
      logout,
      refreshOwners,
      addOwner,
      removeOwner,
      updateOwnerPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};