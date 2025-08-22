'use client';

import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  canSubmit?: boolean;
}

export default function FormDialog({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  loading = false,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  canSubmit = true
}: FormDialogProps) {
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !canSubmit}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}