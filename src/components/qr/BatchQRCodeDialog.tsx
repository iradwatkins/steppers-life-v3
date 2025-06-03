import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Upload, Settings, List } from 'lucide-react';

interface BatchQRCodeDialogProps {
  open: boolean;
  onClose: () => void;
  eventIds: string[];
}

export const BatchQRCodeDialog: React.FC<BatchQRCodeDialogProps> = ({ 
  open, 
  onClose, 
  eventIds 
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Batch Generate QR Codes
          </DialogTitle>
          <DialogDescription>
            Generate multiple QR codes at once using templates and naming conventions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Placeholder content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <List className="h-5 w-5 mr-2" />
                Batch Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Batch QR code generation form will be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features: Event selection, Template selection, Naming patterns, Bulk settings
                </p>
                {eventIds.length > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    {eventIds.length} event(s) selected for batch generation
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Generate QR Codes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 