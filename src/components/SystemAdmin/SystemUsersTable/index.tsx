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
    const [roleFilter, setRoleFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Get unique roles for filter (filter out undefined/null roles)
    const roles = Array.from(new Set(users.map(u => u.role).filter((role): role is string => Boolean(role))));

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || (user.role || '') === roleFilter;
        const matchesStatus = statusFilter === 'All' || (user.status || '') === statusFilter.toLowerCase();
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                <TableControls
                    search={search}
                    setSearch={setSearch}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    roles={roles}
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

