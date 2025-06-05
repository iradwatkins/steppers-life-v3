export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'organizer' | 'instructor' | 'admin' | 'event_staff' | 'sales_agent';
  status: 'active' | 'pending_approval' | 'suspended' | 'deactivated';
  registrationDate: string;
  lastLogin: string;
  vodSubscriptionStatus?: 'active' | 'inactive' | 'trialing';
  contactPhone?: string;
  address?: string;
  bio?: string;
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'buyer',
    status: 'active',
    registrationDate: '2023-01-15',
    lastLogin: '2024-07-20',
  },
  {
    id: 'user-002',
    name: 'Bob Organizer',
    email: 'bob.o@example.com',
    role: 'organizer',
    status: 'pending_approval',
    registrationDate: '2023-03-01',
    lastLogin: '2024-07-19',
    bio: 'Experienced event planner focusing on dance competitions.'
  },
  {
    id: 'user-003',
    name: 'Charlie Instructor',
    email: 'charlie.i@example.com',
    role: 'instructor',
    status: 'active',
    registrationDate: '2023-02-10',
    lastLogin: '2024-07-21',
    vodSubscriptionStatus: 'active',
    bio: 'Pro dancer and choreographer, specializing in hip-hop.'
  },
  {
    id: 'user-004',
    name: 'Diana Admin',
    email: 'diana.a@example.com',
    role: 'admin',
    status: 'active',
    registrationDate: '2022-11-01',
    lastLogin: '2024-07-22',
  },
  {
    id: 'user-005',
    name: 'Eve Eventstaff',
    email: 'eve.e@example.com',
    role: 'event_staff',
    status: 'active',
    registrationDate: '2023-06-10',
    lastLogin: '2024-07-20',
  },
  {
    id: 'user-006',
    name: 'Frank Sales',
    email: 'frank.s@example.com',
    role: 'sales_agent',
    status: 'active',
    registrationDate: '2023-07-05',
    lastLogin: '2024-07-21',
  },
  {
    id: 'user-007',
    name: 'Grace Buyer',
    email: 'grace.b@example.com',
    role: 'buyer',
    status: 'active',
    registrationDate: '2024-01-20',
    lastLogin: '2024-07-18',
  },
  {
    id: 'user-008',
    name: 'Henry Suspended',
    email: 'henry.s@example.com',
    role: 'buyer',
    status: 'suspended',
    registrationDate: '2023-04-10',
    lastLogin: '2024-06-01',
  },
  {
    id: 'user-009',
    name: 'Ivy Deactivated',
    email: 'ivy.d@example.com',
    role: 'organizer',
    status: 'deactivated',
    registrationDate: '2023-05-15',
    lastLogin: '2024-05-10',
  },
  {
    id: 'user-010',
    name: 'Jack Newbie',
    email: 'jack.n@example.com',
    role: 'buyer',
    status: 'pending_approval', // Example of a new buyer pending verification
    registrationDate: '2024-07-22',
    lastLogin: '2024-07-22',
  },
];

class AdminUserService {
  private users: User[] = [...mockUsers];

  async getUsers(
    query: string = '',
    role: User['role'] | '' = '',
    status: User['status'] | '' = '',
    page: number = 1,
    limit: number = 10,
    sortBy: keyof User = 'registrationDate',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ users: User[]; total: number; }> {
    console.log(`AdminUserService: Fetching users with query: "${query}", role: "${role}", status: "${status}", page: ${page}, limit: ${limit}, sortBy: "${sortBy}", sortOrder: "${sortOrder}"`);

    let filteredUsers = this.users.filter(user => {
      const matchesQuery = query
        ? user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.id.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesRole = role ? user.role === role : true;
      const matchesStatus = status ? user.status === status : true;
      return matchesQuery && matchesRole && matchesStatus;
    });

    // Sort users
    filteredUsers.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      // Fallback for other types or if values are not comparable as strings/numbers
      return 0;
    });

    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return new Promise((resolve) =>
      setTimeout(() => resolve({ users: paginatedUsers, total }), 500)
    );
  }

  async getUserById(userId: string): Promise<User | null> {
    console.log(`AdminUserService: Fetching user by ID: ${userId}`);
    return new Promise((resolve) =>
      setTimeout(() => resolve(this.users.find(user => user.id === userId) || null), 300)
    );
  }

  async updateUserStatus(userId: string, newStatus: User['status'], auditReason: string): Promise<User> {
    console.log(`AdminUserService: Updating status for user ${userId} to ${newStatus}. Reason: ${auditReason}`);
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...this.users[userIndex], status: newStatus };
    this.users[userIndex] = updatedUser;

    // In a real app, this would log to an audit trail service
    console.log(`AUDIT: User ${userId} status changed to ${newStatus} by admin. Reason: ${auditReason}`);

    return new Promise((resolve) => setTimeout(() => resolve(updatedUser), 300));
  }

  async approveOrganizerAccount(organizerId: string): Promise<User> {
    console.log(`AdminUserService: Approving organizer account for ${organizerId}`);
    return this.updateUserStatus(organizerId, 'active', 'Organizer account approved by admin');
  }

  async manageInstructorVODSubscription(
    instructorId: string,
    status: User['vodSubscriptionStatus']
  ): Promise<User> {
    console.log(`AdminUserService: Managing VOD subscription for instructor ${instructorId}, setting to ${status}`);
    const userIndex = this.users.findIndex(user => user.id === instructorId && user.role === 'instructor');
    if (userIndex === -1) {
      throw new Error('Instructor not found');
    }

    const updatedUser = { ...this.users[userIndex], vodSubscriptionStatus: status };
    this.users[userIndex] = updatedUser;

    console.log(`AUDIT: Instructor ${instructorId} VOD subscription changed to ${status} by admin.`);

    return new Promise((resolve) => setTimeout(() => resolve(updatedUser), 300));
  }

  async resetUserPassword(userId: string): Promise<{ message: string }> {
    console.log(`AdminUserService: Initiating password reset for user ${userId}`);
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, this would send an email with a reset link
    return new Promise((resolve) =>
      setTimeout(() => resolve({ message: `Password reset link sent to ${user.email}` }), 300)
    );
  }
}

export const adminUserService = new AdminUserService(); 