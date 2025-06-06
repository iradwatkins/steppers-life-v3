import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { Mail } from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";

const Register = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleContinueWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if email already exists
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
        }
      });
      
      if (error) {
        console.error('Error sending login email:', error);
        toast.error(error.message);
      } else {
        // Store email in localStorage to use in the next step
        localStorage.setItem('registration_email', email);
        
        // Show success message and navigate to login page
        toast.success('Email sent! Please check your inbox to continue registration.');
        navigate('/auth/login', { 
          state: { 
            message: 'Please check your email for the login link.' 
          } 
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        toast.error(result.error || 'Failed to sign in with Google');
      }
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
    } finally {
      setSocialLoading('');
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading('facebook');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to sign in with Facebook');
    } finally {
      setSocialLoading('');
    }
  };

  const handleAppleLogin = async () => {
    setSocialLoading('apple');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to sign in with Apple');
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-background-main flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-text-on-primary font-bold">SL</span>
            </div>
            <span className="font-serif font-semibold text-2xl text-text-primary">SteppersLife</span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-text-primary">
            Welcome to SteppersLife!
          </h2>
          <p className="mt-2 text-lg text-text-secondary">
            What's your email?
          </p>
        </div>

        <Card className="bg-surface-card border-border-default">
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleContinueWithEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary"
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
                {isLoading ? 'Sending...' : 'Continue'}
              </Button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-default"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-card text-text-secondary">
                  Or sign in with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="py-2 border border-border-default rounded-md shadow-sm"
                onClick={handleAppleLogin}
                disabled={!!socialLoading}
              >
                {socialLoading === 'apple' ? (
                  <Spinner size="sm" />
                ) : (
                  <svg className="w-6 h-6 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="py-2 border border-border-default rounded-md shadow-sm"
                onClick={handleGoogleLogin}
                disabled={!!socialLoading}
              >
                {socialLoading === 'google' ? (
                  <Spinner size="sm" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="py-2 border border-border-default rounded-md shadow-sm"
                onClick={handleFacebookLogin}
                disabled={!!socialLoading}
              >
                {socialLoading === 'facebook' ? (
                  <Spinner size="sm" />
                ) : (
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                By clicking Continue or using a social sign-in, you
                agree to SteppersLife's{' '}
                <Link to="/terms" className="text-brand-primary hover:text-brand-primary-hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-primary hover:text-brand-primary-hover">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="text-center space-y-2">
              <Link to="/auth/login" className="text-brand-primary hover:text-brand-primary-hover block">
                Already have an account? Sign in
              </Link>
              <Link to="/auth/magic-link" className="block w-full">
                <Button 
                  type="button"
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Use magic link (passwordless login)</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
