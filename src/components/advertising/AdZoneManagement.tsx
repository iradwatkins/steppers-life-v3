import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const AdZoneManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ad Zone Management</CardTitle>
            <CardDescription>Manage advertising zones and their settings</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500 py-8">
          Ad zone management interface will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
}; 