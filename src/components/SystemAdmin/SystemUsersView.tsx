'use client';

import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import SystemUsersTable from './SystemUsersTable';
import EmptyState from '../EmptyState';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';

interface SystemUsersViewProps {
    users: SystemUser[];
    totalPages: number;
}

const SystemUsersView = ({ users, totalPages }: SystemUsersViewProps) => {
    if (users?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No System Users Found"
                    subHeading="Get started by adding a new system user"
                    button={
                        <Button
                            href="/system-admin/users/new"
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add User
                        </Button>
                    }
                    icon={<UsersIcon className="size-12 text-gray-500" />}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Users</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage government and system support users.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        href="/system-admin/users/new"
                        color="primary"
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Users table */}
            <SystemUsersTable users={users} totalPages={totalPages} />
        </div>
    );
};

export default SystemUsersView;

