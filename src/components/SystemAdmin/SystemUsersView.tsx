'use client';

import { useState } from 'react';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import SystemUsersTable from './SystemUsersTable';
import SystemUsersStats from './SystemUsersStats';
import UserModal from './UserModal';
import EmptyState from '../EmptyState';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';

interface SystemUsersViewProps {
    users: SystemUser[];
    totalPages: number;
}

const SystemUsersView = ({ users, totalPages }: SystemUsersViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAdd = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (users?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No System Users Found"
                    subHeading="Get started by adding a new system user"
                    button={
                        <Button
                            onClick={handleAdd}
                            color="primary"
                            type="button"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add User
                        </Button>
                    }
                    icon={<UsersIcon className="size-12 text-gray-500" />}
                />
                <UserModal open={isModalOpen} onClose={handleCloseModal} />
            </>
        );
    }

    return (
        <>
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
                            onClick={handleAdd}
                            color="primary"
                            type="button"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add User
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <SystemUsersStats users={users} />

                {/* Users table */}
                <SystemUsersTable users={users} totalPages={totalPages} />
            </div>
            <UserModal open={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default SystemUsersView;

