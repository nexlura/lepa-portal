'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Button } from '@/components/UIKit/Button';
import SearchableSelect from '@/components/UIKit/SearchableSelect';
import { FeedbackContext } from '@/context/feedback';
import { useUserRoles, useUserPermissions } from '@/hooks/useRBAC';
import { getModel, isErrorResponse } from '@/lib/connector';
import type { Role, Permission } from '@/lib/rbac';

type BackendRoleData = {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    scope?: string;
};

type RolesApiResponse = {
    success?: boolean;
    data?: BackendRoleData[] | { roles?: BackendRoleData[] };
    roles?: BackendRoleData[];
};

interface UserAccessManagementModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    userName?: string;
}

const UserAccessManagementModal = ({ open, onClose, userId, userName }: UserAccessManagementModalProps) => {
    const router = useRouter();
    const { setFeedback } = useContext(FeedbackContext);
    const { roles: userRoles, loading: rolesLoading, error: rolesError, assignRole, removeRole, bulkAssignRoles, bulkRemoveRoles } = useUserRoles(userId);
    const { permissions: userPermissions, loading: permissionsLoading } = useUserPermissions(userId);
    
    const [availableRoles, setAvailableRoles] = useState<{ id: string; name: string }[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

    // Fetch available roles and sync selected roles
    useEffect(() => {
        if (open) {
            fetchAvailableRoles();
        }
    }, [open]);

    // Sync selected role IDs when userRoles change
    useEffect(() => {
        if (open && userRoles && userRoles.length > 0) {
            setSelectedRoleIds(userRoles.map(r => r.id));
        } else if (open && !rolesLoading) {
            setSelectedRoleIds([]);
        }
    }, [open, userRoles, rolesLoading]);

    const fetchAvailableRoles = async () => {
        setLoadingRoles(true);
        try {
            const response = await getModel<RolesApiResponse>('/rbac/roles?limit=100');
            
            if (isErrorResponse(response)) {
                setError('Failed to load available roles');
                return;
            }

            if (!response) {
                setError('Failed to load available roles');
                return;
            }

            let roles: BackendRoleData[] = [];
            if (response.data) {
                if (Array.isArray(response.data)) {
                    roles = response.data;
                } else if (response.data.roles && Array.isArray(response.data.roles)) {
                    roles = response.data.roles;
                }
            } else if (response.roles && Array.isArray(response.roles)) {
                roles = response.roles;
            }

            setAvailableRoles(
                roles.map(role => ({
                    id: role.id,
                    name: role.title || role.name || 'Unnamed Role',
                }))
            );
        } catch (error: any) {
            setError('Failed to load available roles');
        } finally {
            setLoadingRoles(false);
        }
    };

    const handleSave = async () => {
        if (loading || rolesLoading) return;

        setLoading(true);
        setError(null);

        try {
            const currentRoleIds = userRoles.map(r => r.id);
            const rolesToAdd = selectedRoleIds.filter(id => !currentRoleIds.includes(id));
            const rolesToRemove = currentRoleIds.filter(id => !selectedRoleIds.includes(id));

            const operations: Promise<{ success: boolean; error?: string }>[] = [];

            if (rolesToAdd.length > 0) {
                operations.push(bulkAssignRoles(rolesToAdd));
            }

            if (rolesToRemove.length > 0) {
                operations.push(bulkRemoveRoles(rolesToRemove));
            }

            if (operations.length === 0) {
                setFeedback({ status: 'success', text: 'No changes to save' });
                onClose();
                return;
            }

            const results = await Promise.all(operations);
            const hasError = results.some(r => !r.success);

            if (hasError) {
                const errorMessages = results.filter(r => !r.success).map(r => r.error).filter(Boolean);
                setError(errorMessages.join(', ') || 'Failed to update roles');
                setFeedback({ status: 'error', text: errorMessages.join(', ') || 'Failed to update roles' });
            } else {
                setFeedback({ status: 'success', text: 'User access updated successfully' });
                router.refresh();
                onClose();
            }
        } catch (error: any) {
            setError(error?.message || 'An unexpected error occurred');
            setFeedback({ status: 'error', text: error?.message || 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedRoleIds([]);
        setError(null);
        setActiveTab('roles');
        onClose();
    };

    const getPermissionName = (permission: Permission | string): string => {
        if (typeof permission === 'string') return permission;
        return permission.name || permission.code || permission.id || 'Unknown Permission';
    };

    // Group permissions by resource if available
    const groupedPermissions = userPermissions.reduce((acc, perm) => {
        const resource = typeof perm === 'object' && perm.resource ? perm.resource : 'Other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(perm);
        return acc;
    }, {} as Record<string, (Permission | string)[]>);

    return (
        <Dialog size="2xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Manage User Access</DialogTitle>
            <DialogDescription>
                {userName ? `Manage roles and view permissions for ${userName}` : 'Manage roles and view permissions for this user'}
            </DialogDescription>
            <DialogBody className="max-h-[75vh] overflow-y-auto">
                <div className="mt-4 space-y-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('roles')}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === 'roles'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                Roles ({userRoles.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('permissions')}
                                className={`
                                    py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === 'permissions'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                Permissions ({userPermissions.length})
                            </button>
                        </nav>
                    </div>

                    {/* Roles Tab */}
                    {activeTab === 'roles' && (
                        <div className="space-y-6">
                            {/* Current Roles */}
                            <Field>
                                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                    Current Roles {!rolesLoading && userRoles && Array.isArray(userRoles) && `(${userRoles.length})`}
                                </Label>
                                {rolesLoading ? (
                                    <div className="text-sm text-gray-500">Loading roles...</div>
                                ) : userRoles && Array.isArray(userRoles) && userRoles.length > 0 ? (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {userRoles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {role.title || role.name || 'Unnamed Role'}
                                                    </div>
                                                    {role.description && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {role.description}
                                                        </div>
                                                    )}
                                                    {role.scope && (
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            Scope: {role.scope}
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={async () => {
                                                        const result = await removeRole(role.id);
                                                        if (result.success) {
                                                            setSelectedRoleIds(prev => prev.filter(id => id !== role.id));
                                                        }
                                                    }}
                                                    disabled={loading || rolesLoading}
                                                    className="text-red-600 hover:text-red-700 ml-3 flex-shrink-0"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-sm text-gray-500">
                                            {rolesLoading ? 'Loading roles...' : 'No roles assigned'}
                                        </div>
                                        {(error || rolesError) && (
                                            <div className="text-xs text-red-500 mt-1">
                                                Error: {error || rolesError}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>

                            {/* Assign New Roles */}
                            <Field>
                                <SearchableSelect
                                    label="Assign Roles"
                                    value={null}
                                    onChange={(value) => {
                                        if (value && !selectedRoleIds.includes(value)) {
                                            setSelectedRoleIds([...selectedRoleIds, value]);
                                        }
                                    }}
                                    options={availableRoles
                                        .filter(role => !userRoles.some(ur => ur.id === role.id))
                                        .map(role => ({ id: role.id, name: role.name }))}
                                    placeholder={loadingRoles ? "Loading roles..." : "Search and select roles to assign..."}
                                    emptyLabel="No available roles"
                                    loading={loadingRoles}
                                />
                            </Field>

                            {/* Selected Roles to Add */}
                            {selectedRoleIds.filter(id => !userRoles.some(ur => ur.id === id)).length > 0 && (
                                <Field>
                                    <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                        Roles to be Assigned ({selectedRoleIds.filter(id => !userRoles.some(ur => ur.id === id)).length})
                                    </Label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {selectedRoleIds
                                            .filter(id => !userRoles.some(ur => ur.id === id))
                                            .map((roleId) => {
                                                const role = availableRoles.find(r => r.id === roleId);
                                                if (!role) return null;
                                                return (
                                                    <div
                                                        key={roleId}
                                                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                                                    >
                                                        <div className="text-sm font-medium text-blue-900">
                                                            {role.name}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
                                                            }}
                                                            className="text-blue-600 hover:text-blue-700 ml-3 flex-shrink-0"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </Field>
                            )}
                        </div>
                    )}

                    {/* Permissions Tab */}
                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Permissions are automatically inherited from assigned roles. 
                                    To change permissions, modify the user's roles above.
                                </p>
                            </div>

                            {permissionsLoading ? (
                                <div className="text-sm text-gray-500">Loading permissions...</div>
                            ) : userPermissions.length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                        <Field key={resource}>
                                            <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                                {resource === 'Other' ? 'Other Permissions' : resource.charAt(0).toUpperCase() + resource.slice(1)} ({perms.length})
                                            </Label>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {perms.map((permission) => {
                                                    const permName = getPermissionName(permission);
                                                    const permObj = typeof permission === 'object' ? permission : null;
                                                    return (
                                                        <div
                                                            key={permObj?.id || permName}
                                                            className="flex items-start p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {permObj?.name || permName}
                                                                </div>
                                                                {permObj?.code && (
                                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                                        Code: {permObj.code}
                                                                    </div>
                                                                )}
                                                                {permObj?.description && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {permObj.description}
                                                                    </div>
                                                                )}
                                                                {permObj?.action && (
                                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                                        Action: {permObj.action}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Field>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No permissions assigned. Assign roles to grant permissions.
                                </div>
                            )}
                        </div>
                    )}

                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </div>
            </DialogBody>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading || rolesLoading}>
                    {activeTab === 'roles' ? 'Close' : 'Back to Roles'}
                </Button>
                {activeTab === 'roles' && (
                    <Button
                        color="primary"
                        onClick={handleSave}
                        disabled={loading || rolesLoading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default UserAccessManagementModal;

