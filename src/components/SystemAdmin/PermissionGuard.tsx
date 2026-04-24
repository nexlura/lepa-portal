'use client';

import { ReactNode } from 'react';
import { usePermissionCheck } from '@/hooks/useRBAC';
import { useSession } from 'next-auth/react';

interface PermissionGuardProps {
    permission: string | string[];
    fallback?: ReactNode;
    children: ReactNode;
    requireAll?: boolean; // If true, requires all permissions; if false, requires any permission
}

/**
 * PermissionGuard component - Conditionally renders children based on user permissions
 * 
 * @example
 * <PermissionGuard permission="manage_users">
 *   <Button>Delete User</Button>
 * </PermissionGuard>
 * 
 * @example
 * <PermissionGuard permission={["edit_users", "delete_users"]} requireAll={false}>
 *   <Button>Manage Users</Button>
 * </PermissionGuard>
 */
export default function PermissionGuard({
    permission,
    fallback = null,
    children,
    requireAll = false,
}: PermissionGuardProps) {
    const { data: session } = useSession();
    const userId = session?.user?.userId || null;
    const { hasPermission, check, checkAny } = usePermissionCheck(userId);

    // If no user session, don't render
    if (!userId) {
        return <>{fallback}</>;
    }

    // Handle single permission
    if (typeof permission === 'string') {
        const has = hasPermission[permission];
        if (has === undefined) {
            // Check permission asynchronously
            check(permission);
            return <>{fallback}</>; // Show fallback while checking
        }
        return has ? <>{children}</> : <>{fallback}</>;
    }

    // Handle multiple permissions
    if (Array.isArray(permission)) {
        if (permission.length === 0) {
            return <>{children}</>;
        }

        if (requireAll) {
            // Require all permissions
            const allChecked = permission.every(perm => hasPermission[perm] !== undefined);
            if (!allChecked) {
                // Check all permissions
                Promise.all(permission.map(perm => check(perm)));
                return <>{fallback}</>;
            }
            const allHave = permission.every(perm => hasPermission[perm] === true);
            return allHave ? <>{children}</> : <>{fallback}</>;
        } else {
            // Require any permission
            const anyChecked = permission.some(perm => hasPermission[perm] !== undefined);
            if (!anyChecked) {
                // Check any permission
                checkAny(permission);
                return <>{fallback}</>;
            }
            const anyHas = permission.some(perm => hasPermission[perm] === true);
            return anyHas ? <>{children}</> : <>{fallback}</>;
        }
    }

    return <>{fallback}</>;
}

/**
 * Hook for checking permissions in components
 */
export function useHasPermission(permission: string | string[], requireAll = false): boolean {
    const { data: session } = useSession();
    const userId = session?.user?.userId || null;
    const { hasPermission, check, checkAny } = usePermissionCheck(userId);

    if (!userId) return false;

    if (typeof permission === 'string') {
        const has = hasPermission[permission];
        if (has === undefined) {
            check(permission);
            return false;
        }
        return has;
    }

    if (Array.isArray(permission)) {
        if (permission.length === 0) return true;

        if (requireAll) {
            const allChecked = permission.every(perm => hasPermission[perm] !== undefined);
            if (!allChecked) {
                Promise.all(permission.map(perm => check(perm)));
                return false;
            }
            return permission.every(perm => hasPermission[perm] === true);
        } else {
            const anyChecked = permission.some(perm => hasPermission[perm] !== undefined);
            if (!anyChecked) {
                checkAny(permission);
                return false;
            }
            return permission.some(perm => hasPermission[perm] === true);
        }
    }

    return false;
}

