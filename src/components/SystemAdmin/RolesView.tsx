'use client';

import { useState } from 'react';
import { PlusIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import RolesTable from './RolesTable';
import PermissionsView from './PermissionsView';
import EmptyState from '../EmptyState';
import RoleModal from './RoleModal';
import PermissionModal from './PermissionModal';
import type { Role } from '@/types/role';
import type { Permission } from '@/lib/rbac';

interface RolesViewProps {
    roles: Role[];
    rolesTotalPages: number;
    permissions: Permission[];
    permissionsTotalPages: number;
}

const RolesView = ({ roles, rolesTotalPages, permissions, permissionsTotalPages }: RolesViewProps) => {
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const handleAddRole = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setEditingRole(null);
        setIsRoleModalOpen(true);
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setIsRoleModalOpen(true);
    };

    const handleAddPermission = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsPermissionModalOpen(true);
    };

    const handleCloseRoleModal = (open: boolean) => {
        setIsRoleModalOpen(open);
        if (!open) {
            setEditingRole(null);
        }
    };

    const handleClosePermissionModal = (open: boolean) => {
        setIsPermissionModalOpen(open);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage roles and configure permissions for the RBAC system.
                    </p>
                </div>
                <div className="flex space-x-3">
                    {activeTab === 'permissions' ? (
                        <Button
                            type="button"
                            onClick={handleAddPermission}
                            color="primary"
                        >
                            <KeyIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Create Permission
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleAddRole}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Create Role
                        </Button>
                    )}
                </div>
            </div>

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
                        Roles ({roles?.length || 0})
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
                        Permissions ({permissions?.length || 0})
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'roles' ? (
                <RolesTable roles={roles} totalPages={rolesTotalPages} onEdit={handleEditRole} />
            ) : (
                <PermissionsView 
                    permissions={permissions || []} 
                    totalPages={permissionsTotalPages || 1}
                    onCreatePermission={handleAddPermission}
                />
            )}

            {/* Modals */}
            <RoleModal open={isRoleModalOpen} onClose={handleCloseRoleModal} role={editingRole} />
            <PermissionModal open={isPermissionModalOpen} onClose={handleClosePermissionModal} />
        </div>
    );
};

export default RolesView;

