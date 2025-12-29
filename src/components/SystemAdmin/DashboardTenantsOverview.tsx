'use client';

import { useState } from 'react';
import TenantsOverview from './TenantsOverview';
import TenantDetailsModal from './TenantDetailsModal';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface TenantData {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    studentCount: number;
    teacherCount: number;
    classCount: number;
    createdAt: string;
}

interface DashboardTenantsOverviewProps {
    tenants?: TenantData[];
}

const DashboardTenantsOverview = ({ tenants = [] }: DashboardTenantsOverviewProps) => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const handleTenantClick = (tenantId: string) => {
        // Find the tenant from the list
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
            // Convert TenantData to Tenant format
            const tenantForModal: Tenant = {
                id: tenant.id,
                name: tenant.name,
                status: tenant.status,
                studentCount: tenant.studentCount,
                teacherCount: tenant.teacherCount,
                classCount: tenant.classCount,
                createdAt: tenant.createdAt,
            };
            setSelectedTenant(tenantForModal);
            setIsViewModalOpen(true);
        }
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedTenant(null);
    };

    const handleEdit = (tenant: Tenant) => {
        // Navigate to tenants page for editing
        window.location.href = `/system-admin/tenants`;
    };

    return (
        <>
            <TenantsOverview 
                tenants={tenants} 
                onTenantClick={handleTenantClick}
            />
            <TenantDetailsModal
                open={isViewModalOpen}
                onClose={handleCloseViewModal}
                tenant={selectedTenant}
                onEdit={handleEdit}
            />
        </>
    );
};

export default DashboardTenantsOverview;

