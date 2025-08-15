'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import FormDialog from '@/components/ui/FormDialog';

interface DocumentType {
  id: string;
  name: string;
  description?: string;
}

interface EditDocumentTypeFormProps {
  open: boolean;
  onClose: () => void;
  onDocumentTypeUpdated: () => void;
  documentType: DocumentType | null;
}

export default function EditDocumentTypeForm({ 
  open, 
  onClose, 
  onDocumentTypeUpdated,
  documentType
}: EditDocumentTypeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Pre-populate form when documentType changes
  useEffect(() => {
    if (documentType) {
      setFormData({
        name: documentType.name,
        description: documentType.description || '',
      });
    }
  }, [documentType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre del tipo documental es requerido');
      return;
    }

    if (!documentType || !documentType.id) {
      toast.error('No se pudo cargar la información del tipo documental');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/document-types/${documentType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Error al actualizar tipo documental';
        try {
          const result = await response.json();
          errorMessage = result.error || errorMessage;
        } catch (e) {
          // Error parsing failed, use default message
        }
        toast.error(errorMessage);
        return;
      }

      // Try to parse success response, but don't fail if it's empty
      try {
        await response.json();
      } catch (e) {
        // No JSON response body, but request was successful
      }

      onDocumentTypeUpdated();
      onClose();
      toast.success('Tipo documental actualizado exitosamente');
    } catch (error) {
      console.error('Error updating document type:', error);
      toast.error('Error al actualizar tipo documental');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset to original values on close
      if (documentType) {
        setFormData({
          name: documentType.name,
          description: documentType.description || '',
        });
      }
      onClose();
    }
  };

  const canSubmit = formData.name.trim().length > 0;

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Editar Tipo Documental"
      description="Modifica los datos del tipo documental. El nombre debe ser único y no puede estar vacío."
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Guardar Cambios"
      canSubmit={canSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="editDocumentTypeName">Nombre de Tipo Documental *</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="editDocumentTypeName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ingresa el nombre del tipo documental"
            className="pl-10"
            required
            disabled={loading}
            maxLength={100}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editDocumentTypeDescription">Descripción (Opcional)</Label>
        <Input
          id="editDocumentTypeDescription"
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descripción del tipo documental"
          disabled={loading}
          maxLength={255}
        />
        <p className="text-xs text-gray-500">Ayuda a identificar este tipo documental</p>
      </div>
    </FormDialog>
  );
}