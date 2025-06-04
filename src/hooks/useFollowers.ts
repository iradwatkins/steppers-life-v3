import { useState, useEffect, useCallback, useRef } from 'react';
import { followerService, TeamMember, TeamInvitation, ActivityLog, TeamAnalytics, TeamMemberFilters, UserRole, RoleConfig } from '../services/followerService';
import { toast } from 'sonner';

interface UseFollowersOptions {
  organizerId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseFollowersReturn {
  // Data state
  followers: Follower[];
  invitations: TeamInvitation[];
  activity: TeamActivity[];
  performance: TeamPerformanceMetrics[];
  analytics: TeamAnalytics | null;
  permissions: Permission[];
  
  // Loading states
  loading: boolean;
  loadingFollowers: boolean;
  loadingInvitations: boolean;
  loadingActivity: boolean;
  loadingPerformance: boolean;
  loadingAnalytics: boolean;
  
  // Error states
  error: string | null;
  
  // Follower management
  refreshFollowers: () => Promise<void>;
  updateFollowerRole: (followerId: string, newRole: TeamRole) => Promise<boolean>;
  updateFollowerStatus: (followerId: string, status: Follower['status']) => Promise<boolean>;
  updateFollowerProfile: (followerId: string, profileUpdates: Partial<Follower['profile']>) => Promise<boolean>;
  removeFollower: (followerId: string) => Promise<boolean>;
  
  // Role and permission management
  getRolePermissions: (role: TeamRole) => Promise<RolePermissions | null>;
  updateFollowerPermissions: (followerId: string, permissions: string[]) => Promise<boolean>;
  
  // Team invitations
  refreshInvitations: () => Promise<void>;
  createInvitation: (invitation: Omit<TeamInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status' | 'organizerId' | 'invitedBy'>) => Promise<boolean>;
  updateInvitationStatus: (invitationId: string, status: TeamInvitation['status']) => Promise<boolean>;
  cancelInvitation: (invitationId: string) => Promise<boolean>;
  
  // Bulk operations
  performBulkOperation: (operation: Omit<BulkOperation, 'executedAt' | 'results' | 'executedBy' | 'organizerId'>) => Promise<BulkOperation | null>;
  
  // Activity and performance
  refreshActivity: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  getTeamActivity: (userId?: string) => Promise<TeamActivity[]>;
  
  // Utility functions
  getFollowersByRole: (role?: TeamRole) => Follower[];
  getActiveTeamMembers: () => Follower[];
  getFollowerById: (followerId: string) => Follower | undefined;
  getInvitationById: (invitationId: string) => TeamInvitation | undefined;
  
  // Statistics
  getTeamStats: () => {
    totalFollowers: number;
    activeMembers: number;
    pendingInvitations: number;
    roleBreakdown: Record<TeamRole, number>;
  };
}

export const useFollowers = ({ organizerId, autoRefresh = true, refreshInterval = 30000 }: UseFollowersOptions): UseFollowersReturn => {
  // Data state
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [activity, setActivity] = useState<TeamActivity[]>([]);
  const [performance, setPerformance] = useState<TeamPerformanceMetrics[]>([]);
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        followersData,
        invitationsData,
        activityData,
        performanceData,
        permissionsData
      ] = await Promise.all([
        followerService.getFollowers(organizerId),
        followerService.getInvitations(organizerId),
        followerService.getTeamActivity(organizerId),
        followerService.getTeamPerformance(organizerId),
        followerService.getAllPermissions()
      ]);
      
      setFollowers(followersData);
      setInvitations(invitationsData);
      setActivity(activityData);
      setPerformance(performanceData);
      setPermissions(permissionsData);
      
      // Load analytics with date range
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const analyticsData = await followerService.getTeamAnalytics(organizerId, {
        start: lastMonth.toISOString(),
        end: now.toISOString()
      });
      setAnalytics(analyticsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load follower data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [organizerId]);

  // Refresh functions
  const refreshFollowers = useCallback(async () => {
    try {
      setLoadingFollowers(true);
      const data = await followerService.getFollowers(organizerId);
      setFollowers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh followers';
      toast.error(errorMessage);
    } finally {
      setLoadingFollowers(false);
    }
  }, [organizerId]);

  const refreshInvitations = useCallback(async () => {
    try {
      setLoadingInvitations(true);
      const data = await followerService.getInvitations(organizerId);
      setInvitations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh invitations';
      toast.error(errorMessage);
    } finally {
      setLoadingInvitations(false);
    }
  }, [organizerId]);

  const refreshActivity = useCallback(async () => {
    try {
      setLoadingActivity(true);
      const data = await followerService.getTeamActivity(organizerId);
      setActivity(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh activity';
      toast.error(errorMessage);
    } finally {
      setLoadingActivity(false);
    }
  }, [organizerId]);

  const refreshPerformance = useCallback(async () => {
    try {
      setLoadingPerformance(true);
      const data = await followerService.getTeamPerformance(organizerId);
      setPerformance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh performance';
      toast.error(errorMessage);
    } finally {
      setLoadingPerformance(false);
    }
  }, [organizerId]);

  const refreshAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const data = await followerService.getTeamAnalytics(organizerId, {
        start: lastMonth.toISOString(),
        end: now.toISOString()
      });
      setAnalytics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh analytics';
      toast.error(errorMessage);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [organizerId]);

  // Follower management functions
  const updateFollowerRole = useCallback(async (followerId: string, newRole: TeamRole): Promise<boolean> => {
    try {
      const result = await followerService.updateFollowerRole(followerId, newRole, organizerId);
      if (result) {
        await refreshFollowers();
        toast.success(`Role updated successfully`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      toast.error(errorMessage);
      return false;
    }
  }, [organizerId, refreshFollowers]);

  const updateFollowerStatus = useCallback(async (followerId: string, status: Follower['status']): Promise<boolean> => {
    try {
      const result = await followerService.updateFollowerStatus(followerId, status, organizerId);
      if (result) {
        await refreshFollowers();
        toast.success(`Status updated successfully`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(errorMessage);
      return false;
    }
  }, [organizerId, refreshFollowers]);

  const updateFollowerProfile = useCallback(async (followerId: string, profileUpdates: Partial<Follower['profile']>): Promise<boolean> => {
    try {
      const result = await followerService.updateFollowerProfile(followerId, profileUpdates);
      if (result) {
        await refreshFollowers();
        toast.success(`Profile updated successfully`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
      return false;
    }
  }, [refreshFollowers]);

  const removeFollower = useCallback(async (followerId: string): Promise<boolean> => {
    try {
      const result = await followerService.removeFollower(followerId, organizerId);
      if (result) {
        await refreshFollowers();
        toast.success(`Team member removed successfully`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove team member';
      toast.error(errorMessage);
      return false;
    }
  }, [organizerId, refreshFollowers]);

  // Role and permission management
  const getRolePermissions = useCallback(async (role: TeamRole): Promise<RolePermissions | null> => {
    try {
      return await followerService.getRolePermissions(role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get role permissions';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const updateFollowerPermissions = useCallback(async (followerId: string, permissions: string[]): Promise<boolean> => {
    try {
      const result = await followerService.updateFollowerPermissions(followerId, permissions, organizerId);
      if (result) {
        await refreshFollowers();
        toast.success(`Permissions updated successfully`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update permissions';
      toast.error(errorMessage);
      return false;
    }
  }, [organizerId, refreshFollowers]);

  // Team invitation functions
  const createInvitation = useCallback(async (invitation: Omit<TeamInvitation, 'id' | 'invitedAt' | 'expiresAt' | 'status' | 'organizerId' | 'invitedBy'>): Promise<boolean> => {
    try {
      await followerService.createInvitation({
        ...invitation,
        organizerId,
        invitedBy: organizerId
      });
      await refreshInvitations();
      toast.success(`Invitation sent to ${invitation.inviteeEmail}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      toast.error(errorMessage);
      return false;
    }
  }, [organizerId, refreshInvitations]);

  const updateInvitationStatus = useCallback(async (invitationId: string, status: TeamInvitation['status']): Promise<boolean> => {
    try {
      const result = await followerService.updateInvitationStatus(invitationId, status);
      if (result) {
        await refreshInvitations();
        toast.success(`Invitation ${status}`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invitation';
      toast.error(errorMessage);
      return false;
    }
  }, [refreshInvitations]);

  const cancelInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    try {
      const result = await followerService.cancelInvitation(invitationId);
      if (result) {
        await refreshInvitations();
        toast.success(`Invitation cancelled`);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel invitation';
      toast.error(errorMessage);
      return false;
    }
  }, [refreshInvitations]);

  // Bulk operations
  const performBulkOperation = useCallback(async (operation: Omit<BulkOperation, 'executedAt' | 'results' | 'executedBy'>): Promise<BulkOperation | null> => {
    try {
      const result = await followerService.performBulkOperation({
        ...operation,
        executedBy: organizerId
      });
      
      await refreshFollowers();
      
      const { successful, failed } = result.results;
      if (successful.length > 0) {
        toast.success(`Operation completed successfully for ${successful.length} members`);
      }
      if (failed.length > 0) {
        toast.error(`Operation failed for ${failed.length} members`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk operation failed';
      toast.error(errorMessage);
      return null;
    }
  }, [organizerId, refreshFollowers]);

  // Activity tracking
  const getTeamActivity = useCallback(async (userId?: string): Promise<TeamActivity[]> => {
    try {
      return await followerService.getTeamActivity(organizerId, userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get team activity';
      toast.error(errorMessage);
      return [];
    }
  }, [organizerId]);

  // Utility functions
  const getFollowersByRole = useCallback((role?: TeamRole): Follower[] => {
    if (!role) return followers;
    return followers.filter(follower => follower.role === role);
  }, [followers]);

  const getActiveTeamMembers = useCallback((): Follower[] => {
    return followers.filter(follower => follower.status === 'active' && follower.role !== 'follower');
  }, [followers]);

  const getFollowerById = useCallback((followerId: string): Follower | undefined => {
    return followers.find(follower => follower.id === followerId);
  }, [followers]);

  const getInvitationById = useCallback((invitationId: string): TeamInvitation | undefined => {
    return invitations.find(invitation => invitation.id === invitationId);
  }, [invitations]);

  const getTeamStats = useCallback(() => {
    const roleBreakdown = followers.reduce((acc, follower) => {
      acc[follower.role] = (acc[follower.role] || 0) + 1;
      return acc;
    }, {} as Record<TeamRole, number>);

    return {
      totalFollowers: followers.length,
      activeMembers: getActiveTeamMembers().length,
      pendingInvitations: invitations.filter(inv => inv.status === 'pending').length,
      roleBreakdown
    };
  }, [followers, invitations, getActiveTeamMembers]);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshFollowers();
      refreshInvitations();
      refreshActivity();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshFollowers, refreshInvitations, refreshActivity]);

  return {
    // Data
    followers,
    invitations,
    activity,
    performance,
    analytics,
    permissions,
    
    // Loading states
    loading,
    loadingFollowers,
    loadingInvitations,
    loadingActivity,
    loadingPerformance,
    loadingAnalytics,
    
    // Error state
    error,
    
    // Follower management
    refreshFollowers,
    updateFollowerRole,
    updateFollowerStatus,
    updateFollowerProfile,
    removeFollower,
    
    // Role and permission management
    getRolePermissions,
    updateFollowerPermissions,
    
    // Team invitations
    refreshInvitations,
    createInvitation,
    updateInvitationStatus,
    cancelInvitation,
    
    // Bulk operations
    performBulkOperation,
    
    // Activity and performance
    refreshActivity,
    refreshPerformance,
    refreshAnalytics,
    getTeamActivity,
    
    // Utility functions
    getFollowersByRole,
    getActiveTeamMembers,
    getFollowerById,
    getInvitationById,
    getTeamStats
  };
}; 