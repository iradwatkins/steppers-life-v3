import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAdminCheck = () => {
  const { user, hasRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log('useAdminCheck: No user authenticated');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role using the hasRole function
        const adminStatus = hasRole('admin');
        console.log(`useAdminCheck: Admin status for ${user.email}: ${adminStatus}`);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, hasRole]);

  return { isAdmin, loading };
};
