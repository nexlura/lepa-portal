'use client';

import { useState } from 'react';
import { BuildingOfficeIcon, UserGroupIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface TenantData {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    studentCount: number;
    teacherCount: number;
    classCount: number;
    createdAt: string;
}

interface TenantsOverviewProps {
    tenants?: TenantData[];
    onTenantClick?: (tenantId: string) => void;
}

const TenantsOverview = ({ tenants = [], onTenantClick }: TenantsOverviewProps) => {
    const [displayLimit, setDisplayLimit] = useState(5);

    // Use provided tenants or empty array
    const mockTenants: TenantData[] = tenants.length > 0 ? tenants : [];

    const displayedTenants = mockTenants.slice(0, displayLimit);

    const handleTenantClick = (e: React.MouseEvent, tenantId: string) => {
        e.preventDefault();
        if (onTenantClick) {
            onTenantClick(tenantId);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Tenants Overview</h3>
                    <p className="text-sm text-gray-500 mt-1">Top tenants by student count</p>
                </div>
                <a
                    href="/system-admin/tenants"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    View all →
                </a>
            </div>

            <div className="space-y-3">
                {displayedTenants.length > 0 ? (
                    displayedTenants.map((tenant) => (
                        <button
                            key={tenant.id}
                            onClick={(e) => handleTenantClick(e, tenant.id)}
                            className="w-full text-left block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700">
                                            {tenant.name}
                                        </h4>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                tenant.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {tenant.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-6 text-xs text-gray-600">
                                        <div className="flex items-center space-x-1.5">
                                            <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{tenant.studentCount}</span>
                                            <span>students</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{tenant.teacherCount}</span>
                                            <span>teachers</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <BookOpenIcon className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{tenant.classCount}</span>
                                            <span>classes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-medium">No tenants found</p>
                    </div>
                )}
            </div>

            {mockTenants.length > displayLimit && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setDisplayLimit(displayLimit + 5)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Show more ({mockTenants.length - displayLimit} remaining)
                    </button>
                </div>
            )}
        </div>
    );
};

export default TenantsOverview;

