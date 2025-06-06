import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Let Supabase handle getting the session automatically
    const checkSession = async () => {
      try {
        // Get the session after OAuth redirect
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Wait a moment to ensure everything is processed
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    checkSession();
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