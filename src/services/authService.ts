import { apiClient } from './apiClient';

// User types matching backend models
export type UserRole = 'admin' | 'organizer' | 'attendee' | 'staff';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole;
  status: UserStatus;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegistrationData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  };
  
  private listeners: Array<(state: AuthState) => void> = [];
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() {
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize authentication state from localStorage
  private initializeAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.authState = {
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        };
        
        // Verify token is still valid
        this.verifyToken().catch(() => {
          this.clearAuth();
        });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearAuth();
      }
    }
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Call immediately with current state
    listener(this.authState);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Update auth state
  private updateAuthState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  // Store auth data in localStorage
  private storeAuthData(tokens: AuthTokens): void {
    localStorage.setItem(this.tokenKey, tokens.access_token);
    localStorage.setItem(this.userKey, JSON.stringify(tokens.user));
  }

  // Clear auth data from localStorage
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Clear authentication state
  private clearAuth(): void {
    this.clearAuthData();
    this.updateAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Get current token
  getToken(): string | null {
    return this.authState.token;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.token && !!this.authState.user;
  }

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    return this.authState.user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    return !!this.authState.user?.role && roles.includes(this.authState.user.role);
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    this.updateAuthState({ isLoading: true });

    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      
      if (response.error) {
        this.updateAuthState({ isLoading: false });
        return { success: false, error: response.error };
      }

      if (response.data) {
        this.storeAuthData(response.data);
        this.updateAuthState({
          user: response.data.user,
          token: response.data.access_token,
          isAuthenticated: true,
          isLoading: false
        });

        return { success: true, user: response.data.user };
      }

      this.updateAuthState({ isLoading: false });
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      this.updateAuthState({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  // Register user
  async register(registrationData: RegistrationData): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    message?: string;
  }> {
    this.updateAuthState({ isLoading: true });

    try {
      const response = await apiClient.register(registrationData);
      
      if (response.error) {
        this.updateAuthState({ isLoading: false });
        return { success: false, error: response.error };
      }

      if (response.data) {
        this.updateAuthState({ isLoading: false });
        return { 
          success: true, 
          user: response.data,
          message: 'Registration successful! Please check your email to verify your account.'
        };
      }

      this.updateAuthState({ isLoading: false });
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      this.updateAuthState({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await apiClient.verifyEmail(token);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { 
        success: true, 
        message: 'Email verified successfully! You can now login.' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Email verification failed' 
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await apiClient.requestPasswordReset(email);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { 
        success: true, 
        message: 'If email exists, password reset instructions have been sent.' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset request failed' 
      };
    }
  }

  // Confirm password reset
  async confirmPasswordReset(token: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await apiClient.confirmPasswordReset(token, newPassword);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { 
        success: true, 
        message: 'Password reset successfully! You can now login with your new password.' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  }

  // Verify current token
  async verifyToken(): Promise<boolean> {
    if (!this.authState.token) {
      return false;
    }

    try {
      const response = await apiClient.getCurrentUser();
      
      if (response.error) {
        this.clearAuth();
        return false;
      }

      if (response.data) {
        this.updateAuthState({
          user: response.data,
          isAuthenticated: true
        });
        return true;
      }

      this.clearAuth();
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
      return false;
    }
  }

  // Refresh user data
  async refreshUser(): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    if (!this.authState.token) {
      return { success: false, error: 'No authentication token' };
    }

    try {
      const response = await apiClient.getCurrentUser();
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const user = response.data;
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.updateAuthState({ user });
        return { success: true, user };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh user data' 
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    this.clearAuth();
  }

  // Check if user can perform specific actions
  canCreateEvents(): boolean {
    return this.hasAnyRole(['admin', 'organizer']);
  }

  canManageEvents(): boolean {
    return this.hasAnyRole(['admin', 'organizer', 'staff']);
  }

  canAccessAdminPanel(): boolean {
    return this.hasAnyRole(['admin', 'organizer']);
  }

  canModerateContent(): boolean {
    return this.hasAnyRole(['admin', 'organizer']);
  }

  canViewAnalytics(): boolean {
    return this.hasAnyRole(['admin', 'organizer']);
  }

  // Biometric authentication simulation (for PWA)
  async isBiometricAvailable(): Promise<{ available: boolean; types: string[] }> {
    try {
      if (!('navigator' in window) || !('credentials' in navigator)) {
        return { available: false, types: [] };
      }

      if ('PublicKeyCredential' in window) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          return { 
            available: true, 
            types: ['fingerprint', 'face-id', 'touch-id'] 
          };
        }
      }

      return { available: false, types: [] };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return { available: false, types: [] };
    }
  }

  // Offline authentication using cached credentials
  async authenticateOffline(): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (!token || !userJson) {
      return { success: false, error: 'No cached authentication data' };
    }

    try {
      const user = JSON.parse(userJson);
      this.updateAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true, user };
    } catch (error) {
      this.clearAuth();
      return { success: false, error: 'Invalid cached authentication data' };
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService; 