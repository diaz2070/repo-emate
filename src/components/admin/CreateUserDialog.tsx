'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { getRoles } from '@/lib/roles';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export default function CreateUserDialog({ open, onClose, onUserCreated }: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const roles = getRoles().roles;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.role) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    try {
      setLoading(true);

      // Use Better Auth's admin createUser API
      const result = await authClient.admin.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        data: { username: formData.username, role: formData.role, }
      });

      if (result.error) {
        toast.error(result.error.message || 'Error al crear usuario');
        return;
      }

      // Reset form
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: '',
      });

      onUserCreated();
      toast.success('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nombre completo del usuario"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="nombre.usuario"
              required
              minLength={5}
              maxLength={20}
            />
            <p className="text-xs text-gray-600">Entre 5 y 20 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Contraseña segura"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-600">Mínimo 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear Usuario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}