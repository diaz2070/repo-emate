'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MoreHorizontal, UserCheck, UserX, Trash2, Edit } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { getRoles } from '@/lib/roles';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  registrationDate: string;
}

interface UserActionButtonsProps {
  user: User;
  onUserUpdated: () => void;
}

export default function UserActionButtons({ user, onUserUpdated }: UserActionButtonsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const roles = getRoles().roles;

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      // Update user status via our custom API
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          active: !user.active,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      onUserUpdated();
      toast.success(`Usuario ${!user.active ? 'activado' : 'desactivado'} exitosamente`);
      setShowMenu(false);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error al actualizar estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      
      // Use Better Auth's admin removeUser API
      const result = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (result.error) {
        toast.error(result.error.message || 'Error al eliminar usuario');
        return;
      }

      onUserUpdated();
      toast.success('Usuario eliminado exitosamente');
      setShowDeleteDialog(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (selectedRole === user.role) {
      setShowRoleDialog(false);
      return;
    }

    try {
      setLoading(true);
      
      // Ensure selectedRole is a valid role type
      if (selectedRole !== 'user' && selectedRole !== 'admin') {
        toast.error('Rol inválido');
        return;
      }

      // Use Better Auth's admin setRole API
      const result = await authClient.admin.setRole({
        userId: user.id,
        role: selectedRole,
      });

      if (result.error) {
        toast.error(result.error.message || 'Error al cambiar rol');
        return;
      }

      onUserUpdated();
      toast.success('Rol actualizado exitosamente');
      setShowRoleDialog(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Error al cambiar rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={handleToggleStatus}
                disabled={loading}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {user.active ? (
                  <>
                    <UserX className="w-4 h-4 text-red-500" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-green-500" />
                    Activar
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowRoleDialog(true);
                  setSelectedRole(user.role);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4" />
                Cambiar Rol
              </button>
              
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{user.name}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar Usuario'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo rol para <strong>{user.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol Actual: <span className="font-normal">{user.role}</span></label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={loading || selectedRole === user.role}
            >
              {loading ? 'Actualizando...' : 'Cambiar Rol'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}