import SystemAdminStats from '@/components/SystemAdmin/SystemAdminStats';
import TenantsOverview from '@/components/SystemAdmin/TenantsOverview';
import TenantDetailsModal from '@/components/SystemAdmin/TenantDetailsModal';
import { BuildingOfficeIcon, UsersIcon, ShieldCheckIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { getModel, isErrorResponse } from '@/lib/connector';
import DashboardTenantsOverview from '@/components/SystemAdmin/DashboardTenantsOverview';

type BackendAnalyticsData = {
    total_agencies?: number;
    total_active_agencies?: number;
    total_suspended_agencies?: number;
    total_inactive_agencies?: number;
    total_managed_schools?: number;
    total_ministry_offices?: number;
    total_tenants?: number;
    active_tenants?: number;
    system_users?: number;
    total_students?: number;
    total_teachers?: number;
    total_classes?: number;
    total_subjects?: number;
    tenant_overview?: Array<{
        tenant_id: string;
        school_name: string;
        student_count: number;
        teacher_count: number;
        class_count: number;
        status: string;
    }>;
};

type AnalyticsApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendAnalyticsData;
    message?: string;
};

export default async function SystemAdminDashboard() {
    // Default/fallback data
    const defaultAnalytics: BackendAnalyticsData = {
        total_agencies: 0,
        total_active_agencies: 0,
        total_suspended_agencies: 0,
        total_inactive_agencies: 0,
        total_managed_schools: 0,
        total_ministry_offices: 0,
        total_tenants: 0,
        active_tenants: 0,
        system_users: 0,
        total_students: 0,
        total_teachers: 0,
        total_classes: 0,
        total_subjects: 0,
        tenant_overview: [],
    };

    let analyticsData = defaultAnalytics;

    try {
        const res = await getModel<AnalyticsApiResponse>('/analytics/system').catch(() => {
            // Silently handle errors - don't log to avoid console noise
            return null;
        });

        if (res && !isErrorResponse(res) && res.data) {
            analyticsData = res.data;
        }
    } catch {
        // Handle all errors gracefully without throwing
        // Use default data on error - page will show with default values
        // Don't log errors to avoid console noise and Next.js fetchData errors
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage tenants, system users, roles, and permissions across the entire platform.
                </p>
            </div>

            {/* Stats */}
            <SystemAdminStats 
                analytics={{
                    totalAgencies: analyticsData.total_agencies,
                    totalActiveAgencies: analyticsData.total_active_agencies,
                    totalSuspendedAgencies: analyticsData.total_suspended_agencies,
                    totalInactiveAgencies: analyticsData.total_inactive_agencies,
                    totalManagedSchools: analyticsData.total_managed_schools,
                    totalMinistryOffices: analyticsData.total_ministry_offices,
                    totalTenants: analyticsData.total_tenants,
                    activeTenants: analyticsData.active_tenants,
                    totalSystemUsers: analyticsData.system_users,
                    totalStudentsAcrossTenants: analyticsData.total_students,
                    totalTeachersAcrossTenants: analyticsData.total_teachers,
                    totalClassesAcrossTenants: analyticsData.total_classes,
                    totalSubjectsAcrossTenants: analyticsData.total_subjects,
                }}
            />

            {/* Tenants Overview */}
            <DashboardTenantsOverview tenants={analyticsData.tenant_overview?.map(t => ({
                id: t.tenant_id || '',
                name: t.school_name || '',
                status: (t.status === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
                studentCount: t.student_count || 0,
                teacherCount: t.teacher_count || 0,
                classCount: t.class_count || 0,
                createdAt: new Date().toISOString(),
            })).filter(t => t.id && t.name) || []} />

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a
                        href="/system-admin/agencies"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                <BuildingOffice2Icon className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage Agencies</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">Manage government agencies</p>
                    </a>
                    <a
                        href="/system-admin/tenants"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage Tenants</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">View and manage all school tenants</p>
                    </a>
                    <a
                        href="/system-admin/users"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <UsersIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage System Users</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">Manage government and support users</p>
                    </a>
                    <a
                        href="/system-admin/roles"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage Roles & Permissions</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">Configure RBAC system</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

