'use client';

import { useState } from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import TenantDetailsModal from '@/components/SystemAdmin/TenantDetailsModal';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface AgencyTenantsOverviewProps {
    tenants: Tenant[];
}

const AgencyTenantsOverview = ({ tenants }: AgencyTenantsOverviewProps) => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const handleTenantClick = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedTenant(null);
    };

    if (!tenants || tenants.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tenants Overview</h3>
                <p className="text-sm text-gray-500">No tenants found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tenants Overview</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                        <button
                            key={tenant.id}
                            onClick={() => handleTenantClick(tenant)}
                            className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <div className={`p-2 rounded-lg ${
                                    tenant.status === 'active' ? 'bg-emerald-100' : 'bg-gray-100'
                                }`}>
                                    <BuildingOfficeIcon className={`h-5 w-5 ${
                                        tenant.status === 'active' ? 'text-emerald-600' : 'text-gray-600'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{tenant.name}</h4>
                                    <p className={`text-xs ${
                                        tenant.status === 'active' ? 'text-emerald-600' : 'text-gray-500'
                                    }`}>
                                        {tenant.status === 'active' ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-500">Students</p>
                                    <p className="font-semibold text-gray-900">{tenant.studentCount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Teachers</p>
                                    <p className="font-semibold text-gray-900">{tenant.teacherCount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Classes</p>
                                    <p className="font-semibold text-gray-900">{tenant.classCount}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {selectedTenant && (
                <TenantDetailsModal
                    open={isViewModalOpen}
                    onClose={handleCloseModal}
                    tenant={selectedTenant}
                    onEdit={() => {
                        // Agency dashboard currently exposes read-only tenant details.
                    }}
                />
            )}
        </>
    );
};

export default AgencyTenantsOverview;

