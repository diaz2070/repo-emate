export interface Role {
  id: string;
  name: string;
  level: number;
  permissions: string[];
}

export interface RoleConfig {
  roles: Role[];
  permissions: Record<string, string>;
}

// Hardcoded roles configuration
const ROLES_CONFIG: RoleConfig = {
  roles: [
    {
      id: "admin",
      name: "Admin",
      level: 1,
      permissions: ["all"]
    },
    {
      id: "direccion",
      name: "Dirección",
      level: 2,
      permissions: ["user_management", "view_all_documents", "approve_documents"]
    },
    {
      id: "secretaria_direccion",
      name: "Secretaría de Dirección",
      level: 3,
      permissions: ["view_documents", "create_documents", "edit_documents"]
    },
    {
      id: "jefatura_administrativa",
      name: "Jefatura Administrativa",
      level: 2,
      permissions: ["user_management", "view_administrative_documents", "approve_documents"]
    },
    {
      id: "secretaria_jefatura_administrativa",
      name: "Secretaría Jefatura Administrativa",
      level: 3,
      permissions: ["view_documents", "create_documents", "edit_documents"]
    },
    {
      id: "recepcion",
      name: "Recepción",
      level: 4,
      permissions: ["view_documents", "receive_documents"]
    },
    {
      id: "departamento_matematica_aplicada",
      name: "Departamento Matemática Aplicada",
      level: 3,
      permissions: ["view_documents", "create_documents", "manage_department_documents"]
    },
    {
      id: "secretaria_matematica_aplicada",
      name: "Secretaría Matemática Aplicada",
      level: 4,
      permissions: ["view_documents", "create_documents", "edit_documents"]
    },
    {
      id: "departamento_educacion_matematica",
      name: "Departamento Educación Matemática",
      level: 3,
      permissions: ["view_documents", "create_documents", "manage_department_documents"]
    },
    {
      id: "departamento_matematica_pura",
      name: "Departamento Matemática Pura",
      level: 3,
      permissions: ["view_documents", "create_documents", "manage_department_documents"]
    },
    {
      id: "secretaria_matematica_pura",
      name: "Secretaría Matemática Pura",
      level: 4,
      permissions: ["view_documents", "create_documents", "edit_documents"]
    },
    {
      id: "encargado_proyectos",
      name: "Encargado de Proyectos",
      level: 3,
      permissions: ["view_documents", "create_documents", "manage_project_documents"]
    },
    {
      id: "encargado_ti",
      name: "Encargado TI",
      level: 2,
      permissions: ["user_management", "system_administration", "view_all_documents"]
    },
    {
      id: "administrador_servidores",
      name: "Administrador Servidores",
      level: 2,
      permissions: ["system_administration", "server_management", "view_all_documents"]
    },
    {
      id: "archivo",
      name: "Archivo",
      level: 4,
      permissions: ["view_documents", "archive_documents", "retrieve_archived_documents"]
    }
  ],
  permissions: {
    "all": "Full system access",
    "user_management": "Create, edit, and manage users",
    "view_all_documents": "View all documents in the system",
    "view_documents": "View assigned documents",
    "create_documents": "Create new documents",
    "edit_documents": "Edit existing documents",
    "approve_documents": "Approve documents for publication",
    "manage_department_documents": "Manage documents within department",
    "manage_project_documents": "Manage project-related documents",
    "receive_documents": "Receive and process incoming documents",
    "system_administration": "System configuration and maintenance",
    "server_management": "Server administration and maintenance",
    "archive_documents": "Archive documents for long-term storage",
    "retrieve_archived_documents": "Retrieve documents from archive"
  }
};

export function getRoles(): RoleConfig {
  return ROLES_CONFIG;
}

export function getRoleById(roleId: string): Role | undefined {
  const { roles } = getRoles();
  return roles.find(role => role.id === roleId);
}

export function getRoleByName(roleName: string): Role | undefined {
  const { roles } = getRoles();
  return roles.find(role => role.name === roleName);
}

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const role = getRoleById(userRole);
  if (!role) return false;

  // Admin role has all permissions
  if (role.permissions.includes('all')) return true;

  // Check if user has the specific permission
  return role.permissions.includes(requiredPermission);
}

export function canManageUsers(userRole: string): boolean {
  return hasPermission(userRole, 'user_management');
}

export function isAdmin(userRole: string): boolean {
  return hasPermission(userRole, 'all');
}

export function getRoleLevel(roleId: string): number {
  const role = getRoleById(roleId);
  return role?.level ?? 999; // Return high level for unknown roles
}

export function canManageRole(managerRole: string, targetRole: string): boolean {
  const managerLevel = getRoleLevel(managerRole);
  const targetLevel = getRoleLevel(targetRole);
  
  // Can only manage roles at same level or higher level number (lower authority)
  return managerLevel <= targetLevel;
}

export function getAvailableRoles(): Role[] {
  const { roles } = getRoles();
  return roles.sort((a, b) => a.level - b.level);
}

export function getPermissionDescription(permission: string): string {
  const { permissions } = getRoles();
  return permissions[permission] || permission;
}

// Type guards for better TypeScript support
export function validateRoleId(roleId: string): roleId is string {
  return getRoleById(roleId) !== undefined;
}

export function validatePermission(permission: string): permission is string {
  const { permissions } = getRoles();
  return permission in permissions;
}