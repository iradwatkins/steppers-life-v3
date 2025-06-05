import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const DirectAdsManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct Ads Management</CardTitle>
        <CardDescription>Review and manage user-submitted advertisements</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500 py-8">
          Direct ads management interface will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
}; 