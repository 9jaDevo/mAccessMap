import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
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

  // Memoize the clearAuthState function
  const clearAuthState = useCallback(() => {
    console.log('AuthContext: Clearing authentication state');
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  }, []);

  // Memoize the checkUserProfile function
  const checkUserProfile = useCallback(async (currentUser: User): Promise<boolean> => {
    console.log('AuthContext: Checking user profile for:', currentUser.id);
    
    try {
      const profile = await getUserProfile(currentUser.id);
      
      if (profile) {
        console.log('AuthContext: Profile found, admin status:', profile.is_admin);
        setIsAdmin(profile.is_admin || false);
        return true;
      } else {
        console.warn('AuthContext: No profile found for user');
        setIsAdmin(false);
        return true;
      }
    } catch (error: any) {
      console.error('AuthContext: Error fetching user profile:', error);
      
      // Check if this is an authentication error
      const isAuthError = error?.message?.includes('JWT') || 
                         error?.message?.includes('token') || 
                         error?.message?.includes('expired') ||
                         error?.message?.includes('invalid') ||
                         error?.code === 'PGRST301' || // PostgREST JWT expired
                         error?.code === 'PGRST302';   // PostgREST JWT invalid
      
      if (isAuthError) {
        console.warn('AuthContext: Authentication token appears to be invalid, signing out user');
        await handleSignOut();
        return false;
      }
      
      // For other errors, just set admin to false but keep user logged in
      console.warn('AuthContext: Non-auth error, setting admin to false');
      setIsAdmin(false);
      return true;
    }
  }, []);

  // Memoize the handleSignOut function
  const handleSignOut = useCallback(async () => {
    console.log('AuthContext: Starting sign out process');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Error during Supabase sign out:', error);
      } else {
        console.log('AuthContext: Supabase sign out successful');
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error during sign out:', error);
    } finally {
      // Always clear local state regardless of API response
      clearAuthState();
      console.log('AuthContext: Redirecting to auth page');
      navigate('/auth');
    }
  }, [clearAuthState, navigate]);

  // Initialize authentication state
  useEffect(() => {
    console.log('AuthContext: Initializing authentication state');
    
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
          clearAuthState();
          return;
        }

        if (session?.user) {
          console.log('AuthContext: Initial session found for user:', session.user.id);
          setSession(session);
          setUser(session.user);
          
          // Check admin status
          const profileCheckSuccess = await checkUserProfile(session.user);
          if (!profileCheckSuccess) {
            console.log('AuthContext: Profile check failed, user was signed out');
            return;
          }
        } else {
          console.log('AuthContext: No initial session found');
          clearAuthState();
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error during initialization:', error);
        clearAuthState();
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthState, checkUserProfile]);

  // Listen for authentication state changes
  useEffect(() => {
    console.log('AuthContext: Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session?.user?.id || 'no user');
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_OUT':
              console.log('AuthContext: User signed out');
              clearAuthState();
              navigate('/auth');
              break;
              
            case 'SIGNED_IN':
              console.log('AuthContext: User signed in');
              if (session?.user) {
                setSession(session);
                setUser(session.user);
                
                const profileCheckSuccess = await checkUserProfile(session.user);
                if (!profileCheckSuccess) {
                  console.log('AuthContext: Profile check failed during sign in');
                  return;
                }
              } else {
                console.warn('AuthContext: SIGNED_IN event but no user in session');
                clearAuthState();
              }
              break;
              
            case 'TOKEN_REFRESHED':
              console.log('AuthContext: Token refreshed');
              if (session?.user) {
                setSession(session);
                setUser(session.user);
                
                // Re-check profile in case admin status changed
                const profileCheckSuccess = await checkUserProfile(session.user);
                if (!profileCheckSuccess) {
                  console.log('AuthContext: Profile check failed during token refresh');
                  return;
                }
              } else {
                console.warn('AuthContext: TOKEN_REFRESHED but no session, signing out');
                clearAuthState();
                navigate('/auth');
              }
              break;
              
            case 'USER_UPDATED':
              console.log('AuthContext: User updated');
              if (session?.user) {
                setSession(session);
                setUser(session.user);
              }
              break;
              
            default:
              console.log('AuthContext: Unhandled auth event:', event);
          }
        } catch (error) {
          console.error('AuthContext: Error handling auth state change:', error);
          clearAuthState();
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, [clearAuthState, checkUserProfile, navigate]);

  // Memoize the signUp function
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    console.log('AuthContext: Starting sign up for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('AuthContext: Sign up error:', error);
        throw error;
      }
      
      console.log('AuthContext: Sign up successful');
    } catch (error) {
      console.error('AuthContext: Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize the signIn function
  const signIn = useCallback(async (email: string, password: string) => {
    console.log('AuthContext: Starting sign in for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        throw error;
      }
      
      console.log('AuthContext: Sign in successful');
    } catch (error) {
      console.error('AuthContext: Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize the signOut function
  const signOut = useCallback(async () => {
    console.log('AuthContext: Sign out requested');
    setLoading(true);
    
    try {
      await handleSignOut();
    } finally {
      setLoading(false);
    }
  }, [handleSignOut]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, isAdmin, signUp, signIn, signOut]);

  console.log('AuthContext: Rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    isAdmin,
    userId: user?.id
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};