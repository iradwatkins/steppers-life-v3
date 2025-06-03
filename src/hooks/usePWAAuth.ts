import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { pwaAuthService, PWAUser, PWAUserRole, BiometricAuthResult, DeviceAuthResult } from '@/services/pwaAuthService';
import { toast } from '@/components/ui/sonner';

export interface UsePWAAuthReturn {
  // Extended from useAuth
  user: PWAUser | null;
  loading: boolean;
  isOnline: boolean;
  isOfflineMode: boolean;
  
  // PWA-specific auth methods
  signInWithRoles: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  authenticateWithBiometric: () => Promise<BiometricAuthResult>;
  authenticateWithDevice: (deviceAuth: string) => Promise<DeviceAuthResult>;
  
  // Role and permission checking
  hasRole: (roles: PWAUserRole[]) => boolean;
  hasEventAccess: (eventId: string) => boolean;
  hasPermission: (permission: string) => boolean;
  
  // Session and cache management
  validateSession: (operation: string) => Promise<boolean>;
  refreshAuthCache: () => Promise<void>;
  clearOfflineAuth: () => void;
  
  // PWA-specific states
  isBiometricAvailable: boolean;
  supportedBiometricTypes: string[];
  lastSyncTime: Date | null;
}

export const usePWAAuth = (): UsePWAAuthReturn => {
  const { user: baseUser, loading: baseLoading, signOut } = useAuth();
  const [pwaUser, setPwaUser] = useState<PWAUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [supportedBiometricTypes, setSupportedBiometricTypes] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Initialize PWA auth state
  useEffect(() => {
    const initializePWAAuth = async () => {
      try {
        setLoading(true);
        
        // Check if we have a regular authenticated user
        if (baseUser && !baseLoading) {
          // Try to get enhanced PWA user data
          const cachedAuth = await pwaAuthService.getCachedAuthData();
          if (cachedAuth && cachedAuth.user.id === baseUser.id) {
            setPwaUser(cachedAuth.user);
            setIsOfflineMode(false);
          } else {
            // Create PWA user from base user
            const enhancedUser: PWAUser = {
              ...baseUser,
              role: 'event_staff', // Default role
              events: [],
              permissions: []
            };
            setPwaUser(enhancedUser);
          }
        } else if (!baseUser && !baseLoading) {
          // No active session, check for offline cached auth
          const cachedAuth = await pwaAuthService.getCachedAuthData();
          if (cachedAuth) {
            setPwaUser(cachedAuth.user);
            setIsOfflineMode(true);
            toast.info('Using offline authentication', {
              description: 'Some features may be limited until you reconnect to the internet.'
            });
          } else {
            setPwaUser(null);
            setIsOfflineMode(false);
          }
        }
      } catch (error) {
        console.error('Failed to initialize PWA auth:', error);
        setPwaUser(null);
        setIsOfflineMode(false);
      } finally {
        setLoading(false);
      }
    };

    initializePWAAuth();
  }, [baseUser, baseLoading]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (isOfflineMode) {
        await refreshAuthCache();
        setIsOfflineMode(false);
        toast.success('Back online', {
          description: 'Authentication state synchronized.'
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline', {
        description: 'Using cached authentication data.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOfflineMode]);

  // Check biometric availability
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if ('navigator' in window && 'credentials' in navigator) {
          // Check for WebAuthn support
          if (window.PublicKeyCredential) {
            const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            setIsBiometricAvailable(available);
            
            if (available) {
              setSupportedBiometricTypes(['fingerprint', 'face-id', 'touch-id']);
            }
          }
        }
      } catch (error) {
        console.error('Error checking biometric support:', error);
        setIsBiometricAvailable(false);
      }
    };

    checkBiometricSupport();
  }, []);

  // PWA-specific sign-in with role validation
  const signInWithRoles = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const result = await pwaAuthService.signInWithRoles(email, password);
      
      if (result.success && result.user) {
        setPwaUser(result.user);
        setIsOfflineMode(false);
        setLastSyncTime(new Date());
        
        toast.success(`Welcome back, ${result.user.role || 'user'}!`, {
          description: 'Authentication successful.'
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Biometric authentication
  const authenticateWithBiometric = useCallback(async (): Promise<BiometricAuthResult> => {
    try {
      setLoading(true);
      const result = await pwaAuthService.authenticateWithBiometric();
      
      if (result.success && result.user) {
        setPwaUser(result.user);
        setIsOfflineMode(true);
        
        toast.success('Biometric authentication successful', {
          description: 'Logged in with biometric credentials.'
        });
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Device authentication (PIN, pattern, etc.)
  const authenticateWithDevice = useCallback(async (deviceAuth: string): Promise<DeviceAuthResult> => {
    try {
      setLoading(true);
      const result = await pwaAuthService.authenticateWithDevice(deviceAuth);
      
      if (result.success && result.user) {
        setPwaUser(result.user);
        setIsOfflineMode(true);
        
        toast.success('Device authentication successful', {
          description: 'Logged in with device credentials.'
        });
      }
      
      return result;
    } catch (error: any) {
      return { success: false, type: 'pin', error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Role checking
  const hasRole = useCallback((roles: PWAUserRole[]): boolean => {
    if (!pwaUser) return false;
    return pwaAuthService.hasRequiredRole(pwaUser, roles);
  }, [pwaUser]);

  // Event access checking
  const hasEventAccess = useCallback((eventId: string): boolean => {
    if (!pwaUser) return false;
    return pwaAuthService.hasEventAccess(pwaUser, eventId);
  }, [pwaUser]);

  // Permission checking
  const hasPermission = useCallback((permission: string): boolean => {
    if (!pwaUser || !pwaUser.permissions) return false;
    return pwaUser.permissions.includes(permission);
  }, [pwaUser]);

  // Session validation
  const validateSession = useCallback(async (operation: string): Promise<boolean> => {
    try {
      const isValid = await pwaAuthService.validateSessionForOperation(operation);
      
      if (!isValid && !isOfflineMode) {
        toast.error('Session expired', {
          description: 'Please sign in again to continue.'
        });
        await signOut();
        setPwaUser(null);
      }
      
      return isValid;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, [isOfflineMode, signOut]);

  // Refresh authentication cache
  const refreshAuthCache = useCallback(async (): Promise<void> => {
    try {
      if (!isOnline) {
        toast.warning('Cannot sync while offline');
        return;
      }
      
      await pwaAuthService.syncAuthState();
      setLastSyncTime(new Date());
      
      // Refresh PWA user data
      const cachedAuth = await pwaAuthService.getCachedAuthData();
      if (cachedAuth && pwaUser && cachedAuth.user.id === pwaUser.id) {
        setPwaUser(cachedAuth.user);
      }
      
      toast.success('Authentication data synchronized');
    } catch (error) {
      console.error('Failed to refresh auth cache:', error);
      toast.error('Failed to sync authentication data');
    }
  }, [isOnline, pwaUser]);

  // Clear offline authentication
  const clearOfflineAuth = useCallback((): void => {
    try {
      pwaAuthService.clearAuthCache();
      setPwaUser(null);
      setIsOfflineMode(false);
      setLastSyncTime(null);
      
      toast.info('Offline authentication data cleared');
    } catch (error) {
      console.error('Failed to clear offline auth:', error);
      toast.error('Failed to clear offline data');
    }
  }, []);

  // Background sync when coming online
  useEffect(() => {
    if (isOnline && pwaUser && !isOfflineMode) {
      // Automatically sync when coming back online
      const syncTimer = setTimeout(() => {
        refreshAuthCache();
      }, 1000);

      return () => clearTimeout(syncTimer);
    }
  }, [isOnline, pwaUser, isOfflineMode, refreshAuthCache]);

  return {
    user: pwaUser,
    loading: loading || baseLoading,
    isOnline,
    isOfflineMode,
    
    signInWithRoles,
    authenticateWithBiometric,
    authenticateWithDevice,
    
    hasRole,
    hasEventAccess,
    hasPermission,
    
    validateSession,
    refreshAuthCache,
    clearOfflineAuth,
    
    isBiometricAvailable,
    supportedBiometricTypes,
    lastSyncTime
  };
}; 