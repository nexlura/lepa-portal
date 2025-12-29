'use client';

import { useState } from 'react';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';
import TenantsTableHead from './TableHead';
import TenantsTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import TableControls from './TableControls';

interface TenantsTableProps {
    tenants: Tenant[];
    totalPages: number;
    onEdit: (tenant: Tenant) => void;
    onView: (tenant: Tenant) => void;
}

const TenantsTable = ({ tenants, totalPages, onEdit, onView }: TenantsTableProps) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Filter tenants based on search and status
    const filteredTenants = tenants.filter((tenant) => {
        const matchesSearch = tenant.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
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
                    tenants={tenants}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <TenantsTableHead />
                        <TenantsTableBody tenants={filteredTenants} onEdit={onEdit} onView={onView} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TenantsTable;

