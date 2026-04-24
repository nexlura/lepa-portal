'use client';

import { useState } from 'react';
import { PlusIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import PermissionsTable from './PermissionsTable';
import EmptyState from '../EmptyState';
import PermissionModal from './PermissionModal';
import type { Permission } from '@/lib/rbac';

interface PermissionsViewProps {
    permissions: Permission[];
    totalPages: number;
    onCreatePermission?: () => void;
}

const PermissionsView = ({ permissions, totalPages, onCreatePermission }: PermissionsViewProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

    const handleAddPermission = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (onCreatePermission) {
            onCreatePermission();
        }
    };

    const handleEditPermission = (permission: Permission) => {
        setEditingPermission(permission);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = (open: boolean) => {
        setIsEditModalOpen(open);
        if (!open) {
            setEditingPermission(null);
        }
    };

    if (!permissions || permissions.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No Permissions Found"
                    subHeading="Get started by creating a new permission"
                    button={
                        <Button
                            type="button"
                            onClick={handleAddPermission}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Create Permission
                        </Button>
                    }
                    icon={<KeyIcon className="size-12 text-gray-500" />}
                />
                {/* Edit modal - always render to avoid hydration issues */}
                <PermissionModal 
                    open={isEditModalOpen} 
                    onClose={handleCloseEditModal}
                    permission={editingPermission}
                />
            </>
        );
    }

    return (
        <>
            {/* Permissions table */}
            <PermissionsTable 
                permissions={permissions} 
                totalPages={totalPages || 1}
                onEdit={handleEditPermission}
            />
            {/* Edit modal - only for editing, create is handled by RolesView */}
            <PermissionModal 
                open={isEditModalOpen} 
                onClose={handleCloseEditModal}
                permission={editingPermission}
            />
        </>
    );
};

export default PermissionsView;

