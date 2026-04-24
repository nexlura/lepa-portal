'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Button } from '@/components/UIKit/Button';
import SearchableSelect from '@/components/UIKit/SearchableSelect';
import { FeedbackContext } from '@/context/feedback';
import { usePermissions } from '@/hooks/useRBAC';
import { assignPermissionToRole, removePermissionFromRole, bulkAssignPermissionsToRole, getRolePermissions } from '@/lib/rbac';
import type { Permission, Role } from '@/lib/rbac';

interface RolePermissionManagementModalProps {
    open: boolean;
    onClose: () => void;
    role: Role | null;
}

const RolePermissionManagementModal = ({ open, onClose, role }: RolePermissionManagementModalProps) => {
    const router = useRouter();
    const { setFeedback } = useContext(FeedbackContext);
    const { permissions: availablePermissions, loading: permissionsLoading } = usePermissions();
    
    const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch role permissions when modal opens
    useEffect(() => {
        if (open && role) {
            fetchRolePermissions();
            setSelectedPermissionIds([]);
        }
    }, [open, role]);

    const fetchRolePermissions = async () => {
        if (!role) return;
        
        setLoading(true);
        const result = await getRolePermissions(role.id);
        if (result.success && result.permissions) {
            setRolePermissions(result.permissions);
        } else {
            // Fallback to permissions from role object if API fails
            setRolePermissions(role.permissions || []);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!role || loading || permissionsLoading) return;

        setLoading(true);
        setError(null);

        try {
            const currentPermissionIds = rolePermissions.map(p => 
                typeof p === 'string' ? p : p.id
            ).filter(Boolean);
            
            const permissionsToAdd = selectedPermissionIds.filter(id => !currentPermissionIds.includes(id));
            const permissionsToRemove = currentPermissionIds.filter(id => !selectedPermissionIds.includes(id));

            const operations: Promise<{ success: boolean; error?: string }>[] = [];

            // Remove permissions first
            for (const permissionId of permissionsToRemove) {
                operations.push(removePermissionFromRole(role.id, permissionId));
            }

            // Add new permissions
            if (permissionsToAdd.length > 0) {
                operations.push(bulkAssignPermissionsToRole(role.id, permissionsToAdd));
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
                setError(errorMessages.join(', ') || 'Failed to update permissions');
                setFeedback({ status: 'error', text: errorMessages.join(', ') || 'Failed to update permissions' });
            } else {
                setFeedback({ status: 'success', text: 'Role permissions updated successfully' });
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

    const handleRemovePermission = async (permissionId: string) => {
        if (!role || loading) return;

        setLoading(true);
        const result = await removePermissionFromRole(role.id, permissionId);
        
        if (result.success) {
            setRolePermissions(prev => prev.filter(p => {
                const id = typeof p === 'string' ? p : p.id;
                return id !== permissionId;
            }));
            setFeedback({ status: 'success', text: 'Permission removed successfully' });
            router.refresh();
        } else {
            setError(result.error || 'Failed to remove permission');
            setFeedback({ status: 'error', text: result.error || 'Failed to remove permission' });
        }
        setLoading(false);
    };

    const handleClose = () => {
        setSelectedPermissionIds([]);
        setError(null);
        onClose();
    };

    if (!role) return null;

    const getPermissionName = (permission: Permission | string): string => {
        if (typeof permission === 'string') return permission;
        return permission.name || permission.code || permission.id || 'Unknown Permission';
    };

    const getPermissionId = (permission: Permission | string): string => {
        if (typeof permission === 'string') return permission;
        return permission.id;
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Manage Role Permissions</DialogTitle>
            <DialogDescription>
                Assign or remove permissions for role: {role.title || role.name || 'Unnamed Role'}
            </DialogDescription>
            <DialogBody className="max-h-[70vh] overflow-y-auto">
                <div className="mt-4 space-y-6">
                    {/* Current Permissions */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block">
                            Current Permissions ({rolePermissions.length})
                        </Label>
                        {loading ? (
                            <div className="text-sm text-gray-500">Loading permissions...</div>
                        ) : rolePermissions.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {rolePermissions.map((permission) => {
                                    const permId = getPermissionId(permission);
                                    const permName = getPermissionName(permission);
                                    // If permission is just an ID string, try to find it in availablePermissions
                                    let displayPermission = permission;
                                    if (typeof permission === 'string') {
                                        const found = availablePermissions.find(p => p.id === permission);
                                        if (found) {
                                            displayPermission = found;
                                        }
                                    }
                                    return (
                                        <div
                                            key={permId}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {typeof displayPermission === 'object' 
                                                        ? (displayPermission.name || displayPermission.code || permName)
                                                        : permName}
                                                </div>
                                                {typeof displayPermission === 'object' && displayPermission.description && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {displayPermission.description}
                                                    </div>
                                                )}
                                                {typeof displayPermission === 'object' && displayPermission.code && (
                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                        Code: {displayPermission.code}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => handleRemovePermission(permId)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-700 ml-3 flex-shrink-0"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">No permissions assigned</div>
                        )}
                    </Field>

                    {/* Assign New Permissions */}
                    <Field>
                        <SearchableSelect
                            label="Assign Permissions"
                            value={null}
                            onChange={(value) => {
                                if (value && !selectedPermissionIds.includes(value)) {
                                    setSelectedPermissionIds([...selectedPermissionIds, value]);
                                }
                            }}
                            options={availablePermissions
                                .filter(perm => {
                                    const permId = perm.id;
                                    return !rolePermissions.some(rp => getPermissionId(rp) === permId);
                                })
                                .map(perm => ({
                                    id: perm.id,
                                    name: perm.name || perm.code || perm.id || 'Unknown Permission',
                                }))}
                            placeholder={permissionsLoading ? "Loading permissions..." : "Search and select permissions to assign..."}
                            emptyLabel="No available permissions"
                            loading={permissionsLoading}
                        />
                    </Field>

                    {/* Selected Permissions to Add */}
                    {selectedPermissionIds.length > 0 && (
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                Permissions to be Assigned ({selectedPermissionIds.length})
                            </Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {selectedPermissionIds.map((permissionId) => {
                                    const permission = availablePermissions.find(p => p.id === permissionId);
                                    if (!permission) return null;
                                    return (
                                        <div
                                            key={permissionId}
                                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-blue-900">
                                                    {permission.name || permission.code || permission.id}
                                                </div>
                                                {permission.description && (
                                                    <div className="text-xs text-blue-700 mt-1">
                                                        {permission.description}
                                                    </div>
                                                )}
                                                {permission.code && (
                                                    <div className="text-xs text-blue-500 mt-0.5">
                                                        Code: {permission.code}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPermissionIds(prev => prev.filter(id => id !== permissionId));
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

                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </div>
            </DialogBody>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading || permissionsLoading}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleSave}
                    disabled={loading || permissionsLoading || selectedPermissionIds.length === 0}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RolePermissionManagementModal;

