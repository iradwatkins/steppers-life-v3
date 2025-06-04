import { addDays, subDays, format } from 'date-fns';

// User Role Types
export type UserRole = 'follower' | 'sales_agent' | 'event_staff' | 'marketing_assistant';

// Permission Categories
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'events' | 'financial' | 'attendees' | 'marketing' | 'settings';
}

// Role Configuration
export interface RoleConfig {
  role: UserRole;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: string;
}

// Team Member Profile
export interface TeamMember {
  id: string;
  userId: string;
  organizerId: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  invitedBy?: string;
  specialties: string[];
  contactInfo: {
    phone?: string;
    timezone: string;
    availability: 'full_time' | 'part_time' | 'weekend_only' | 'event_only';
  };
  performance: {
    eventsManaged: number;
    totalSales: number;
    averageRating: number;
    completedTasks: number;
  };
  notes?: string;
}

// Team Invitation
export interface TeamInvitation {
  id: string;
  organizerId: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  message?: string;
  token: string;
}

// Activity Log Entry
export interface ActivityLog {
  id: string;
  userId: string;
  organizerId: string;
  action: string;
  details: string;
  category: 'login' | 'event_management' | 'sales' | 'marketing' | 'system';
  timestamp: string;
  metadata?: Record<string, any>;
}

// Team Analytics
export interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  roleDistribution: Record<UserRole, number>;
  totalSales: number;
  totalEventsManaged: number;
  averageTeamRating: number;
  activitySummary: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  topPerformers: TeamMember[];
}

// Filters and Search
export interface TeamMemberFilters {
  role?: UserRole[];
  status?: ('active' | 'suspended' | 'pending')[];
  searchTerm?: string;
  joinDateRange?: {
    start: string;
    end: string;
  };
  lastActiveRange?: {
    start: string;
    end: string;
  };
  specialties?: string[];
  availability?: string[];
}

// Permission system configuration
const PERMISSIONS: Permission[] = [
  // Event Management Permissions
  { id: 'view_events', name: 'View Events', description: 'View event details and listings', category: 'events' },
  { id: 'create_events', name: 'Create Events', description: 'Create new events', category: 'events' },
  { id: 'edit_events', name: 'Edit Events', description: 'Modify event details and settings', category: 'events' },
  { id: 'delete_events', name: 'Delete Events', description: 'Delete events', category: 'events' },
  { id: 'publish_events', name: 'Publish Events', description: 'Publish and unpublish events', category: 'events' },
  
  // Financial Permissions
  { id: 'view_financial', name: 'View Financial Data', description: 'View revenue and financial reports', category: 'financial' },
  { id: 'manage_pricing', name: 'Manage Pricing', description: 'Set and modify ticket prices', category: 'financial' },
  { id: 'process_refunds', name: 'Process Refunds', description: 'Handle refund requests', category: 'financial' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access financial analytics and reports', category: 'financial' },
  
  // Attendee Management Permissions
  { id: 'view_attendees', name: 'View Attendees', description: 'View attendee lists and information', category: 'attendees' },
  { id: 'manage_checkin', name: 'Manage Check-in', description: 'Handle event check-in process', category: 'attendees' },
  { id: 'export_attendees', name: 'Export Attendee Data', description: 'Export attendee information', category: 'attendees' },
  { id: 'send_communications', name: 'Send Communications', description: 'Send emails and notifications to attendees', category: 'attendees' },
  
  // Marketing Permissions
  { id: 'manage_campaigns', name: 'Manage Campaigns', description: 'Create and manage marketing campaigns', category: 'marketing' },
  { id: 'manage_social', name: 'Manage Social Media', description: 'Handle social media promotion', category: 'marketing' },
  { id: 'view_marketing_analytics', name: 'View Marketing Analytics', description: 'Access marketing performance data', category: 'marketing' },
  { id: 'manage_promo_codes', name: 'Manage Promo Codes', description: 'Create and manage promotional codes', category: 'marketing' },
  
  // Settings Permissions
  { id: 'manage_team', name: 'Manage Team', description: 'Add, remove, and manage team members', category: 'settings' },
  { id: 'view_activity_logs', name: 'View Activity Logs', description: 'Access team activity and audit logs', category: 'settings' },
  { id: 'manage_integrations', name: 'Manage Integrations', description: 'Configure third-party integrations', category: 'settings' }
];

// Role configurations with permissions
const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: 'follower',
    name: 'Follower',
    description: 'Basic follower with view-only access',
    permissions: ['view_events'],
    color: '#6B7280',
    icon: '👥'
  },
  {
    role: 'sales_agent',
    name: 'Sales Agent',
    description: 'Can manage sales, pricing, and customer communications',
    permissions: [
      'view_events', 'edit_events', 'manage_pricing', 'view_attendees', 
      'manage_checkin', 'send_communications', 'manage_promo_codes', 'view_financial'
    ],
    color: '#10B981',
    icon: '💼'
  },
  {
    role: 'event_staff',
    name: 'Event Staff',
    description: 'Can manage events and attendees during event operations',
    permissions: [
      'view_events', 'edit_events', 'view_attendees', 'manage_checkin', 
      'send_communications', 'export_attendees'
    ],
    color: '#3B82F6',
    icon: '🎭'
  },
  {
    role: 'marketing_assistant',
    name: 'Marketing Assistant',
    description: 'Can manage marketing campaigns and social media promotion',
    permissions: [
      'view_events', 'manage_campaigns', 'manage_social', 'view_marketing_analytics',
      'manage_promo_codes', 'send_communications'
    ],
    color: '#8B5CF6',
    icon: '📢'
  }
];

// Mock data for development
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    userId: 'user-001',
    organizerId: 'org-001',
    email: 'sarah.johnson@email.com',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2eb4a7e?w=400&h=400&fit=crop&crop=face',
    role: 'sales_agent',
    status: 'active',
    joinDate: '2024-10-15T09:00:00Z',
    lastActive: '2024-12-19T14:30:00Z',
    specialties: ['Corporate Events', 'Sales', 'Customer Relations'],
    contactInfo: {
      phone: '+1-555-0123',
      timezone: 'America/New_York',
      availability: 'full_time'
    },
    performance: {
      eventsManaged: 8,
      totalSales: 25000,
      averageRating: 4.8,
      completedTasks: 45
    },
    notes: 'Excellent sales performance and customer relationships. Specializes in corporate events.'
  },
  {
    id: 'tm-002',
    userId: 'user-002',
    organizerId: 'org-001',
    email: 'mike.chen@email.com',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    role: 'event_staff',
    status: 'active',
    joinDate: '2024-11-02T10:15:00Z',
    lastActive: '2024-12-19T16:45:00Z',
    specialties: ['Event Operations', 'Check-in Management', 'Technical Support'],
    contactInfo: {
      phone: '+1-555-0124',
      timezone: 'America/Los_Angeles',
      availability: 'part_time'
    },
    performance: {
      eventsManaged: 12,
      totalSales: 0,
      averageRating: 4.6,
      completedTasks: 38
    },
    notes: 'Reliable event staff with strong technical skills. Great at managing check-in operations.'
  },
  {
    id: 'tm-003',
    userId: 'user-003',
    organizerId: 'org-001',
    email: 'emma.martinez@email.com',
    name: 'Emma Martinez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    role: 'marketing_assistant',
    status: 'active',
    joinDate: '2024-09-20T11:30:00Z',
    lastActive: '2024-12-19T13:15:00Z',
    specialties: ['Social Media', 'Content Creation', 'Email Marketing'],
    contactInfo: {
      phone: '+1-555-0125',
      timezone: 'America/Chicago',
      availability: 'weekend_only'
    },
    performance: {
      eventsManaged: 0,
      totalSales: 8500,
      averageRating: 4.9,
      completedTasks: 52
    },
    notes: 'Creative marketing specialist with excellent social media engagement rates.'
  },
  {
    id: 'tm-004',
    userId: 'user-004',
    organizerId: 'org-001',
    email: 'david.kim@email.com',
    name: 'David Kim',
    role: 'follower',
    status: 'active',
    joinDate: '2024-12-10T08:45:00Z',
    lastActive: '2024-12-18T20:30:00Z',
    specialties: ['Photography', 'Event Documentation'],
    contactInfo: {
      timezone: 'America/Denver',
      availability: 'event_only'
    },
    performance: {
      eventsManaged: 0,
      totalSales: 0,
      averageRating: 0,
      completedTasks: 3
    },
    notes: 'New follower interested in event photography opportunities.'
  }
];

const mockInvitations: TeamInvitation[] = [
  {
    id: 'inv-001',
    organizerId: 'org-001',
    email: 'alex.thompson@email.com',
    role: 'sales_agent',
    status: 'pending',
    invitedBy: 'org-001',
    invitedAt: '2024-12-18T10:00:00Z',
    expiresAt: '2024-12-25T10:00:00Z',
    message: 'Join our team as a Sales Agent for upcoming dance events.',
    token: 'inv-token-001'
  },
  {
    id: 'inv-002',
    organizerId: 'org-001',
    email: 'lisa.brown@email.com',
    role: 'marketing_assistant',
    status: 'pending',
    invitedBy: 'org-001',
    invitedAt: '2024-12-17T14:30:00Z',
    expiresAt: '2024-12-24T14:30:00Z',
    message: 'Help us with marketing campaigns and social media promotion.',
    token: 'inv-token-002'
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    userId: 'tm-001',
    organizerId: 'org-001',
    action: 'Event Updated',
    details: 'Updated pricing for "Salsa Night Downtown"',
    category: 'event_management',
    timestamp: '2024-12-19T14:30:00Z',
    metadata: { eventId: 'event-001', field: 'pricing' }
  },
  {
    id: 'log-002',
    userId: 'tm-002',
    organizerId: 'org-001',
    action: 'Check-in Processed',
    details: 'Processed 25 attendee check-ins',
    category: 'event_management',
    timestamp: '2024-12-19T16:45:00Z',
    metadata: { eventId: 'event-002', attendeeCount: 25 }
  },
  {
    id: 'log-003',
    userId: 'tm-003',
    organizerId: 'org-001',
    action: 'Campaign Created',
    details: 'Created email campaign "Winter Dance Series"',
    category: 'marketing',
    timestamp: '2024-12-19T13:15:00Z',
    metadata: { campaignId: 'camp-001', type: 'email' }
  }
];

class FollowerService {
  // Team Member Management
  async getTeamMembers(organizerId: string, filters?: TeamMemberFilters): Promise<TeamMember[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredMembers = mockTeamMembers.filter(member => member.organizerId === organizerId);
    
    if (filters) {
      if (filters.role && filters.role.length > 0) {
        filteredMembers = filteredMembers.filter(member => filters.role!.includes(member.role));
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredMembers = filteredMembers.filter(member => filters.status!.includes(member.status));
      }
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredMembers = filteredMembers.filter(member =>
          member.name.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term) ||
          member.specialties.some(specialty => specialty.toLowerCase().includes(term))
        );
      }
      
      if (filters.specialties && filters.specialties.length > 0) {
        filteredMembers = filteredMembers.filter(member =>
          filters.specialties!.some(specialty => member.specialties.includes(specialty))
        );
      }
    }
    
    return filteredMembers;
  }

  async getTeamMember(memberId: string): Promise<TeamMember | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTeamMembers.find(member => member.id === memberId) || null;
  }

  async updateTeamMemberRole(memberId: string, newRole: UserRole): Promise<TeamMember> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Team member not found');
    }
    
    member.role = newRole;
    return member;
  }

  async updateTeamMemberStatus(memberId: string, status: 'active' | 'suspended'): Promise<TeamMember> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Team member not found');
    }
    
    member.status = status;
    return member;
  }

  async updateTeamMemberProfile(memberId: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Team member not found');
    }
    
    Object.assign(member, updates);
    return member;
  }

  async removeTeamMember(memberId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTeamMembers.findIndex(m => m.id === memberId);
    if (index === -1) {
      throw new Error('Team member not found');
    }
    
    mockTeamMembers.splice(index, 1);
  }

  // Invitation Management
  async getInvitations(organizerId: string): Promise<TeamInvitation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockInvitations.filter(inv => inv.organizerId === organizerId);
  }

  async sendInvitation(organizerId: string, email: string, role: UserRole, message?: string): Promise<TeamInvitation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const invitation: TeamInvitation = {
      id: `inv-${Date.now()}`,
      organizerId,
      email,
      role,
      status: 'pending',
      invitedBy: organizerId,
      invitedAt: new Date().toISOString(),
      expiresAt: addDays(new Date(), 7).toISOString(),
      message,
      token: `token-${Date.now()}`
    };
    
    mockInvitations.push(invitation);
    return invitation;
  }

  async resendInvitation(invitationId: string): Promise<TeamInvitation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const invitation = mockInvitations.find(inv => inv.id === invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    
    invitation.invitedAt = new Date().toISOString();
    invitation.expiresAt = addDays(new Date(), 7).toISOString();
    return invitation;
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockInvitations.findIndex(inv => inv.id === invitationId);
    if (index === -1) {
      throw new Error('Invitation not found');
    }
    
    mockInvitations.splice(index, 1);
  }

  // Role and Permission Management
  getRoleConfigs(): RoleConfig[] {
    return ROLE_CONFIGS;
  }

  getPermissions(): Permission[] {
    return PERMISSIONS;
  }

  getRolePermissions(role: UserRole): string[] {
    const roleConfig = ROLE_CONFIGS.find(config => config.role === role);
    return roleConfig?.permissions || [];
  }

  hasPermission(role: UserRole, permission: string): boolean {
    const permissions = this.getRolePermissions(role);
    return permissions.includes(permission);
  }

  // Activity Tracking
  async getActivityLogs(organizerId: string, limit = 50): Promise<ActivityLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockActivityLogs
      .filter(log => log.organizerId === organizerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async logActivity(organizerId: string, userId: string, action: string, details: string, category: ActivityLog['category'], metadata?: Record<string, any>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId,
      organizerId,
      action,
      details,
      category,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    mockActivityLogs.push(log);
  }

  // Analytics
  async getTeamAnalytics(organizerId: string): Promise<TeamAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const members = await this.getTeamMembers(organizerId);
    const activeMembers = members.filter(m => m.status === 'active');
    
    const roleDistribution = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);
    
    const totalSales = members.reduce((sum, member) => sum + member.performance.totalSales, 0);
    const totalEventsManaged = members.reduce((sum, member) => sum + member.performance.eventsManaged, 0);
    const averageTeamRating = members.length > 0 
      ? members.reduce((sum, member) => sum + member.performance.averageRating, 0) / members.length 
      : 0;
    
    const topPerformers = [...members]
      .sort((a, b) => b.performance.totalSales - a.performance.totalSales)
      .slice(0, 5);
    
    return {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      roleDistribution,
      totalSales,
      totalEventsManaged,
      averageTeamRating,
      activitySummary: {
        daily: [12, 18, 25, 32, 28, 35, 42],
        weekly: [180, 220, 195, 240],
        monthly: [850, 920, 1100]
      },
      topPerformers
    };
  }

  // Bulk Operations
  async bulkUpdateRoles(memberIds: string[], newRole: UserRole): Promise<TeamMember[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedMembers: TeamMember[] = [];
    
    for (const memberId of memberIds) {
      const member = mockTeamMembers.find(m => m.id === memberId);
      if (member) {
        member.role = newRole;
        updatedMembers.push(member);
      }
    }
    
    return updatedMembers;
  }

  async bulkUpdateStatus(memberIds: string[], status: 'active' | 'suspended'): Promise<TeamMember[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedMembers: TeamMember[] = [];
    
    for (const memberId of memberIds) {
      const member = mockTeamMembers.find(m => m.id === memberId);
      if (member) {
        member.status = status;
        updatedMembers.push(member);
      }
    }
    
    return updatedMembers;
  }

  // Utility Methods
  async searchUsers(organizerId: string, searchTerm: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock user search results for invitation system
    const mockUsers = [
      { id: 'user-005', email: 'john.doe@email.com', name: 'John Doe', avatar: null },
      { id: 'user-006', email: 'jane.smith@email.com', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2eb4a7e?w=400&h=400&fit=crop&crop=face' },
      { id: 'user-007', email: 'alex.wilson@email.com', name: 'Alex Wilson', avatar: null }
    ];
    
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async getAvailableSpecialties(): Promise<string[]> {
    return [
      'Corporate Events',
      'Wedding Coordination',
      'Sales & Marketing',
      'Customer Relations',
      'Event Operations',
      'Check-in Management',
      'Technical Support',
      'Social Media',
      'Content Creation',
      'Email Marketing',
      'Photography',
      'Event Documentation',
      'Audio/Visual',
      'Catering Coordination',
      'Security Management',
      'Vendor Relations'
    ];
  }
}

export const followerService = new FollowerService();
export { PERMISSIONS, ROLE_CONFIGS };
export type { TeamMember, TeamInvitation, ActivityLog, TeamAnalytics, TeamMemberFilters }; 