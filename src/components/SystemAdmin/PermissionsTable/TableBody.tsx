'use client';

import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { Permission } from '@/lib/rbac';
import PermissionDetailsModal from '../PermissionDetailsModal';
import { useState } from 'react';

interface PermissionsTableBodyProps {
    permissions: Permission[];
    onEdit: (permission: Permission) => void;
}

const PermissionsTableBody = ({ permissions, onEdit }: PermissionsTableBodyProps) => {
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsDetailsModalOpen(true);
    };

    if (!permissions || permissions.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No permissions found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <>
            <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {permission.name || 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {permission.code || 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-md truncate">
                                {permission.description || 'No description'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {permission.resource || 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {permission.action || 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => handleViewDetails(permission)}
                                    className="text-primary-600 hover:text-primary-900"
                                    title="View Details"
                                >
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => onEdit(permission)}
                                    className="text-gray-600 hover:text-gray-900"
                                    title="Edit"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            <PermissionDetailsModal
                open={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedPermission(null);
                }}
                permission={selectedPermission}
            />
        </>
    );
};

export default PermissionsTableBody;

