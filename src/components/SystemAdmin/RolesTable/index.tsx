'use client';

import { useState } from 'react';
import type { Role } from '@/types/role';
import RolesTableHead from './TableHead';
import RolesTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import TableControls from './TableControls';

interface RolesTableProps {
    roles: Role[];
    totalPages: number;
    onEdit?: (role: Role) => void;
}

const RolesTable = ({ roles, totalPages, onEdit }: RolesTableProps) => {
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
                        <RolesTableBody roles={filteredRoles} onEdit={onEdit} />
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

