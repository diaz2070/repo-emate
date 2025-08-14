'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Plus, Settings, BarChart3, FileText } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { getRoles } from '@/lib/roles';
import { toast } from 'sonner';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  recentUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const roles = getRoles().roles;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Use our custom API to get all user data including custom fields
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        toast.error('Error al cargar estadísticas');
        return;
      }

      const data = await response.json();
      if (data.users) {
        const users = data.users;
        console.log('Fetched users:', users);
        
        // Count active/inactive users (assuming active field exists, default to true if missing)
        const activeUsers = users.filter((user: any) => user.active === true).length;
        const inactiveUsers = users.filter((user: any) => user.active === false).length;
        
        // Calculate recent users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentUsers = users.filter((user: any) => 
          new Date(user.registrationDate || user.createdAt) > thirtyDaysAgo
        ).length;

        setStats({
          totalUsers: users.length,
          activeUsers,
          inactiveUsers,
          recentUsers,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona usuarios y configuraciones del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
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
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Con acceso al sistema
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Sin acceso al sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos (30 días)</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.recentUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registrados recientemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Administra usuarios del sistema, sus roles y permisos
            </p>
            <div className="flex gap-2">
              <Link href="/admin/usuarios">
                <Button className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ver Usuarios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos Documentales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gestiona los tipos documentales del sistema
            </p>
            <div className="flex gap-2">
              <Link href="/admin/document-types">
                <Button className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ver Tipos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Roles disponibles en el sistema ({roles.length} configurados)
            </p>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {roles.slice(0, 6).map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  >
                    {role.name}
                  </span>
                ))}
                {roles.length > 6 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                    +{roles.length - 6} más
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-900 dark:text-white">Roles Configurados</dt>
              <dd className="text-gray-600 dark:text-gray-400">{roles.length} roles disponibles</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900 dark:text-white">Última Actualización</dt>
              <dd className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900 dark:text-white">Estado del Sistema</dt>
              <dd className="text-green-600 dark:text-green-400">Operativo</dd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}