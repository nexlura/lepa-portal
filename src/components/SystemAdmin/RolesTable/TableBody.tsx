'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PencilIcon, EyeIcon, KeyIcon } from '@heroicons/react/24/outline';
import type { Role } from '@/types/role';
import RolePermissionManagementModal from '../RolePermissionManagementModal';
import RoleDetailsModal from '../RoleDetailsModal';
import type { Role as RBACRole } from '@/lib/rbac';

interface RolesTableBodyProps {
    roles: Role[];
    onEdit?: (role: Role) => void;
}

const RolesTableBody = ({ roles, onEdit }: RolesTableBodyProps) => {
    const [selectedRole, setSelectedRole] = useState<RBACRole | null>(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedRoleForDetails, setSelectedRoleForDetails] = useState<Role | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleManagePermissions = (role: Role) => {
        // Convert Role to RBACRole format
        const rbacRole: RBACRole = {
            id: role.id,
            name: role.name,
            title: role.name,
            description: role.description,
            permissions: role.permissions.map(perm => ({
                id: perm,
                name: perm,
            })),
            user_count: role.userCount,
            created_at: role.createdAt,
        };
        setSelectedRole(rbacRole);
        setIsPermissionModalOpen(true);
    };

    const handleViewDetails = (role: Role) => {
        setSelectedRoleForDetails(role);
        setIsDetailsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const formatPermissions = (permissions: string[]) => {
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return 'No permissions';
        }
        // Ensure all items are strings
        const stringPermissions = permissions
            .map(p => typeof p === 'string' ? p : String(p))
            .filter(p => p && p !== 'undefined' && p !== 'null');
        
        if (stringPermissions.length === 0) {
            return 'No permissions';
        }
        if (stringPermissions.length <= 3) {
            return stringPermissions.join(', ');
        }
        return `${stringPermissions.slice(0, 3).join(', ')}, +${stringPermissions.length - 3} more`;
    };

    if (roles.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No roles found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <>
            <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{role.name}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-md truncate">{role.description}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-md" title={role.permissions.join(', ')}>
                                {formatPermissions(role.permissions)}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {role.userCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(role.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => handleManagePermissions(role)}
                                    className="text-purple-600 hover:text-purple-900"
                                    title="Manage Permissions"
                                >
                                    <KeyIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleViewDetails(role)}
                                    className="text-primary-600 hover:text-primary-900"
                                    title="View Details"
                                >
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                {onEdit ? (
                                    <button
                                        onClick={() => onEdit(role)}
                                        className="text-gray-600 hover:text-gray-900"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                ) : (
                                    <Link
                                        href={`/system-admin/roles/${role.id}/edit`}
                                        className="text-gray-600 hover:text-gray-900"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            {selectedRole && (
                <RolePermissionManagementModal
                    open={isPermissionModalOpen}
                    onClose={() => {
                        setIsPermissionModalOpen(false);
                        setSelectedRole(null);
                    }}
                    role={selectedRole}
                />
            )}
            <RoleDetailsModal
                open={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedRoleForDetails(null);
                }}
                role={selectedRoleForDetails}
            />
        </>
    );
};

export default RolesTableBody;

