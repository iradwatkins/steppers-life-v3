
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHybridAuth } from '@/hooks/useHybridAuth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireBackendProfile?: boolean; // Whether to require backend profile
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireBackendProfile = false 
}) => {
  const { user, loading, isAuthenticated } = useHybridAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" className="text-brand-primary" />
          <div className="text-lg text-text-secondary">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if backend profile is required and available
  if (requireBackendProfile && (!user?.backendProfile)) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-lg text-text-primary mb-2">Profile Setup Required</div>
          <div className="text-text-secondary mb-4">
            Your account needs to be set up before accessing this feature.
          </div>
          <Navigate to="/profile" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
