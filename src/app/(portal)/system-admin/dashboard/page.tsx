import SystemAdminStats from '@/components/SystemAdmin/SystemAdminStats';
import TenantsOverview from '@/components/SystemAdmin/TenantsOverview';
import { BuildingOfficeIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default async function SystemAdminDashboard() {
    // TODO: Replace with API data once endpoint is ready
    // Dummy data for system admin analytics
    const analyticsData = {
        total_tenants: 12,
        active_tenants: 10,
        total_system_users: 8,
        total_students_across_tenants: 3450,
        total_teachers_across_tenants: 280,
        total_classes_across_tenants: 195,
        total_subjects_across_tenants: 45,
        tenants_with_most_students: [
            {
                tenant_id: '1',
                tenant_name: 'Springfield High School',
                student_count: 450,
            },
            {
                tenant_id: '2',
                tenant_name: 'Riverside Academy',
                student_count: 320,
            },
            {
                tenant_id: '3',
                tenant_name: 'Central Elementary',
                student_count: 285,
            },
            {
                tenant_id: '4',
                tenant_name: 'Westside Middle School',
                student_count: 240,
            },
            {
                tenant_id: '5',
                tenant_name: 'North High School',
                student_count: 215,
            },
        ],
    };

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
                    totalTenants: analyticsData.total_tenants,
                    activeTenants: analyticsData.active_tenants,
                    totalSystemUsers: analyticsData.total_system_users,
                    totalStudentsAcrossTenants: analyticsData.total_students_across_tenants,
                    totalTeachersAcrossTenants: analyticsData.total_teachers_across_tenants,
                    totalClassesAcrossTenants: analyticsData.total_classes_across_tenants,
                    totalSubjectsAcrossTenants: analyticsData.total_subjects_across_tenants,
                }}
            />

            {/* Tenants Overview */}
            <TenantsOverview tenants={analyticsData.tenants_with_most_students?.map(t => ({
                id: t.tenant_id,
                name: t.tenant_name,
                status: 'active' as const,
                studentCount: t.student_count,
                teacherCount: Math.floor(t.student_count / 12), // Approximate
                classCount: Math.floor(t.student_count / 18), // Approximate
                createdAt: '2024-01-15',
            }))} />

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

