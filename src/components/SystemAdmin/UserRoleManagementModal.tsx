'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Button } from '@/components/UIKit/Button';
import SearchableSelect from '@/components/UIKit/SearchableSelect';
import { FeedbackContext } from '@/context/feedback';
import { useUserRoles } from '@/hooks/useRBAC';
import { getModel, isErrorResponse } from '@/lib/connector';
import type { Role } from '@/lib/rbac';

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

interface UserRoleManagementModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    userName?: string;
}

const UserRoleManagementModal = ({ open, onClose, userId, userName }: UserRoleManagementModalProps) => {
    const router = useRouter();
    const { setFeedback } = useContext(FeedbackContext);
    const { roles: userRoles, loading: rolesLoading, assignRole, removeRole, bulkAssignRoles, bulkRemoveRoles } = useUserRoles(userId);
    
    const [availableRoles, setAvailableRoles] = useState<{ id: string; name: string }[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch available roles
    useEffect(() => {
        if (open) {
            fetchAvailableRoles();
            // Initialize selected roles from user's current roles
            if (userRoles.length > 0) {
                setSelectedRoleIds(userRoles.map(r => r.id));
            } else {
                setSelectedRoleIds([]);
            }
        }
    }, [open, userRoles]);

    const fetchAvailableRoles = async () => {
        setLoadingRoles(true);
        try {
            const response = await getModel<RolesApiResponse>('/rbac/roles?limit=100');
            
            if (isErrorResponse(response)) {
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

            // Perform bulk operations
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
                setFeedback({ status: 'success', text: 'User roles updated successfully' });
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
        onClose();
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
                {userName ? `Assign or remove roles for ${userName}` : 'Assign or remove roles for this user'}
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    {/* Current Roles */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block">
                            Current Roles
                        </Label>
                        {rolesLoading ? (
                            <div className="text-sm text-gray-500">Loading roles...</div>
                        ) : userRoles.length > 0 ? (
                            <div className="space-y-2">
                                {userRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {role.title || role.name || 'Unnamed Role'}
                                            </div>
                                            {role.description && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {role.description}
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
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">No roles assigned</div>
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
                    {selectedRoleIds.length > 0 && (
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                Roles to be Assigned
                            </Label>
                            <div className="space-y-2">
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
                                                    className="text-blue-600 hover:text-blue-700"
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
                <Button onClick={handleClose} disabled={loading || rolesLoading}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleSave}
                    disabled={loading || rolesLoading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserRoleManagementModal;

