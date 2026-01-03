import RolesView from '@/components/SystemAdmin/RolesView';
import { getModel, isErrorResponse } from '@/lib/connector';
import type { Permission } from '@/lib/rbac';

type BackendPermission = string | {
    id?: string;
    name?: string;
    code?: string;
    title?: string;
    [key: string]: any;
};

type BackendRoleData = {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    scope?: string;
    permissions?: BackendPermission[];
    user_count?: number;
    created_at: string;
};

type RolesApiResponse = {
    success?: boolean;
    code?: number;
    data?: {
        limit?: number;
        page?: number;
        total_items?: number;
        total_pages?: number;
        roles?: BackendRoleData[];
    } | BackendRoleData[];
    message?: string;
};

import type { Role } from '@/types/role';

// Re-export for backward compatibility
export type { Role };

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

type BackendPermissionData = {
    id: string;
    name?: string;
    code?: string;
    description?: string;
    resource?: string;
    action?: string;
};

type PermissionsApiResponse = {
    success?: boolean;
    code?: number;
    data?: {
        limit?: number;
        page?: number;
        total_items?: number;
        total_pages?: number;
        permissions?: BackendPermissionData[];
    } | BackendPermissionData[];
    message?: string;
};

const RolesPage = async ({ searchParams }: PageProps) => {
    let roles: Role[] = [];
    let rolesTotalPages = 1;
    let permissions: Permission[] = [];
    let permissionsTotalPages = 1;
    
    try {
        // Get page from searchParams
        const resolvedSearchParams = await searchParams;
        const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1;
        const pageParam = currentPage > 1 ? `&page=${currentPage}` : '';
        
        const res = await getModel<RolesApiResponse>(`/rbac/roles?limit=10${pageParam}`).catch((error: any) => {
            // Catch any errors from getModel, including auth/session errors
            // Suppress JSON parse errors and ClientFetchErrors as they're handled gracefully
            const errorMessage = error?.message || String(error || '');
            if (errorMessage.includes('JSON.parse') || 
                errorMessage.includes('unexpected end of data') || 
                errorMessage.includes('ClientFetchError')) {
                // Silently handle auth/session errors - they're expected in some contexts
                return null;
            }
            // Don't log errors to avoid console noise
            return null;
        });
        
        // Check if response is null or undefined
        if (!res) {
            // Continue to fetch permissions even if roles fail
        } else if (!isErrorResponse(res)) {
            // Handle different response structures
            let backendRoles: BackendRoleData[] = [];
            
            if (res.data) {
                // Check if data is nested with roles array
                if (Array.isArray(res.data)) {
                    // Direct array response
                    backendRoles = res.data;
                } else if (res.data.roles && Array.isArray(res.data.roles)) {
                    // Nested structure with roles array
                    backendRoles = res.data.roles;
                    rolesTotalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 1;
                }
            }
            
            // Transform backend data to frontend format
            if (backendRoles.length > 0) {
                roles = backendRoles.map((role: BackendRoleData) => {
                    // Handle both 'title' and 'name' fields (backend might use 'title' from creation)
                    const roleName = role.title || role.name || 'Unnamed Role';
                    
                    // Transform permissions: handle both string arrays and object arrays
                    const transformPermissions = (perms: BackendPermission[] | undefined): string[] => {
                        if (!perms || !Array.isArray(perms)) {
                            return [];
                        }
                        return perms.map((perm) => {
                            if (typeof perm === 'string') {
                                return perm;
                            }
                            // If it's an object, try to extract a string value
                            if (typeof perm === 'object' && perm !== null) {
                                return perm.name || perm.code || perm.title || perm.id || String(perm);
                            }
                            return String(perm);
                        }).filter((p): p is string => typeof p === 'string' && p.length > 0);
                    };
                    
            return {
                id: role.id,
                        name: roleName,
                description: role.description || 'No description',
                permissions: transformPermissions(role.permissions),
                userCount: role.user_count || 0,
                        createdAt: role.created_at || new Date().toISOString(),
            };
        });
            }
        }

        // Fetch permissions
        const permissionsRes = await getModel<PermissionsApiResponse>(`/rbac/permissions?limit=10${pageParam}`).catch(() => null);
        
        if (permissionsRes && !isErrorResponse(permissionsRes)) {
            let backendPermissions: BackendPermissionData[] = [];
            
            if (permissionsRes.data) {
                if (Array.isArray(permissionsRes.data)) {
                    backendPermissions = permissionsRes.data;
                } else if (permissionsRes.data.permissions && Array.isArray(permissionsRes.data.permissions)) {
                    backendPermissions = permissionsRes.data.permissions;
                    permissionsTotalPages = typeof permissionsRes.data.total_pages === 'number' ? permissionsRes.data.total_pages : 1;
                }
            }
            
            permissions = backendPermissions.map((perm: BackendPermissionData): Permission => ({
                id: perm.id,
                name: perm.name || perm.code || 'Unnamed Permission',
                code: perm.code,
                description: perm.description,
                resource: perm.resource,
                action: perm.action,
            }));
        }
    } catch (error: any) {
        // Handle all errors gracefully without throwing
        // Use empty array as fallback - page will show empty state
        // Don't log errors to avoid console noise and Next.js fetchData errors
    }

    return (
        <RolesView 
            roles={roles || []} 
            rolesTotalPages={rolesTotalPages || 1}
            permissions={permissions || []}
            permissionsTotalPages={permissionsTotalPages || 1}
        />
    );
};

export default RolesPage;

