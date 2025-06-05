import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateAdZoneDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateAdZoneDialog: React.FC<CreateAdZoneDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Ad Zone</DialogTitle>
          <DialogDescription>
            Create a new advertising zone with custom specifications
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-gray-500">
            Ad zone creation form will be implemented here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 