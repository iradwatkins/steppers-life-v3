import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

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
  const { user, loading } = useAuth();

  // First check if the user is authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="text-lg text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has metadata with role
  const userRole = user.user_metadata?.role || 'buyer'; // Default to buyer if no role specified

  // Check if the user has the required role
  const hasRequiredRole = allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    toast.error(`Access restricted. You need ${allowedRoles.join(' or ')} permissions.`);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute; 