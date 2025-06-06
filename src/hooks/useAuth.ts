import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role from database
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'buyer'; // Default to buyer if error
      }

      return data?.role || 'buyer';
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return 'buyer'; // Default to buyer if any exception
    }
  };

  // Function to update user's metadata with their role
  const updateUserMetadata = async (userId: string, role: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { role }
      });

      if (error) {
        console.error('Error updating user metadata:', error);
      }
    } catch (error) {
      console.error('Error in updateUserMetadata:', error);
    }
  };

  // Function to get a user with their role
  const getUserWithRole = async (currentUser: User): Promise<User> => {
    // If user already has role in metadata, return as is
    if (currentUser.user_metadata?.role) {
      return currentUser;
    }

    // Otherwise fetch role and update metadata
    const role = await fetchUserRole(currentUser.id);
    await updateUserMetadata(currentUser.id, role);
    
    // Return updated user
    return {
      ...currentUser,
      user_metadata: {
        ...currentUser.user_metadata,
        role
      }
    };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const userWithRole = await getUserWithRole(session.user);
          setUser(userWithRole);
        } else {
          setUser(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
        } else if (event === 'SIGNED_OUT') {
          toast.success("Successfully signed out!");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const userWithRole = await getUserWithRole(session.user);
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password' };
      } else if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please check your email and click the confirmation link before signing in' };
      } else {
        return { success: false, error: error.message };
      }
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Magic link error:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use the most basic implementation
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'buyer', // Set default role to buyer
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.message.includes('User already registered')) {
        return { success: false, error: 'This email is already registered. Try signing in instead.' };
      } else {
        return { success: false, error: error.message };
      }
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    const userRole = user.user_metadata?.role || 'buyer';
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signInWithMagicLink,
    signInWithGoogle,
    signUp,
    signOut,
    hasRole,
  };
};
