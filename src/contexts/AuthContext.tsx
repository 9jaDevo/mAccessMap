import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../lib/database';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    } finally {
      // Always clear local state regardless of API response
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      // Redirect to auth page to ensure clean state
      navigate('/auth');
    }
  };

  const checkUserProfile = async (currentUser: User) => {
    try {
      const profile = await getUserProfile(currentUser.id);
      setIsAdmin(profile?.is_admin || false);
      return true;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Check if this is an authentication error
      if (error?.message?.includes('JWT') || 
          error?.message?.includes('token') || 
          error?.message?.includes('expired') ||
          error?.message?.includes('invalid') ||
          error?.code === 'PGRST301' || // PostgREST JWT expired
          error?.code === 'PGRST302') { // PostgREST JWT invalid
        
        console.warn('Authentication token appears to be invalid, signing out user');
        await handleSignOut();
        return false;
      }
      
      // For other errors, just set admin to false but keep user logged in
      setIsAdmin(false);
      return true;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status if user exists
        if (session?.user) {
          await checkUserProfile(session.user);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle different auth events
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          setIsAdmin(false);
          setLoading(false);
          navigate('/auth');
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profileCheckSuccess = await checkUserProfile(session.user);
            if (!profileCheckSuccess) {
              // User was signed out due to invalid token
              setLoading(false);
              return;
            }
          } else {
            setIsAdmin(false);
          }
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await handleSignOut();
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};