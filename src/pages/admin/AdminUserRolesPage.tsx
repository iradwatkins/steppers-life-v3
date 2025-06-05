import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Edit, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUserRolesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <Button className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">System Roles</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage platform roles including:
              </p>
              <ul className="list-disc text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
                <li>Administrator privileges</li>
                <li>Event organizer permissions</li>
                <li>Instructor roles</li>
                <li>Standard user access</li>
              </ul>
              <Button className="mt-4">
                <Shield className="h-4 w-4 mr-2" />
                Manage Roles
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Permission Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2">Permission Settings</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Configure role permissions:
              </p>
              <ul className="list-disc text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
                <li>Event creation rights</li>
                <li>User management access</li>
                <li>Content moderation</li>
                <li>Financial data access</li>
              </ul>
              <Button className="mt-4">
                <Edit className="h-4 w-4 mr-2" />
                Edit Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">User Assignments</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage user role assignments:
              </p>
              <ul className="list-disc text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
                <li>Bulk role assignments</li>
                <li>Role change history</li>
                <li>Permission inheritance</li>
                <li>Temporary role grants</li>
              </ul>
              <Button className="mt-4">
                <Users className="h-4 w-4 mr-2" />
                View Assignments
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Custom Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2">Role Builder</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create custom roles with specific permissions:
              </p>
              <ul className="list-disc text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
                <li>Custom permission sets</li>
                <li>Role hierarchies</li>
                <li>Department-specific roles</li>
                <li>Specialized access levels</li>
              </ul>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserRolesPage; 