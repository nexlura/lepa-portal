'use client';

import { Dialog, DialogBody, DialogTitle, DialogActions } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import type { Role } from '@/types/role';
import { useEffect, useState } from 'react';
import { getModel, isErrorResponse } from '@/lib/connector';
import type { Permission } from '@/lib/rbac';

type BackendRoleDetailData = {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    scope?: string;
    permissions?: Permission[] | string[];
    user_count?: number;
    created_at: string;
    updated_at?: string;
};

type RoleDetailApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendRoleDetailData;
    message?: string;
};

interface RoleDetailsModalProps {
    open: boolean;
    onClose: () => void;
    role: Role | null;
}

const RoleDetailsModal = ({ open, onClose, role }: RoleDetailsModalProps) => {
    const [fullRole, setFullRole] = useState<BackendRoleDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    // Fetch full role details when modal opens
    useEffect(() => {
        if (role?.id && open) {
            setIsLoading(true);
            getModel<RoleDetailApiResponse>(`/rbac/roles/${role.id}`)
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data) {
                        setFullRole(res.data);
                        
                        // Transform permissions
                        if (res.data.permissions) {
                            const transformedPerms = res.data.permissions.map((perm: Permission | string) => {
                                if (typeof perm === 'string') {
                                    return { id: perm, name: perm } as Permission;
                                }
                                return perm;
                            });
                            setPermissions(transformedPerms);
                        } else {
                            setPermissions([]);
                        }
                    }
                })
                .catch(() => {
                    // Handle error silently
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setFullRole(null);
            setPermissions([]);
        }
    }, [role?.id, open]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const getPermissionName = (permission: Permission | string): string => {
        if (typeof permission === 'string') return permission;
        return permission.name || permission.code || permission.id || 'Unknown Permission';
    };

    const displayRole = fullRole || role;

    if (!displayRole) return null;

    const displayPermissions = fullRole?.permissions ? permissions : (role?.permissions || []).map(p => ({ id: p, name: p } as Permission));

    return (
        <Dialog size="xl" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Role Details</DialogTitle>
            <DialogBody className="max-h-[75vh] overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="text-sm text-gray-500">Loading role details...</div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Role Name</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {fullRole?.title || fullRole?.name || role?.name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Scope</div>
                                <div className="text-sm text-gray-900">
                                    {fullRole?.scope ? (
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                            {fullRole.scope}
                                        </span>
                                    ) : 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Users Assigned</div>
                                <div className="text-sm text-gray-900">
                                    {fullRole?.user_count !== undefined ? fullRole.user_count : role?.userCount || 0}
                                </div>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-3">
                                <div className="text-xs text-gray-500 mb-1">Description</div>
                                <div className="text-sm text-gray-900">
                                    {fullRole?.description || role?.description || 'No description'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Created At</div>
                                <div className="text-sm text-gray-900">
                                    {formatDate(fullRole?.created_at || role?.createdAt || '')}
                                </div>
                            </div>
                            {fullRole?.updated_at && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                                    <div className="text-sm text-gray-900">
                                        {formatDate(fullRole.updated_at)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Permissions Section */}
                        <div>
                            <div className="text-sm font-medium text-gray-900 mb-3">
                                Assigned Permissions ({displayPermissions.length})
                            </div>
                            {displayPermissions.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {displayPermissions.map((permission, index) => {
                                        const permId = typeof permission === 'object' ? permission.id : `perm-${index}`;
                                        const permName = getPermissionName(permission);
                                        return (
                                            <div
                                                key={permId}
                                                className="flex items-start p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {permName}
                                                    </div>
                                                    {typeof permission === 'object' && permission.code && (
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            Code: {permission.code}
                                                        </div>
                                                    )}
                                                    {typeof permission === 'object' && permission.description && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {permission.description}
                                                        </div>
                                                    )}
                                                    {typeof permission === 'object' && permission.resource && (
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            Resource: {permission.resource}
                                                        </div>
                                                    )}
                                                    {typeof permission === 'object' && permission.action && (
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            Action: {permission.action}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No permissions assigned</div>
                            )}
                        </div>
                    </div>
                )}
            </DialogBody>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleDetailsModal;

