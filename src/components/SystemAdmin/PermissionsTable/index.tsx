'use client';

import PermissionsTableHead from './TableHead';
import PermissionsTableBody from './TableBody';
import TableFoot from '@/components/TableFoot';
import type { Permission } from '@/lib/rbac';

interface PermissionsTableProps {
    permissions: Permission[];
    totalPages: number;
    onEdit: (permission: Permission) => void;
}

const PermissionsTable = ({ permissions, totalPages, onEdit }: PermissionsTableProps) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <PermissionsTableHead />
                    <PermissionsTableBody permissions={permissions} onEdit={onEdit} />
                    {totalPages > 1 && <TableFoot totalPages={totalPages} />}
                </table>
            </div>
        </div>
    );
};

export default PermissionsTable;

