'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import FormDialog from '@/components/ui/FormDialog';

interface CreateDocumentTypeFormProps {
  open: boolean;
  onClose: () => void;
  onDocumentTypeCreated: () => void;
}

export default function CreateDocumentTypeForm({ 
  open, 
  onClose, 
  onDocumentTypeCreated 
}: CreateDocumentTypeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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

    try {
      setLoading(true);

      const response = await fetch('/api/admin/document-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Error al crear tipo documental');
        return;
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
      });

      onDocumentTypeCreated();
      onClose();
      toast.success('Tipo documental creado exitosamente');
    } catch (error) {
      console.error('Error creating document type:', error);
      toast.error('Error al crear tipo documental');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        description: '',
      });
      onClose();
    }
  };

  const canSubmit = formData.name.trim().length > 0;

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Crear nuevo Tipo Documental"
      description="Completa los siguientes datos con un nombre único y no debe estar vacío."
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Crear Tipo"
      canSubmit={canSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="documentTypeName">Nombre de Tipo Documental *</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="documentTypeName"
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
        <Label htmlFor="documentTypeDescription">Descripción (Opcional)</Label>
        <Input
          id="documentTypeDescription"
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