'use client';

import { useState } from 'react';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';
import SystemUsersTableHead from './TableHead';
import SystemUsersTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import TableControls from './TableControls';

interface SystemUsersTableProps {
    users: SystemUser[];
    totalPages: number;
}

const SystemUsersTable = ({ users, totalPages }: SystemUsersTableProps) => {
    const [search, setSearch] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Get unique user types for filter (filter out undefined/null user types)
    const userTypes = Array.from(new Set(users.map(u => u.userType).filter((userType): userType is string => Boolean(userType))));

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(search.toLowerCase());
        const matchesUserType = userTypeFilter === 'All' || (user.userType || '') === userTypeFilter;
        const matchesStatus = statusFilter === 'All' || (user.status || '') === statusFilter.toLowerCase();
        return matchesSearch && matchesUserType && matchesStatus;
    });

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                <TableControls
                    search={search}
                    setSearch={setSearch}
                    userTypeFilter={userTypeFilter}
                    setUserTypeFilter={setUserTypeFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    userTypes={userTypes}
                    users={users}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <SystemUsersTableHead />
                        <SystemUsersTableBody users={filteredUsers} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemUsersTable;

