import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../lib/database';
import { showToast } from '../components/Toaster';
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
  const [initialSessionProcessed, setInitialSessionProcessed] = useState(false);
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

  // Improved sign out function with better error handling and shorter timeout
  const handleSignOut = useCallback(async () => {
    console.log('AuthContext: Starting sign out process');
    
    try {
      // Show immediate feedback to user
      showToast('info', 'Signing out...');
      
      // Clear local state immediately to provide instant feedback
      clearAuthState();
      
      // Navigate immediately to prevent user from being stuck
      navigate('/auth');
      
      // Try to sign out from Supabase with a shorter timeout
      console.log('AuthContext: Attempting Supabase sign out...');
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timeout')), 5000); // Reduced to 5 seconds
      });
      
      try {
        const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
        
        if (error) {
          console.warn('AuthContext: Supabase sign out returned error:', error);
          // Don't show error to user since local state is already cleared
        } else {
          console.log('AuthContext: Supabase sign out successful');
        }
      } catch (timeoutError) {
        console.warn('AuthContext: Supabase sign out timed out, but local state already cleared');
        // This is acceptable since we've already cleared local state
      }
      
      showToast('success', 'Successfully signed out');
      
    } catch (error) {
      console.error('AuthContext: Unexpected error during sign out:', error);
      // Even if there's an error, ensure local state is cleared
      clearAuthState();
      navigate('/auth');
      showToast('success', 'Signed out locally');
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
        console.log('AuthContext: Setting loading to false and marking initial session as processed');
        setLoading(false);
        setInitialSessionProcessed(true);
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
        
        // Skip INITIAL_SESSION events after the first one to prevent loops
        if (event === 'INITIAL_SESSION') {
          if (initialSessionProcessed) {
            console.log('AuthContext: Skipping duplicate INITIAL_SESSION event');
            return;
          }
          console.log('AuthContext: Processing first INITIAL_SESSION event');
          setInitialSessionProcessed(true);
        }
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_OUT':
              console.log('AuthContext: User signed out');
              clearAuthState();
              navigate('/auth');
              showToast('success', 'You have been signed out successfully');
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
                showToast('success', 'Successfully signed in');
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
              
            case 'INITIAL_SESSION':
              console.log('AuthContext: Initial session event');
              // This is handled in the initialization effect above
              // We don't need to do anything here to prevent duplicate processing
              break;
              
            default:
              console.log('AuthContext: Unhandled auth event:', event);
          }
        } catch (error) {
          console.error('AuthContext: Error handling auth state change:', error);
          clearAuthState();
          showToast('error', 'Authentication error occurred');
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth state change listener');
      subscription.unsubscribe();
    };
  }, [clearAuthState, checkUserProfile, navigate, initialSessionProcessed]);

  // Memoize the signUp function
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    console.log('AuthContext: Starting sign up for:', email);
    setLoading(true);
    
    try {
      showToast('info', 'Creating your account...');
      
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
        showToast('error', error.message);
        throw error;
      }
      
      console.log('AuthContext: Sign up successful');
      showToast('success', 'Account created successfully!');
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
      showToast('info', 'Signing you in...');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        showToast('error', error.message);
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
    } catch (error) {
      console.error('AuthContext: Sign out process failed:', error);
      showToast('error', 'Error during sign out process');
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
    userId: user?.id,
    initialSessionProcessed
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};