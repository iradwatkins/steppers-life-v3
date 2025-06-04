import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp, 
  Activity, 
  Search,
  Filter,
  MoreHorizontal,
  Crown,
  Shield,
  Megaphone,
  Eye,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFollowers } from '@/hooks/useFollowers';
import { type Follower, type TeamRole, type TeamInvitation } from '@/services/followerService';
import { toast } from 'sonner';

const FollowerManagementPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const organizerId = 'org_001'; // In real app, get from auth context
  
  const {
    followers,
    invitations,
    analytics,
    loading,
    error,
    updateFollowerRole,
    updateFollowerStatus,
    removeFollower,
    createInvitation,
    updateInvitationStatus,
    cancelInvitation,
    getFollowersByRole,
    getActiveTeamMembers,
    getTeamStats
  } = useFollowers({ organizerId });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<TeamRole | 'all'>('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'sales_agent' as TeamRole,
    message: '',
    position: '',
    compensation: ''
  });

  const teamStats = getTeamStats();

  // Role configurations
  const roleConfig = {
    follower: { 
      label: 'Follower', 
      icon: Users, 
      color: 'bg-gray-100 text-gray-800',
      description: 'Basic follower with limited access'
    },
    sales_agent: { 
      label: 'Sales Agent', 
      icon: TrendingUp, 
      color: 'bg-green-100 text-green-800',
      description: 'Can process sales and access customer data'
    },
    event_staff: { 
      label: 'Event Staff', 
      icon: Shield, 
      color: 'bg-blue-100 text-blue-800',
      description: 'Can manage events and check-in attendees'
    },
    marketing_assistant: { 
      label: 'Marketing Assistant', 
      icon: Megaphone, 
      color: 'bg-purple-100 text-purple-800',
      description: 'Can manage marketing campaigns and social media'
    }
  };

  // Filter followers based on search and role
  const filteredFollowers = followers.filter(follower => {
    const matchesSearch = follower.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         follower.profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || follower.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (followerId: string, newRole: TeamRole) => {
    await updateFollowerRole(followerId, newRole);
  };

  const handleStatusChange = async (followerId: string, status: Follower['status']) => {
    await updateFollowerStatus(followerId, status);
  };

  const handleRemoveFollower = async (followerId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      await removeFollower(followerId);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast.error('Please fill in required fields');
      return;
    }

    const success = await createInvitation({
      inviteeEmail: inviteForm.email,
      role: inviteForm.role,
      permissions: [], // Will be set by service based on role
      message: inviteForm.message,
      metadata: {
        position: inviteForm.position,
        compensation: inviteForm.compensation
      }
    });

    if (success) {
      setShowInviteDialog(false);
      setInviteForm({
        email: '',
        role: 'sales_agent',
        message: '',
        position: '',
        compensation: ''
      });
    }
  };

  const getStatusBadge = (status: Follower['status']) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: Clock3 },
      suspended: { label: 'Suspended', color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getInvitationStatusBadge = (status: TeamInvitation['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      declined: { label: 'Declined', color: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-primary" />
          <p className="text-text-secondary">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to={eventId ? `/organizer/event/${eventId}/manage` : '/organizer/dashboard'}
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Team Management</h1>
              <p className="text-text-secondary">Manage your followers and team members</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-brand-primary" />
                <div className="text-2xl font-bold text-text-primary">{teamStats.totalFollowers}</div>
                <div className="text-sm text-text-secondary">Total Followers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-text-primary">{teamStats.activeMembers}</div>
                <div className="text-sm text-text-secondary">Active Team Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Send className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-text-primary">{teamStats.pendingInvitations}</div>
                <div className="text-sm text-text-secondary">Pending Invitations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-text-primary">
                  ${analytics?.overview.totalSalesGenerated.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-text-secondary">Total Sales Generated</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="team" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-4">
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="followers">All Followers</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team with a specific role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role *</label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: TeamRole) => setInviteForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_agent">Sales Agent</SelectItem>
                        <SelectItem value="event_staff">Event Staff</SelectItem>
                        <SelectItem value="marketing_assistant">Marketing Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position Title</label>
                    <Input
                      placeholder="e.g., Part-time Sales Representative"
                      value={inviteForm.position}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Compensation</label>
                    <Input
                      placeholder="e.g., 15% commission"
                      value={inviteForm.compensation}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, compensation: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Personal Message</label>
                    <Textarea
                      placeholder="Add a personal message to your invitation..."
                      value={inviteForm.message}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendInvitation} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Team Members Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Team Members</CardTitle>
                    <CardDescription>
                      Manage roles and permissions for your active team members
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                      <Input
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as TeamRole | 'all')}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="sales_agent">Sales Agent</SelectItem>
                        <SelectItem value="event_staff">Event Staff</SelectItem>
                        <SelectItem value="marketing_assistant">Marketing Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getActiveTeamMembers().filter(member => {
                    const matchesSearch = member.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         member.profile.email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
                    return matchesSearch && matchesRole;
                  }).map((member) => {
                    const roleInfo = roleConfig[member.role];
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.profile.avatar} />
                            <AvatarFallback>
                              {member.profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-text-primary">{member.profile.name}</div>
                            <div className="text-sm text-text-secondary flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {member.profile.email}
                            </div>
                            {member.profile.location && (
                              <div className="text-sm text-text-secondary flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {member.profile.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={roleInfo.color}>
                                <RoleIcon className="h-3 w-3 mr-1" />
                                {roleInfo.label}
                              </Badge>
                              {getStatusBadge(member.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="font-medium text-text-primary">
                              ${member.performance.totalSales.toLocaleString()}
                            </div>
                            <div className="text-text-secondary">Total Sales</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium text-text-primary flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {member.performance.rating || 'N/A'}
                            </div>
                            <div className="text-text-secondary">Rating</div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {member.status === 'active' ? 'Suspend' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleRemoveFollower(member.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                  
                  {getActiveTeamMembers().length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-text-tertiary" />
                      <p className="text-text-secondary">No active team members found</p>
                      <Button onClick={() => setShowInviteDialog(true)} className="mt-4">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Your First Team Member
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Followers Tab */}
          <TabsContent value="followers">
            <Card>
              <CardHeader>
                <CardTitle>All Followers</CardTitle>
                <CardDescription>
                  View all users who follow you and promote them to team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFollowers.map((follower) => {
                    const roleInfo = roleConfig[follower.role];
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={follower.profile.avatar} />
                            <AvatarFallback>
                              {follower.profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-text-primary">{follower.profile.name}</div>
                            <div className="text-sm text-text-secondary">{follower.profile.email}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={roleInfo.color}>
                                <RoleIcon className="h-3 w-3 mr-1" />
                                {roleInfo.label}
                              </Badge>
                              {getStatusBadge(follower.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-text-secondary">
                            Joined {new Date(follower.joinedAt).toLocaleDateString()}
                          </div>
                          {follower.role === 'follower' && (
                            <Button size="sm" onClick={() => {/* Handle promote */}}>
                              <Crown className="h-4 w-4 mr-1" />
                              Promote
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Team Invitations</CardTitle>
                <CardDescription>
                  Manage pending and sent invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-text-primary">{invitation.inviteeEmail}</div>
                        <div className="text-sm text-text-secondary">
                          Invited for {roleConfig[invitation.role].label} role
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getInvitationStatusBadge(invitation.status)}
                          <span className="text-xs text-text-tertiary">
                            Sent {new Date(invitation.invitedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => cancelInvitation(invitation.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {invitations.length === 0 && (
                    <div className="text-center py-8">
                      <Send className="h-12 w-12 mx-auto mb-4 text-text-tertiary" />
                      <p className="text-text-secondary">No invitations sent yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Team Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Performance Rating</span>
                        <span className="font-medium">{analytics.overview.averagePerformance}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Sales Generated</span>
                        <span className="font-medium">${analytics.overview.totalSalesGenerated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Events Staffed</span>
                        <span className="font-medium">{analytics.overview.totalEventsStaffed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Invitation Acceptance Rate</span>
                        <span className="font-medium">{analytics.overview.acceptanceRate}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(teamStats.roleBreakdown).map(([role, count]) => {
                      const roleInfo = roleConfig[role as TeamRole];
                      return (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={roleInfo.color}>
                              {roleInfo.label}
                            </Badge>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FollowerManagementPage; 