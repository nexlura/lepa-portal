'use client';

import { useState } from 'react';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';
import AgenciesTableHead from './TableHead';
import AgenciesTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import TableControls from './TableControls';

interface AgenciesTableProps {
    agencies: Agency[];
    totalPages: number;
    onEdit: (agency: Agency) => void;
}

const AgenciesTable = ({ agencies, totalPages, onEdit }: AgenciesTableProps) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');

    // Filter agencies based on search, status, and type
    const filteredAgencies = agencies.filter((agency) => {
        const matchesSearch = agency.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || agency.status === statusFilter.toLowerCase();
        const matchesType = typeFilter === 'All' || agency.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                <TableControls
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    agencies={agencies}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <AgenciesTableHead />
                        <AgenciesTableBody agencies={filteredAgencies} onEdit={onEdit} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgenciesTable;

