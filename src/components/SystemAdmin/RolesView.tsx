'use client';

import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import RolesTable from './RolesTable';
import EmptyState from '../EmptyState';
import { Role } from '@/app/(portal)/system-admin/roles/page';

interface RolesViewProps {
    roles: Role[];
    totalPages: number;
}

const RolesView = ({ roles, totalPages }: RolesViewProps) => {
    if (roles?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No Roles Found"
                    subHeading="Get started by creating a new role"
                    button={
                        <Button
                            href="/system-admin/roles/new"
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Create Role
                        </Button>
                    }
                    icon={<ShieldCheckIcon className="size-12 text-gray-500" />}
                />
            </>
        );
    }

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
                    <Button
                        href="/system-admin/roles/new"
                        color="primary"
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                        Create Role
                    </Button>
                </div>
            </div>

            {/* Roles table */}
            <RolesTable roles={roles} totalPages={totalPages} />
        </div>
    );
};

export default RolesView;

