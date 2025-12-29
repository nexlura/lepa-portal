'use client';

import { useState } from 'react';
import { PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import TenantsTable from './TenantsTable';
import TenantsStats from './TenantsStats';
import TenantModal from './TenantModal';
import TenantDetailsModal from './TenantDetailsModal';
import EmptyState from '../EmptyState';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface TenantsViewProps {
    tenants: Tenant[];
    totalPages: number;
}

const TenantsView = ({ tenants, totalPages }: TenantsViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const handleAdd = () => {
        setSelectedTenant(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsModalOpen(true);
    };

    const handleView = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTenant(null);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedTenant(null);
    };

    if (tenants?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No Tenants Found"
                    subHeading="Get started by adding a new tenant"
                    button={
                        <Button
                            onClick={handleAdd}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add Tenant
                        </Button>
                    }
                    icon={<BuildingOfficeIcon className="size-12 text-gray-500" />}
                />
                <TenantModal open={isModalOpen} onClose={handleCloseModal} tenant={selectedTenant} />
                <TenantDetailsModal 
                    open={isViewModalOpen} 
                    onClose={handleCloseViewModal} 
                    tenant={selectedTenant} 
                    onEdit={handleEdit}
                />
            </>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all school tenants and their configurations.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            onClick={handleAdd}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add Tenant
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <TenantsStats tenants={tenants} />

                {/* Tenants table */}
                <TenantsTable tenants={tenants} totalPages={totalPages} onEdit={handleEdit} onView={handleView} />
            </div>
            <TenantModal open={isModalOpen} onClose={handleCloseModal} tenant={selectedTenant} />
            <TenantDetailsModal 
                open={isViewModalOpen} 
                onClose={handleCloseViewModal} 
                tenant={selectedTenant} 
                onEdit={handleEdit}
            />
        </>
    );
};

export default TenantsView;

