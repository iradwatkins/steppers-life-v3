import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash from window.location
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        // If we have a hash with an access token, we're likely in an OAuth flow
        if (accessToken) {
          // Let Supabase handle the OAuth session
          const { error } = await supabase.auth.refreshSession();
          
          if (error) {
            throw error;
          }
        } else {
          // For standard OAuth callback processing by Supabase
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (!data.session) {
            throw new Error('No session found');
          }
        }
        
        // If we got here, authentication was successful
        navigate('/');
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <h1 className="mb-4 text-xl font-semibold text-red-700">Authentication Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="mt-6 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <Spinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold">Completing login...</h2>
        <p className="mt-2 text-gray-600">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};

export default AuthCallback; 