'use client';

import { PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import TenantsTable from './TenantsTable';
import TenantsStats from './TenantsStats';
import EmptyState from '../EmptyState';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface TenantsViewProps {
    tenants: Tenant[];
    totalPages: number;
}

const TenantsView = ({ tenants, totalPages }: TenantsViewProps) => {
    if (tenants?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No Tenants Found"
                    subHeading="Get started by adding a new tenant"
                    button={
                        <Button
                            href="/system-admin/tenants/new"
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add Tenant
                        </Button>
                    }
                    icon={<BuildingOfficeIcon className="size-12 text-gray-500" />}
                />
            </>
        );
    }

    return (
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
                        href="/system-admin/tenants/new"
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
            <TenantsTable tenants={tenants} totalPages={totalPages} />
        </div>
    );
};

export default TenantsView;

