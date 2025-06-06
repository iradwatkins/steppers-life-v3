import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback triggered');
        console.log('Current URL:', window.location.href);
        
        // Get the URL hash from window.location
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        // Log query parameters for debugging
        const queryParams = new URLSearchParams(window.location.search);
        console.log('Query parameters:', Object.fromEntries(queryParams.entries()));
        
        // If we have a hash with an access token, we're likely in an OAuth flow
        if (accessToken) {
          console.log('Access token found in URL hash');
          // Let Supabase handle the OAuth session
          const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession();
          
          console.log('Session refresh result:', refreshError ? 'Error' : 'Success');
          
          if (refreshError) {
            throw refreshError;
          }
          
          console.log('Session data after refresh:', sessionData ? 'Available' : 'Not available');
        } else {
          console.log('No access token in URL hash, checking session');
          // For standard OAuth callback processing by Supabase
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          console.log('Get session result:', sessionError ? 'Error' : 'Success');
          
          if (sessionError) {
            throw sessionError;
          }
          
          console.log('Session exists:', data.session ? 'Yes' : 'No');
          
          if (!data.session) {
            // Check if we have an error in the URL
            if (queryParams.has('error')) {
              const errorDesc = queryParams.get('error_description') || 'Unknown OAuth error';
              throw new Error(errorDesc);
            }
            
            throw new Error('No session found');
          }
        }
        
        // If we got here, authentication was successful
        console.log('Authentication successful, navigating to home');
        navigate('/');
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        const errorMessage = err.message || 'Authentication failed';
        setError(errorMessage);
        
        // Collect debug info
        const debug = {
          url: window.location.href,
          errorMessage: errorMessage,
          timestamp: new Date().toISOString()
        };
        setDebugInfo(JSON.stringify(debug, null, 2));
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
          
          {debugInfo && (
            <div className="mt-4 overflow-auto rounded bg-gray-900 p-3 text-left text-xs text-white">
              <pre>{debugInfo}</pre>
            </div>
          )}
          
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