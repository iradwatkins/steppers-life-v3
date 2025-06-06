import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user } = useAuth();
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
        // For development: Grant admin access to authenticated users
        console.log(`useAdminCheck: Development mode - Granting admin access to authenticated user ${user.email}`);
        setIsAdmin(true);
        setLoading(false);
        
        // Commented out database check until backend is properly configured
        /*
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
        */
      } catch (error) {
        console.error('Error checking admin status:', error);
        // For development: Still grant admin access even if error occurs
        console.log('useAdminCheck: Error occurred but still granting admin access for development');
        setIsAdmin(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
