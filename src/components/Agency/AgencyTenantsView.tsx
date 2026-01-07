'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import TenantsTable from '@/components/SystemAdmin/TenantsTable';
import TenantModal from '@/components/SystemAdmin/TenantModal';
import type { Tenant } from '@/app/(portal)/agency/tenants/page';

interface AgencyTenantsViewProps {
    tenants: Tenant[];
    totalPages: number;
    agencyId?: string | null;
}

const AgencyTenantsView = ({ tenants, totalPages, agencyId }: AgencyTenantsViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const handleAdd = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setEditingTenant(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setEditingTenant(null);
        }
    };

    const handleEdit = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Tenants</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage tenants that belong to your agency.
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={handleAdd}
                    color="primary"
                >
                    <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                    Add Tenant
                </Button>
            </div>

            {/* Tenants table */}
            <TenantsTable 
                tenants={tenants} 
                totalPages={totalPages}
                onEdit={handleEdit}
                onView={handleEdit}
            />

            {/* Tenant modal */}
            <TenantModal
                open={isModalOpen}
                onClose={handleCloseModal}
                tenant={editingTenant}
                agencyId={agencyId}
            />
        </div>
    );
};

export default AgencyTenantsView;

