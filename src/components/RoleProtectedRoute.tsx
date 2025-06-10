import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHybridAuth } from '@/hooks/useHybridAuth';
import { toast } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/dashboard'
}) => {
  const { user, loading, isAuthenticated, hasRole } = useHybridAuth();

  // First check if the user is authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" className="text-brand-primary" />
          <div className="text-lg text-text-secondary">Checking permissions...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if backend profile exists (required for role checking)
  if (!user?.backendProfile) {
    toast.error('Profile setup required for this feature.');
    return <Navigate to="/profile" replace />;
  }

  // Check if the user has any of the required roles
  const hasRequiredRole = hasRole(allowedRoles);

  if (!hasRequiredRole) {
    toast.error(`Access restricted. You need ${allowedRoles.join(' or ')} permissions.`);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute; 