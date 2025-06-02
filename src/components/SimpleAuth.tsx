
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { User, Session } from '@supabase/supabase-js';

interface SimpleAuthProps {
  onAuthChange: (user: User | null) => void;
}

const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        onAuthChange(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
        } else if (event === 'SIGNED_OUT') {
          toast.success("Successfully signed out!");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      onAuthChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at) {
          toast.success("Check your email for verification link!");
        } else {
          toast.success("Account created successfully!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      
      // Clear form on success
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Invalid email or password");
      } else if (error.message.includes('User already registered')) {
        toast.error("This email is already registered. Try signing in instead.");
      } else if (error.message.includes('Email not confirmed')) {
        toast.error("Please check your email and click the confirmation link before signing in.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out: " + error.message);
    }
  };

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              Signed in as: {user.email}
            </p>
            <p className="text-xs text-green-600">
              You can now upload files to Supabase Storage
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <h3 className="text-sm font-medium text-yellow-800 mb-3">
        Sign in to upload files to Supabase Storage
      </h3>
      <form onSubmit={handleAuth} className="space-y-3">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-sm"
        />
        <Input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            size="sm"
            className="flex-1"
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSignUp(!isSignUp)}
            className="flex-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </form>
      <div className="mt-3 text-xs text-yellow-700">
        {isSignUp ? 
          "Create a new account to start uploading files" : 
          "Sign in with your existing account"
        }
      </div>
    </div>
  );
};

export default SimpleAuth;
