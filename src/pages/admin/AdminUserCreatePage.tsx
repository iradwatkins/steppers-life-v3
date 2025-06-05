import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUserCreatePage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add User</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new user account
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            User Creation Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">User Registration</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The user creation form will be implemented here including:
            </p>
            <ul className="list-disc text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
              <li>Personal information fields</li>
              <li>Contact details</li>
              <li>Role assignment</li>
              <li>Permission settings</li>
              <li>Account activation options</li>
              <li>Email verification setup</li>
            </ul>
            <div className="flex gap-4 justify-center mt-6">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Create User
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserCreatePage; 