import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react'; import { useNavigate } from 'react-router-dom'; import { supabase } from '../lib/supabase'; import { getUserProfile } from '../lib/database'; import { showToast } from '../components/Toaster'; import type { User, Session } from '@supabase/supabase-js';
interface AuthContextType {
user: User | null;
session: Session | null;
loading: boolean;
isAdmin: boolean;
signUp: (email: string, password: string, fullName: string) => Promise;
signIn: (email: string, password: string) => Promise;
signOut: () => Promise;
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

export const AuthProvider: React.FC = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [loading, setLoading] = useState(true);
const [isAdmin, setIsAdmin] = useState(false);
const [initialSessionProcessed, setInitialSessionProcessed] = useState(false);
const navigate = useNavigate();

// Memoize the clearAuthState function
const clearAuthState = useCallback(() => {
console.log('AuthContext: Clearing authentication state');
console.log('AuthContext: Previous isAdmin state before clearing:', isAdmin);
setSession(null);
setUser(null);
setIsAdmin(false);
console.log('AuthContext: isAdmin state after clearing: false');
}, [isAdmin]);

// Memoize the checkUserProfile function
const checkUserProfile = useCallback(async (currentUser: User): Promise => {
console.log('AuthContext: [checkUserProfile] Starting profile check for user:', currentUser.id);
console.log('AuthContext: [checkUserProfile] Current isAdmin state before check:', isAdmin);


try {
  const profile = await getUserProfile(currentUser.id);
  
  if (profile) {
    console.log('AuthContext: [checkUserProfile] Profile found:', {
      userId: profile.id,
      fullName: profile.full_name,
      isAdmin: profile.is_admin,
      totalReviews: profile.total_reviews
    });
    
    const newAdminStatus = profile.is_admin || false;
    console.log('AuthContext: [checkUserProfile] Setting isAdmin to:', newAdminStatus);
    console.log('AuthContext: [checkUserProfile] Previous isAdmin was:', isAdmin);
    
    setIsAdmin(newAdminStatus);
    
    console.log('AuthContext: [checkUserProfile] isAdmin state updated successfully');
    return true;
  } else {
    console.warn('AuthContext: [checkUserProfile] No profile found for user');
    console.log('AuthContext: [checkUserProfile] Setting isAdmin to false (no profile)');
    setIsAdmin(false);
    return true;
  }
} catch (error: any) {
  console.error('AuthContext: [checkUserProfile] Error fetching user profile:', error);
  console.log('AuthContext: [checkUserProfile] Error details:', {
    message: error?.message,
    code: error?.code,
    name: error?.name
  });
  
  // Check if this is an authentication error
  const isAuthError = error?.message?.includes('JWT') || 
                     error?.message?.includes('token') || 
                     error?.message?.includes('expired') ||
                     error?.message?.includes('invalid') ||
                     error?.code === 'PGRST301' || // PostgREST JWT expired
                     error?.code === 'PGRST302';   // PostgREST JWT invalid
  
  if (isAuthError) {
    console.warn('AuthContext: [checkUserProfile] Authentication token appears to be invalid, signing out user');
    await handleSignOut();
    return false;
  }
  
  // For other errors, just set admin to false but keep user logged in
  console.warn('AuthContext: [checkUserProfile] Non-auth error, setting isAdmin to false');
  setIsAdmin(false);
  return true;
}
}, [isAdmin]);

// Improved sign out function with better error handling and shorter timeout
const handleSignOut = useCallback(async () => {
console.log('AuthContext: [handleSignOut] Starting sign out process');
console.log('AuthContext: [handleSignOut] Current isAdmin state:', isAdmin);


try {
  // Show immediate feedback to user
  showToast('info', 'Signing out...');
  
  // Clear local state immediately to provide instant feedback
  clearAuthState();
  
  // Navigate immediately to prevent user from being stuck
  navigate('/auth');
  
  // Try to sign out from Supabase with a shorter timeout
  console.log('AuthContext: [handleSignOut] Attempting Supabase sign out...');
  const signOutPromise = supabase.auth.signOut();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Sign out timeout')), 5000); // Reduced to 5 seconds
  });
  
  try {
    const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
    
    if (error) {
      console.warn('AuthContext: [handleSignOut] Supabase sign out returned error:', error);
      // Don't show error to user since local state is already cleared
    } else {
      console.log('AuthContext: [handleSignOut] Supabase sign out successful');
    }
  } catch (timeoutError) {
    console.warn('AuthContext: [handleSignOut] Supabase sign out timed out, but local state already cleared');
    // This is acceptable since we've already cleared local state
  }
  
  showToast('success', 'Successfully signed out');
  
} catch (error) {
  console.error('AuthContext: [handleSignOut] Unexpected error during sign out:', error);
  // Even if there's an error, ensure local state is cleared
  clearAuthState();
  navigate('/auth');
  showToast('success', 'Signed out locally');
}
}, [clearAuthState, navigate, isAdmin]);

// Initialize authentication state
useEffect(() => {
console.log('AuthContext: [useEffect-init] Initializing authentication state');


const initializeAuth = async () => {
  try {
    console.log('AuthContext: [initializeAuth] Getting initial session');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('AuthContext: [initializeAuth] Error getting initial session:', error);
      clearAuthState();
      return;
    }

    if (session?.user) {
      console.log('AuthContext: [initializeAuth] Initial session found for user:', session.user.id);
      setSession(session);
      setUser(session.user);
      
      // Check admin status
      console.log('AuthContext: [initializeAuth] Checking admin status for initial session');
      const profileCheckSuccess = await checkUserProfile(session.user);
      if (!profileCheckSuccess) {
        console.log('AuthContext: [initializeAuth] Profile check failed, user was signed out');
        return;
      }
    } else {
      console.log('AuthContext: [initializeAuth] No initial session found');
      clearAuthState();
    }
  } catch (error) {
    console.error('AuthContext: [initializeAuth] Unexpected error during initialization:', error);
    clearAuthState();
  } finally {
    console.log('AuthContext: [initializeAuth] Setting loading to false and marking initial session as processed');
    setLoading(false);
    setInitialSessionProcessed(true);
  }
};

initializeAuth();
}, [clearAuthState, checkUserProfile]);

// Listen for authentication state changes
useEffect(() => {
console.log('AuthContext: [useEffect-listener] Setting up auth state change listener');


const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    console.log('AuthContext: [onAuthStateChange] ===== AUTH STATE CHANGE EVENT =====');
    console.log('AuthContext: [onAuthStateChange] Event:', event);
    console.log('AuthContext: [onAuthStateChange] User ID:', session?.user?.id || 'no user');
    console.log('AuthContext: [onAuthStateChange] Current isAdmin state:', isAdmin);
    console.log('AuthContext: [onAuthStateChange] Initial session processed:', initialSessionProcessed);
    
    // Skip INITIAL_SESSION events after the first one to prevent loops
    if (event === 'INITIAL_SESSION') {
      if (initialSessionProcessed) {
        console.log('AuthContext: [onAuthStateChange] Skipping duplicate INITIAL_SESSION event');
        return;
      }
      console.log('AuthContext: [onAuthStateChange] Processing first INITIAL_SESSION event');
      setInitialSessionProcessed(true);
    }
    
    try {
      // Handle different auth events
      switch (event) {
        case 'SIGNED_OUT':
          console.log('AuthContext: [onAuthStateChange] SIGNED_OUT event - clearing state');
          clearAuthState();
          navigate('/auth');
          showToast('success', 'You have been signed out successfully');
          break;
          
        case 'SIGNED_IN':
          console.log('AuthContext: [onAuthStateChange] SIGNED_IN event');
          if (session?.user) {
            console.log('AuthContext: [onAuthStateChange] Setting user and session for SIGNED_IN');
            setSession(session);
            setUser(session.user);
            
            console.log('AuthContext: [onAuthStateChange] Checking profile for SIGNED_IN user');
            const profileCheckSuccess = await checkUserProfile(session.user);
            if (!profileCheckSuccess) {
              console.log('AuthContext: [onAuthStateChange] Profile check failed during sign in');
              return;
            }
            showToast('success', 'Successfully signed in');
          } else {
            console.warn('AuthContext: [onAuthStateChange] SIGNED_IN event but no user in session');
            clearAuthState();
          }
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('AuthContext: [onAuthStateChange] TOKEN_REFRESHED event');
          if (session?.user) {
            console.log('AuthContext: [onAuthStateChange] Updating session for TOKEN_REFRESHED');
            setSession(session);
            setUser(session.user);
            
            // Re-check profile in case admin status changed
            console.log('AuthContext: [onAuthStateChange] Re-checking profile after token refresh');
            const profileCheckSuccess = await checkUserProfile(session.user);
            if (!profileCheckSuccess) {
              console.log('AuthContext: [onAuthStateChange] Profile check failed during token refresh');
              return;
            }
          } else {
            console.warn('AuthContext: [onAuthStateChange] TOKEN_REFRESHED but no session, signing out');
            clearAuthState();
            navigate('/auth');
          }
          break;
          
        case 'USER_UPDATED':
          console.log('AuthContext: [onAuthStateChange] USER_UPDATED event');
          if (session?.user) {
            console.log('AuthContext: [onAuthStateChange] Updating user for USER_UPDATED');
            setSession(session);
            setUser(session.user);
            
            // Re-check profile in case admin status changed
            console.log('AuthContext: [onAuthStateChange] Re-checking profile after user update');
            const profileCheckSuccess = await checkUserProfile(session.user);
            if (!profileCheckSuccess) {
              console.log('AuthContext: [onAuthStateChange] Profile check failed during user update');
              return;
            }
          }
          break;
          
        case 'INITIAL_SESSION':
          console.log('AuthContext: [onAuthStateChange] INITIAL_SESSION event - handled in initialization');
          // This is handled in the initialization effect above
          // We don't need to do anything here to prevent duplicate processing
          break;
          
        default:
          console.log('AuthContext: [onAuthStateChange] Unhandled auth event:', event);
      }
    } catch (error) {
      console.error('AuthContext: [onAuthStateChange] Error handling auth state change:', error);
      clearAuthState();
      showToast('error', 'Authentication error occurred');
    } finally {
      setLoading(false);
      console.log('AuthContext: [onAuthStateChange] ===== END AUTH STATE CHANGE EVENT =====');
    }
  }
);

return () => {
  console.log('AuthContext: [useEffect-listener] Cleaning up auth state change listener');
  subscription.unsubscribe();
};
}, [clearAuthState, checkUserProfile, navigate, initialSessionProcessed, isAdmin]);

// Memoize the signUp function with detailed logging
const signUp = useCallback(async (email: string, password: string, fullName: string) => {
console.log('AuthContext: [signUp] Starting sign up process');
console.log('AuthContext: [signUp] Sign up email:', email);
console.log('AuthContext: [signUp] Sign up full name:', fullName);
console.log('AuthContext: [signUp] Password length:', password.length);


setLoading(true);

try {
  showToast('info', 'Creating your account...');
  
  console.log('AuthContext: [signUp] Calling supabase.auth.signUp...');
  const startTime = Date.now();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  const endTime = Date.now();
  console.log('AuthContext: [signUp] supabase.auth.signUp completed in', endTime - startTime, 'ms');
  console.log('AuthContext: [signUp] Sign up response data:', data);
  console.log('AuthContext: [signUp] Sign up response error:', error);
  
  if (error) {
    console.error('AuthContext: [signUp] Sign up error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    showToast('error', error.message);
    throw error;
  }
  
  console.log('AuthContext: [signUp] Sign up successful');
  console.log('AuthContext: [signUp] User created:', data.user?.id);
  console.log('AuthContext: [signUp] Session created:', !!data.session);
  showToast('success', 'Account created successfully!');
} catch (error) {
  console.error('AuthContext: [signUp] Sign up failed:', error);
  throw error;
} finally {
  setLoading(false);
}
}, []);

// Memoize the signIn function with detailed logging
const signIn = useCallback(async (email: string, password: string) => {
console.log('AuthContext: [signIn] Starting sign in process');
console.log('AuthContext: [signIn] Sign in email:', email);
console.log('AuthContext: [signIn] Password length:', password.length);


setLoading(true);

try {
  showToast('info', 'Signing you in...');
  
  console.log('AuthContext: [signIn] Calling supabase.auth.signInWithPassword...');
  const startTime = Date.now();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  const endTime = Date.now();
  console.log('AuthContext: [signIn] supabase.auth.signInWithPassword completed in', endTime - startTime, 'ms');
  console.log('AuthContext: [signIn] Sign in response data:', data);
  console.log('AuthContext: [signIn] Sign in response error:', error);
  
  if (error) {
    console.error('AuthContext: [signIn] Sign in error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    showToast('error', error.message);
    throw error;
  }
  
  console.log('AuthContext: [signIn] Sign in successful');
  console.log('AuthContext: [signIn] User signed in:', data.user?.id);
  console.log('AuthContext: [signIn] Session created:', !!data.session);
} catch (error) {
  console.error('AuthContext: [signIn] Sign in failed:', error);
  throw error;
} finally {
  setLoading(false);
}
}, []);

// Memoize the signOut function
const signOut = useCallback(async () => {
console.log('AuthContext: [signOut] Sign out requested');
setLoading(true);


try {
  await handleSignOut();
} catch (error) {
  console.error('AuthContext: [signOut] Sign out process failed:', error);
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

console.log('AuthContext: [render] Rendering with state:', {
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
