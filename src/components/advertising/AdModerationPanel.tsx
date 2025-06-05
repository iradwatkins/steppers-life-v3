import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AdModerationPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Moderation</CardTitle>
        <CardDescription>Review reported ads and manage content moderation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500 py-8">
          Ad moderation panel will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
}; 