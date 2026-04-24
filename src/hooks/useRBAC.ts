'use client';

import { useState, useEffect, useCallback } from 'react';
import * as rbac from '@/lib/rbac';
import type { Permission, Role, User } from '@/lib/rbac';

// ============================================================================
// User Role Management Hooks
// ============================================================================

export function useUserRoles(userId: string | null) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        if (!userId) {
            setRoles([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await rbac.getUserRoles(userId);
            
            if (result.success) {
                // Ensure roles is always an array
                const rolesArray = Array.isArray(result.roles) ? result.roles : [];
                setRoles(rolesArray);
                if (rolesArray.length === 0 && result.error) {
                    // Only set error if we got a success response but no roles and there's an error message
                    setError(result.error);
                } else {
                    setError(null);
                }
            } else {
                setError(result.error || 'Failed to fetch roles');
                setRoles([]);
            }
        } catch (err: any) {
            setError(err?.message || 'An unexpected error occurred');
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const assignRole = useCallback(async (roleId: string) => {
        if (!userId) return { success: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.assignRoleToUser(userId, roleId);
        if (result.success) {
            await fetchRoles();
        }
        setLoading(false);
        return result;
    }, [userId, fetchRoles]);

    const removeRole = useCallback(async (roleId: string) => {
        if (!userId) return { success: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.removeRoleFromUser(userId, roleId);
        if (result.success) {
            await fetchRoles();
        }
        setLoading(false);
        return result;
    }, [userId, fetchRoles]);

    const bulkAssignRoles = useCallback(async (roleIds: string[]) => {
        if (!userId) return { success: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.bulkAssignRolesToUser(userId, roleIds);
        if (result.success) {
            await fetchRoles();
        }
        setLoading(false);
        return result;
    }, [userId, fetchRoles]);

    const bulkRemoveRoles = useCallback(async (roleIds: string[]) => {
        if (!userId) return { success: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.bulkRemoveRolesFromUser(userId, roleIds);
        if (result.success) {
            await fetchRoles();
        }
        setLoading(false);
        return result;
    }, [userId, fetchRoles]);

    return {
        roles: roles || [],
        loading,
        error,
        refetch: fetchRoles,
        assignRole,
        removeRole,
        bulkAssignRoles,
        bulkRemoveRoles,
    };
}

export function useUsersByRole(roleId: string | null) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchUsers = useCallback(async (page?: number, limit?: number) => {
        if (!roleId) {
            setUsers([]);
            return;
        }

        setLoading(true);
        setError(null);
        const result = await rbac.getUsersByRole(roleId, page, limit);
        
        if (result.success && result.users) {
            setUsers(result.users);
            setTotal(result.total || 0);
        } else {
            setError(result.error || 'Failed to fetch users');
            setUsers([]);
        }
        setLoading(false);
    }, [roleId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        total,
        loading,
        error,
        refetch: fetchUsers,
    };
}

// ============================================================================
// Permission Management Hooks
// ============================================================================

export function usePermissions() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const result = await rbac.getAllPermissions();
        
        if (result.success && result.permissions) {
            setPermissions(result.permissions);
        } else {
            setError(result.error || 'Failed to fetch permissions');
            setPermissions([]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    return {
        permissions,
        loading,
        error,
        refetch: fetchPermissions,
    };
}

export function useUserPermissions(userId: string | null) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPermissions = useCallback(async () => {
        if (!userId) {
            setPermissions([]);
            return;
        }

        setLoading(true);
        setError(null);
        const result = await rbac.getUserPermissions(userId);
        
        if (result.success && result.permissions) {
            setPermissions(result.permissions);
        } else {
            setError(result.error || 'Failed to fetch permissions');
            setPermissions([]);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const checkPermission = useCallback(async (permissionCode: string) => {
        if (!userId) return { success: false, hasPermission: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.checkUserPermission(userId, permissionCode);
        setLoading(false);
        return result;
    }, [userId]);

    const checkAnyPermission = useCallback(async (permissionCodes: string[]) => {
        if (!userId) return { success: false, hasPermission: false, error: 'User ID is required' };
        
        setLoading(true);
        const result = await rbac.checkUserHasAnyPermission(userId, permissionCodes);
        setLoading(false);
        return result;
    }, [userId]);

    return {
        permissions,
        loading,
        error,
        refetch: fetchPermissions,
        checkPermission,
        checkAnyPermission,
    };
}

// ============================================================================
// Permission Checking Hook (for UI components)
// ============================================================================

export function usePermissionCheck(userId: string | null) {
    const [hasPermission, setHasPermission] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const check = useCallback(async (permissionCode: string) => {
        if (!userId) {
            setHasPermission(prev => ({ ...prev, [permissionCode]: false }));
            return false;
        }

        setLoading(true);
        const result = await rbac.checkUserPermission(userId, permissionCode);
        const has = result.success && result.hasPermission === true;
        setHasPermission(prev => ({ ...prev, [permissionCode]: has }));
        setLoading(false);
        return has;
    }, [userId]);

    const checkAny = useCallback(async (permissionCodes: string[]) => {
        if (!userId) {
            return false;
        }

        setLoading(true);
        const result = await rbac.checkUserHasAnyPermission(userId, permissionCodes);
        const has = result.success && result.hasPermission === true;
        setLoading(false);
        return has;
    }, [userId]);

    return {
        hasPermission,
        loading,
        check,
        checkAny,
    };
}

