/* eslint-disable @typescript-eslint/no-explicit-any */
import { postModel, getModel, patchModel, deleteModel, isErrorResponse } from './connector';

// ============================================================================
// Types
// ============================================================================

export type Permission = {
    id: string;
    name: string;
    code?: string;
    description?: string;
    resource?: string;
    action?: string;
};

export type Role = {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    scope?: 'system' | 'tenant';
    permissions?: Permission[];
    user_count?: number;
    created_at?: string;
};

export type User = {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    user_type?: string;
    roles?: Role[];
    permissions?: Permission[];
};

// ============================================================================
// User Role Management
// ============================================================================

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(
    userId: string,
    roleId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await postModel('/rbac/user-roles', {
            user_id: userId,
            role_id: roleId,
        });

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to assign role',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Role assigned successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Get all roles assigned to a user
 */
export async function getUserRoles(userId: string): Promise<{ success: boolean; roles?: Role[]; error?: string }> {
    try {
        const response = await getModel<{ 
            success?: boolean; 
            data?: Role[] | { roles?: Role[]; user_roles?: Role[]; data?: Role[] };
            roles?: Role[];
            user_roles?: Role[];
            message?: string;
        }>(`/rbac/user-roles/user/${userId}`);

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to fetch user roles',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        // Handle different response structures
        let roles: Role[] = [];
        
        if (response.data) {
            if (Array.isArray(response.data)) {
                // Direct array
                roles = response.data;
            } else if (typeof response.data === 'object') {
                // Nested object - try multiple possible keys
                if (response.data.roles && Array.isArray(response.data.roles)) {
                    roles = response.data.roles;
                } else if (response.data.user_roles && Array.isArray(response.data.user_roles)) {
                    roles = response.data.user_roles;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    roles = response.data.data;
                }
            }
        } else if (response.roles && Array.isArray(response.roles)) {
            // Top-level roles array
            roles = response.roles;
        } else if (response.user_roles && Array.isArray(response.user_roles)) {
            // Top-level user_roles array
            roles = response.user_roles;
        }

        // Ensure all roles have required fields
        const normalizedRoles: Role[] = roles.map((role: any) => {
            // If role is just a string (ID), convert to Role object
            if (typeof role === 'string') {
                return {
                    id: role,
                    name: role,
                    title: role,
                } as Role;
            }
            // If role is an object, ensure it has required fields
            return {
                id: role.id || role.role_id || '',
                name: role.name || role.title || 'Unnamed Role',
                title: role.title || role.name || 'Unnamed Role',
                description: role.description,
                scope: role.scope,
                permissions: role.permissions,
                user_count: role.user_count,
                created_at: role.created_at,
            } as Role;
        }).filter(role => role.id); // Filter out any roles without IDs

        return {
            success: true,
            roles: normalizedRoles,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(
    roleId: string,
    page?: number,
    limit?: number
): Promise<{ success: boolean; users?: User[]; total?: number; error?: string }> {
    try {
        const pageParam = page ? `&page=${page}` : '';
        const limitParam = limit ? `&limit=${limit}` : '';
        const queryParams = pageParam || limitParam ? `?${pageParam}${limitParam}`.replace(/^\?&/, '?') : '';

        const response = await getModel<{
            success?: boolean;
            data?: { users?: User[]; total?: number; total_items?: number };
            users?: User[];
            message?: string;
        }>(`/rbac/user-roles/role/${roleId}${queryParams}`);

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to fetch users',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const users = response.data?.users || response.users || [];
        const total = response.data?.total || response.data?.total_items || 0;

        return {
            success: true,
            users: Array.isArray(users) ? users : [],
            total,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(
    userId: string,
    roleId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await deleteModel(`/rbac/user-roles/user/${userId}/role/${roleId}`);

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to remove role',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Role removed successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Bulk assign roles to users
 */
export async function bulkAssignRolesToUser(
    userId: string,
    roleIds: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await postModel('/rbac/user-roles/bulk', {
            user_id: userId,
            role_ids: roleIds,
        });

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to assign roles',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Roles assigned successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Bulk remove roles from a user
 * Note: DELETE requests with body may need special handling
 */
export async function bulkRemoveRolesFromUser(
    userId: string,
    roleIds: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        // Try DELETE with body via axios directly if deleteModel doesn't support it
        // For now, use query params approach
        const roleIdsParam = roleIds.map(id => `role_ids=${encodeURIComponent(id)}`).join('&');
        const response = await deleteModel(`/rbac/user-roles/bulk?user_id=${encodeURIComponent(userId)}&${roleIdsParam}`);

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to remove roles',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Roles removed successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

// ============================================================================
// Role Permission Management
// ============================================================================

/**
 * Assign a permission to a role
 */
export async function assignPermissionToRole(
    roleId: string,
    permissionId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await postModel('/rbac/role-permissions', {
            role_id: roleId,
            permission_id: permissionId,
        });

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to assign permission',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Permission assigned successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Remove a permission from a role
 */
export async function removePermissionFromRole(
    roleId: string,
    permissionId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await deleteModel(`/rbac/role-permissions/role/${roleId}/permission/${permissionId}`);

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to remove permission',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Permission removed successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Bulk assign permissions to a role
 */
export async function bulkAssignPermissionsToRole(
    roleId: string,
    permissionIds: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const response = await postModel('/rbac/role-permissions/bulk', {
            role_id: roleId,
            permission_ids: permissionIds,
        });

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to assign permissions',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        return {
            success: true,
            message: response.message || 'Permissions assigned successfully',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(roleId: string): Promise<{ success: boolean; permissions?: Permission[]; error?: string }> {
    try {
        const response = await getModel<{ success?: boolean; data?: Permission[]; permissions?: Permission[]; message?: string }>(
            `/rbac/role-permissions/role/${roleId}`
        );

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to fetch role permissions',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const permissions = response.data || response.permissions || [];
        return {
            success: true,
            permissions: Array.isArray(permissions) ? permissions : [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

// ============================================================================
// Permission Management
// ============================================================================

/**
 * Get all available permissions
 */
export async function getAllPermissions(): Promise<{ success: boolean; permissions?: Permission[]; error?: string }> {
    try {
        const response = await getModel<{ success?: boolean; data?: Permission[]; permissions?: Permission[]; message?: string }>(
            '/rbac/permissions'
        );

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to fetch permissions',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const permissions = response.data || response.permissions || [];
        return {
            success: true,
            permissions: Array.isArray(permissions) ? permissions : [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

// ============================================================================
// Permission Checking
// ============================================================================

/**
 * Get all permissions for a user (from their roles)
 */
export async function getUserPermissions(userId: string): Promise<{ success: boolean; permissions?: Permission[]; error?: string }> {
    try {
        const response = await getModel<{ success?: boolean; data?: Permission[]; permissions?: Permission[]; message?: string }>(
            `/rbac/permissions/user/${userId}`
        );

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to fetch user permissions',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const permissions = response.data || response.permissions || [];
        return {
            success: true,
            permissions: Array.isArray(permissions) ? permissions : [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Check if a user has a specific permission
 */
export async function checkUserPermission(
    userId: string,
    permissionCode: string
): Promise<{ success: boolean; hasPermission?: boolean; error?: string }> {
    try {
        const response = await postModel<{ success?: boolean; has_permission?: boolean; hasPermission?: boolean; message?: string }>(
            `/rbac/permissions/user/${userId}/check`,
            { permission: permissionCode }
        );

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to check permission',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const hasPermission = response.has_permission ?? response.hasPermission ?? false;
        return {
            success: true,
            hasPermission,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Check if a user has any of the specified permissions
 */
export async function checkUserHasAnyPermission(
    userId: string,
    permissionCodes: string[]
): Promise<{ success: boolean; hasPermission?: boolean; error?: string }> {
    try {
        const response = await postModel<{ success?: boolean; has_permission?: boolean; hasPermission?: boolean; message?: string }>(
            `/rbac/permissions/user/${userId}/check-any`,
            { permissions: permissionCodes }
        );

        if (isErrorResponse(response)) {
            return {
                success: false,
                error: response.message || 'Failed to check permissions',
            };
        }
        if (!response) {
            return { success: false, error: 'Unexpected empty response' };
        }

        const hasPermission = response.has_permission ?? response.hasPermission ?? false;
        return {
            success: true,
            hasPermission,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'An unexpected error occurred',
        };
    }
}

