// User Dashboard Service
// Handles user roles, dashboard content, role activation, and onboarding

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  isActive: boolean;
  activatedAt?: string;
  requirements?: string[];
  benefits: string[];
  permissions: string[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'recent_activity' | 'quick_actions' | 'recommendations' | 'progress';
  roleRestriction?: string[];
  data: any;
  priority: number;
  isVisible: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: {
    type: 'link' | 'modal' | 'tour';
    target: string;
    label: string;
  };
}

export interface UserProgress {
  profileCompletion: number;
  rolesActivated: number;
  totalSteps: number;
  completedSteps: number;
  nextSteps: OnboardingStep[];
}

export interface ContentCreationOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  roleRequired: string;
  route: string;
  comingSoon?: boolean;
  featured?: boolean;
}

// Mock user roles data
const mockUserRoles: UserRole[] = [
  {
    id: 'attendee',
    name: 'attendee',
    displayName: 'Community Member',
    description: 'Basic community member who attends events and classes',
    icon: 'Users',
    isActive: true,
    activatedAt: '2024-01-01T00:00:00Z',
    benefits: ['Browse events', 'Purchase tickets', 'Join community discussions', 'Rate and review events'],
    permissions: ['view_events', 'purchase_tickets', 'write_reviews']
  },
  {
    id: 'organizer',
    name: 'organizer', 
    displayName: 'Event Organizer',
    description: 'Create and manage events, track sales and analytics',
    icon: 'Calendar',
    isActive: false,
    requirements: ['Create your first event'],
    benefits: ['Create unlimited events', 'Access sales analytics', 'Manage attendees', 'Email marketing tools'],
    permissions: ['create_events', 'manage_events', 'view_analytics', 'send_campaigns']
  },
  {
    id: 'instructor',
    name: 'instructor',
    displayName: 'Dance Instructor', 
    description: 'Teach classes and workshops, build your following',
    icon: 'GraduationCap',
    isActive: false,
    requirements: ['List your first class or workshop'],
    benefits: ['Create class listings', 'Build instructor profile', 'Manage students', 'Offer VOD classes'],
    permissions: ['create_classes', 'manage_students', 'create_vod', 'instructor_analytics']
  },
  {
    id: 'service_provider',
    name: 'service_provider',
    displayName: 'Service Provider',
    description: 'List your services in the community directory',
    icon: 'Briefcase',
    isActive: false,
    requirements: ['List your first service'],
    benefits: ['Service directory listing', 'Customer reviews', 'Business analytics', 'Direct bookings'],
    permissions: ['create_services', 'manage_bookings', 'view_reviews']
  },
  {
    id: 'store_owner',
    name: 'store_owner',
    displayName: 'Store Owner',
    description: 'List your store in the community marketplace',
    icon: 'Store',
    isActive: false,
    requirements: ['List your store'],
    benefits: ['Store directory listing', 'Product showcase', 'Customer reviews', 'Sales tracking'],
    permissions: ['create_store', 'manage_products', 'view_sales']
  }
];

// Mock content creation options
const mockContentOptions: ContentCreationOption[] = [
  {
    id: 'create_event',
    title: 'Post an Event',
    description: 'Create a stepping event, social, or competition',
    icon: 'Calendar',
    roleRequired: 'organizer',
    route: '/organizer/events/create',
    featured: true
  },
  {
    id: 'create_class',
    title: 'List a Physical Class',
    description: 'Offer in-person dance classes and workshops', 
    icon: 'GraduationCap',
    roleRequired: 'instructor',
    route: '/instructor/classes/create',
    comingSoon: true
  },
  {
    id: 'create_vod',
    title: 'Offer a VOD Class',
    description: 'Create video-on-demand dance instruction',
    icon: 'Video',
    roleRequired: 'instructor', 
    route: '/instructor/vod/create',
    comingSoon: true
  },
  {
    id: 'list_service',
    title: 'List Your Service',
    description: 'Add your business to the service directory',
    icon: 'Briefcase',
    roleRequired: 'service_provider',
    route: '/services/create',
    comingSoon: true
  },
  {
    id: 'list_store',
    title: 'Submit Your Store', 
    description: 'Add your store to the community directory',
    icon: 'Store',
    roleRequired: 'store_owner',
    route: '/stores/submit',
    featured: true
  }
];

class UserDashboardService {
  // Get user roles and their activation status
  async getUserRoles(userId: string): Promise<UserRole[]> {
    // In real implementation, fetch from API
    return Promise.resolve(mockUserRoles);
  }

  // Activate a new role for the user
  async activateRole(userId: string, roleId: string): Promise<UserRole> {
    const role = mockUserRoles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Mark role as active
    role.isActive = true;
    role.activatedAt = new Date().toISOString();

    return Promise.resolve(role);
  }

  // Get content creation options based on user roles
  async getContentCreationOptions(userRoles: string[]): Promise<ContentCreationOption[]> {
    // Filter options based on user's active roles
    const availableOptions = mockContentOptions.filter(option => 
      userRoles.includes(option.roleRequired) || option.roleRequired === 'attendee'
    );

    return Promise.resolve(availableOptions);
  }

  // Get all content creation options (for discovery)
  async getAllContentCreationOptions(): Promise<ContentCreationOption[]> {
    return Promise.resolve(mockContentOptions);
  }

  // Get dashboard widgets based on user roles
  async getDashboardWidgets(userId: string, userRoles: string[]): Promise<DashboardWidget[]> {
    const widgets: DashboardWidget[] = [
      {
        id: 'welcome',
        title: 'Welcome to SteppersLife',
        type: 'recommendations',
        data: {
          message: 'Start your journey by exploring events, classes, and connecting with the community.',
          suggestions: [
            { title: 'Complete your profile', route: '/account/profile', icon: 'User' },
            { title: 'Browse upcoming events', route: '/events', icon: 'Calendar' },
            { title: 'Find dance classes', route: '/classes', icon: 'GraduationCap' },
            { title: 'Join community discussions', route: '/community', icon: 'MessageCircle' }
          ]
        },
        priority: 1,
        isVisible: true
      },
      {
        id: 'recent_activity',
        title: 'Recent Activity',
        type: 'recent_activity',
        data: {
          activities: [
            { type: 'ticket_purchase', event: 'Chicago Steppers Social', date: '2024-01-15', icon: 'Ticket' },
            { type: 'class_enrollment', class: 'Beginner Workshop', date: '2024-01-10', icon: 'GraduationCap' },
            { type: 'review_posted', event: 'Advanced Techniques', rating: 5, date: '2024-01-08', icon: 'Star' }
          ]
        },
        priority: 2,
        isVisible: true
      },
      {
        id: 'upcoming_events',
        title: 'Your Upcoming Events',
        type: 'stats',
        data: {
          count: 3,
          items: [
            { title: 'Chicago Steppers Social', date: '2024-02-15', time: '8:00 PM', location: 'Chicago Cultural Center' },
            { title: 'Beginner Workshop', date: '2024-02-18', time: '2:00 PM', location: 'Dance Studio Downtown' },
            { title: 'Advanced Masterclass', date: '2024-02-22', time: '7:30 PM', location: 'Community Center' }
          ]
        },
        priority: 3,
        isVisible: true
      }
    ];

    // Add role-specific widgets
    if (userRoles.includes('organizer')) {
      widgets.push({
        id: 'organizer_stats',
        title: 'Your Events',
        type: 'stats',
        roleRestriction: ['organizer'],
        data: {
          total_events: 5,
          active_events: 2,
          total_revenue: 2500,
          total_attendees: 180
        },
        priority: 1,
        isVisible: true
      });
    }

    if (userRoles.includes('instructor')) {
      widgets.push({
        id: 'instructor_stats',
        title: 'Your Classes',
        type: 'stats', 
        roleRestriction: ['instructor'],
        data: {
          total_classes: 8,
          active_classes: 3,
          total_students: 45,
          average_rating: 4.8
        },
        priority: 1,
        isVisible: true
      });
    }

    return Promise.resolve(widgets);
  }

  // Get user onboarding progress
  async getUserProgress(userId: string): Promise<UserProgress> {
    const mockProgress: UserProgress = {
      profileCompletion: 75,
      rolesActivated: 1,
      totalSteps: 8,
      completedSteps: 6,
      nextSteps: [
        {
          id: 'complete_profile',
          title: 'Complete Your Profile',
          description: 'Add a profile photo and bio to connect with the community',
          completed: false,
          action: {
            type: 'link',
            target: '/account/profile',
            label: 'Update Profile'
          }
        },
        {
          id: 'join_first_event',
          title: 'Attend Your First Event',
          description: 'Purchase tickets to a stepping event and join the community',
          completed: false,
          action: {
            type: 'link',
            target: '/events',
            label: 'Browse Events'
          }
        }
      ]
    };

    return Promise.resolve(mockProgress);
  }

  // Get role activation suggestions
  async getRoleActivationSuggestions(userId: string, currentRoles: string[]): Promise<UserRole[]> {
    // Return roles that haven't been activated yet
    const inactiveRoles = mockUserRoles.filter(role => 
      !currentRoles.includes(role.id) && role.id !== 'attendee'
    );

    return Promise.resolve(inactiveRoles);
  }

  // Update dashboard widget visibility
  async updateWidgetVisibility(userId: string, widgetId: string, isVisible: boolean): Promise<void> {
    // In real implementation, save to user preferences
    return Promise.resolve();
  }

  // Get community recommendations
  async getCommunityRecommendations(userId: string): Promise<any[]> {
    const recommendations = [
      {
        type: 'event',
        title: 'Chicago Steppers Social',
        description: 'Perfect for meeting other steppers in your area',
        image: '/placeholder.svg',
        route: '/event/chicago-steppers-social',
        reason: 'Popular in your area'
      },
      {
        type: 'instructor',
        title: 'Angela Davis',
        description: 'Master instructor with 15+ years experience',
        image: '/placeholder.svg',
        route: '/instructor/angela-davis',
        reason: 'Highly rated instructor'
      },
      {
        type: 'class',
        title: 'Beginner Workshop',
        description: 'Perfect for learning the fundamentals',
        image: '/placeholder.svg',
        route: '/class/beginner-workshop',
        reason: 'Matches your skill level'
      }
    ];

    return Promise.resolve(recommendations);
  }
}

export const userDashboardService = new UserDashboardService(); 