import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUserProfile, type UserProfile } from '../lib/database';
import { showToast } from '../components/Toaster';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch profile and admin flag
  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile || null);
      setIsAdmin(profile?.is_admin ?? false);
    } catch {
      setUserProfile(null);
      setIsAdmin(false);
    }
  }, []);

  // Central handler for all auth events
  const handleAuthEvent = useCallback(async (event: string, sess: Session | null) => {
    console.log('[Auth] event:', event, sess);
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_FAILED') {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      setLoading(false);
      navigate('/auth');
      return;
    }

    if (sess?.user) {
      setSession(sess);
      setUser(sess.user);
      await fetchProfile(sess.user);
    } else {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    }

    setLoading(false);
  }, [fetchProfile, navigate]);

  useEffect(() => {
    // Subscribe once
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sess) => { handleAuthEvent(event, sess); }
    );

    // Trigger initial session event
    supabase.auth.getSession()
      .then(({ data: { session } }) => handleAuthEvent('INITIAL_SESSION', session))
      .catch(err => {
        console.error('[Auth] getSession error', err);
        setLoading(false);
      });

    return () => { subscription.unsubscribe(); };
  }, [handleAuthEvent]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    showToast('info', 'Creating account...');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) showToast('error', error.message);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    showToast('info', 'Signing in...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showToast('error', error.message);
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    showToast('info', 'Signing out...');
    await supabase.auth.signOut();
    // onAuthStateChange will handle state clear
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    userProfile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  }), [user, session, userProfile, loading, isAdmin, signUp, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
