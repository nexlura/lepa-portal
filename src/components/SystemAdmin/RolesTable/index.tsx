'use client';

import { useState } from 'react';
import { Role } from '@/app/(portal)/system-admin/roles/page';
import RolesTableHead from './TableHead';
import RolesTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import TableControls from './TableControls';

interface RolesTableProps {
    roles: Role[];
    totalPages: number;
}

const RolesTable = ({ roles, totalPages }: RolesTableProps) => {
    const [search, setSearch] = useState('');

    // Filter roles based on search
    const filteredRoles = roles.filter((role) => {
        return role.name.toLowerCase().includes(search.toLowerCase()) ||
               role.description.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                <TableControls
                    search={search}
                    setSearch={setSearch}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <RolesTableHead />
                        <RolesTableBody roles={filteredRoles} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesTable;

