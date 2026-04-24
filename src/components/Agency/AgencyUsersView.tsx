'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import SystemUsersTable from '@/components/SystemAdmin/SystemUsersTable';
import UserModal from '@/components/SystemAdmin/UserModal';
import type { AgencyUser } from '@/app/(portal)/agency/users/page';

interface AgencyUsersViewProps {
    users: AgencyUser[];
    totalPages: number;
    agencyId: string | null;
}

const AgencyUsersView = ({ users, totalPages, agencyId }: AgencyUsersViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAdd = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsModalOpen(true);
    };

    const handleCloseModal = (open: boolean) => {
        setIsModalOpen(open);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage tenant admin users for tenants that belong to your agency. You can only create tenant admin users, not system admins, teachers, students, or parents.
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={handleAdd}
                    color="primary"
                >
                    <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                    Add User
                </Button>
            </div>

            {/* Users table */}
            <SystemUsersTable 
                users={users.map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    userType: u.userType,
                    status: u.status,
                    createdAt: u.createdAt,
                }))} 
                totalPages={totalPages}
            />

            {/* User modal - restricted to tenant users only */}
            <UserModal
                open={isModalOpen}
                onClose={handleCloseModal}
                agencyId={agencyId || undefined}
                restrictToTenantUsers={true}
            />
        </div>
    );
};

export default AgencyUsersView;

