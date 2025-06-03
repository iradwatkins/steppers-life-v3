import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

// User roles for PWA access
export type PWAUserRole = 'organizer' | 'event_staff' | 'sales_agent';

export interface PWAUser extends User {
  role?: PWAUserRole;
  events?: string[];
  permissions?: string[];
}

export interface EncryptedAuthCache {
  user: PWAUser;
  session: Session;
  expiresAt: number;
  roles: PWAUserRole[];
  events: string[];
}

export interface BiometricAuthResult {
  success: boolean;
  user?: PWAUser;
  error?: string;
}

export interface DeviceAuthResult {
  success: boolean;
  type: 'biometric' | 'pin' | 'pattern' | 'password';
  user?: PWAUser;
  error?: string;
}

class PWAAuthService {
  private encryptionKey = 'steppers-life-pwa-auth-key';
  private cacheKey = 'pwa-auth-cache';
  private offlineTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Encrypt data for local storage
  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }

  // Decrypt data from local storage
  private decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to decrypt auth cache:', error);
      return null;
    }
  }

  // Cache authentication data for offline access
  async cacheAuthData(user: PWAUser, session: Session, roles: PWAUserRole[], events: string[]): Promise<void> {
    try {
      const authCache: EncryptedAuthCache = {
        user,
        session,
        expiresAt: Date.now() + this.offlineTimeout,
        roles,
        events
      };

      const encrypted = this.encrypt(authCache);
      localStorage.setItem(this.cacheKey, encrypted);
      
      // Also store in IndexedDB for better offline support
      if ('indexedDB' in window) {
        await this.storeInIndexedDB('auth-cache', authCache);
      }
    } catch (error) {
      console.error('Failed to cache auth data:', error);
    }
  }

  // Retrieve cached authentication data for offline access
  async getCachedAuthData(): Promise<EncryptedAuthCache | null> {
    try {
      // Try localStorage first
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const authCache = this.decrypt(cached);
        if (authCache && authCache.expiresAt > Date.now()) {
          return authCache;
        }
      }

      // Try IndexedDB if localStorage fails
      if ('indexedDB' in window) {
        const indexedDBCache = await this.getFromIndexedDB('auth-cache');
        if (indexedDBCache && indexedDBCache.expiresAt > Date.now()) {
          return indexedDBCache;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to retrieve cached auth data:', error);
      return null;
    }
  }

  // Clear cached authentication data
  clearAuthCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      if ('indexedDB' in window) {
        this.deleteFromIndexedDB('auth-cache');
      }
    } catch (error) {
      console.error('Failed to clear auth cache:', error);
    }
  }

  // Check if user has required role for PWA access
  hasRequiredRole(user: PWAUser, requiredRoles: PWAUserRole[]): boolean {
    if (!user.role) return false;
    return requiredRoles.includes(user.role);
  }

  // Check if user has access to specific event
  hasEventAccess(user: PWAUser, eventId: string): boolean {
    if (!user.events) return false;
    return user.events.includes(eventId) || user.role === 'organizer';
  }

  // Authenticate with biometric (if available)
  async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    try {
      // Check if biometric authentication is available
      if (!('navigator' in window) || !('credentials' in navigator)) {
        return { success: false, error: 'Biometric authentication not supported' };
      }

      // Try to use WebAuthn/FIDO2 for biometric authentication
      if ('webkitCredentials' in navigator || 'credentials' in navigator) {
        const cachedAuth = await this.getCachedAuthData();
        if (!cachedAuth) {
          return { success: false, error: 'No cached authentication data' };
        }

        // In a real implementation, you would verify biometric credentials here
        // For now, we'll simulate biometric success and return cached user
        return {
          success: true,
          user: cachedAuth.user
        };
      }

      return { success: false, error: 'Biometric authentication not available' };
    } catch (error) {
      return { success: false, error: `Biometric authentication failed: ${error}` };
    }
  }

  // Authenticate with device security (PIN, pattern, etc.)
  async authenticateWithDevice(deviceAuth: string): Promise<DeviceAuthResult> {
    try {
      const cachedAuth = await this.getCachedAuthData();
      if (!cachedAuth) {
        return { success: false, type: 'pin', error: 'No cached authentication data' };
      }

      // In a real implementation, you would verify the device authentication
      // For now, we'll simulate device auth success
      if (deviceAuth && deviceAuth.length >= 4) {
        return {
          success: true,
          type: 'pin',
          user: cachedAuth.user
        };
      }

      return { success: false, type: 'pin', error: 'Invalid device authentication' };
    } catch (error) {
      return { 
        success: false, 
        type: 'pin', 
        error: `Device authentication failed: ${error}` 
      };
    }
  }

  // Enhanced sign-in with PWA role validation
  async signInWithRoles(email: string, password: string): Promise<{
    success: boolean;
    user?: PWAUser;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // In a real implementation, fetch user roles from database
        const userRoles = await this.fetchUserRoles(data.user.id);
        const userEvents = await this.fetchUserEvents(data.user.id);
        
        const pwaUser: PWAUser = {
          ...data.user,
          role: userRoles[0] || 'event_staff',
          events: userEvents,
          permissions: this.getPermissionsForRole(userRoles[0] || 'event_staff')
        };

        // Cache for offline access
        await this.cacheAuthData(pwaUser, data.session, userRoles, userEvents);

        return { success: true, user: pwaUser };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Validate session for sensitive operations
  async validateSessionForOperation(operation: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Check cached session for offline operations
        const cached = await this.getCachedAuthData();
        return cached !== null && cached.expiresAt > Date.now();
      }

      // Verify session is still valid and not expired
      const tokenExp = session.expires_at || 0;
      return tokenExp * 1000 > Date.now();
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  // Background sync authentication state when online
  async syncAuthState(): Promise<void> {
    try {
      if (!navigator.onLine) return;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const userRoles = await this.fetchUserRoles(session.user.id);
        const userEvents = await this.fetchUserEvents(session.user.id);
        
        const pwaUser: PWAUser = {
          ...session.user,
          role: userRoles[0] || 'event_staff',
          events: userEvents,
          permissions: this.getPermissionsForRole(userRoles[0] || 'event_staff')
        };

        await this.cacheAuthData(pwaUser, session, userRoles, userEvents);
      } else {
        this.clearAuthCache();
      }
    } catch (error) {
      console.error('Auth state sync failed:', error);
    }
  }

  // IndexedDB helper methods
  private async storeInIndexedDB(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWAAuthDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth');
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['auth'], 'readwrite');
        const store = transaction.objectStore('auth');
        
        store.put(data, key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  private async getFromIndexedDB(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWAAuthDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['auth'], 'readonly');
        const store = transaction.objectStore('auth');
        
        const getRequest = store.get(key);
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  private async deleteFromIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWAAuthDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['auth'], 'readwrite');
        const store = transaction.objectStore('auth');
        
        store.delete(key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  // Mock data methods (replace with real API calls)
  private async fetchUserRoles(userId: string): Promise<PWAUserRole[]> {
    // Mock implementation - replace with actual API call
    const mockRoles: Record<string, PWAUserRole[]> = {
      'organizer_1': ['organizer'],
      'staff_1': ['event_staff'],
      'sales_1': ['sales_agent'],
    };
    return mockRoles[userId] || ['event_staff'];
  }

  private async fetchUserEvents(userId: string): Promise<string[]> {
    // Mock implementation - replace with actual API call
    const mockEvents: Record<string, string[]> = {
      'organizer_1': ['event_1', 'event_2', 'event_3'],
      'staff_1': ['event_1'],
      'sales_1': ['event_1', 'event_2'],
    };
    return mockEvents[userId] || [];
  }

  private getPermissionsForRole(role: PWAUserRole): string[] {
    const permissions: Record<PWAUserRole, string[]> = {
      'organizer': ['manage_events', 'view_reports', 'manage_staff', 'check_in', 'manage_sales'],
      'event_staff': ['check_in', 'view_attendance', 'manage_checkin'],
      'sales_agent': ['check_in', 'view_sales', 'process_sales']
    };
    return permissions[role] || [];
  }
}

export const pwaAuthService = new PWAAuthService(); 