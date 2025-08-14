'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, UserCheck, UserX } from 'lucide-react';
import CreateUserDialog from '@/components/admin/CreateUserDialog';
import UserActionButtons from '@/components/admin/UserActionButtons';
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

interface UsersResponse {
  users: User[];
  total: number;
  limit?: number;
  offset?: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'registrationDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use our custom API to get all user data including custom fields
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        toast.error('Error al cargar usuarios');
        return;
      }
      
      const data = await response.json();
      if (data.users) {
        let fetchedUsers = data.users;
        console.log('Fetched users:', fetchedUsers);
        
        // Client-side filtering and sorting since our API returns all users
        if (searchTerm) {
          fetchedUsers = fetchedUsers.filter((user: User) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Client-side sorting
        fetchedUsers.sort((a: User, b: User) => {
          let aValue, bValue;
          if (sortBy === 'registrationDate') {
            aValue = new Date(a.registrationDate).getTime();
            bValue = new Date(b.registrationDate).getTime();
          } else {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        setUsers(fetchedUsers);
        setTotal(fetchedUsers.length);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, sortBy, sortOrder]);

  // Users are already filtered and sorted in fetchUsers

  const activeUsers = users.filter(user => user.active).length;
  const inactiveUsers = users.filter(user => !user.active).length;

  const handleUserCreated = () => {
    setShowCreateDialog(false);
    fetchUsers();
    toast.success('Usuario creado exitosamente');
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'direccion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra usuarios del sistema y sus permisos
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados en el sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios con acceso al sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios deshabilitados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuarios por nombre, usuario o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'registrationDate')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="name">Ordenar por Nombre</option>
                <option value="registrationDate">Ordenar por Fecha</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          {!user.active && (
                            <Badge variant="destructive" className="text-xs">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            @{user.username}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </span>
                          <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Registrado: {new Date(user.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <UserActionButtons user={user} onUserUpdated={handleUserUpdated} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}