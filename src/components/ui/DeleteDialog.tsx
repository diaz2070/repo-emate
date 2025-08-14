'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export default function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  description,
  itemName,
  loading = false,
  disabled = false,
  disabledReason
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting && !loading) {
      onClose();
    }
  };

  const finalDescription = description || 
    `¿Está seguro de que desea eliminar ${itemName ? `"${itemName}"` : 'este elemento'}?`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {finalDescription}
          </p>
          
          {disabled && disabledReason && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>No se puede eliminar:</strong> {disabledReason}
              </p>
            </div>
          )}
          
          {!disabled && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Esta acción no se puede deshacer.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleting || loading}
            className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {disabled ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!disabled && (
            <Button 
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting || loading}
              className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {(isDeleting || loading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}