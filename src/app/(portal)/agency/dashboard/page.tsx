import AgencyStats from '@/components/Agency/AgencyStats';
import AgencyTenantsOverview from '@/components/Agency/AgencyTenantsOverview';
import { BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendAgencyAnalyticsData = {
    total_tenants?: number;
    active_tenants?: number;
    inactive_tenants?: number;
    total_users?: number;
    total_students?: number;
    total_teachers?: number;
    total_classes?: number;
    tenant_overview?: Array<{
        tenant_id: string;
        school_name: string;
        student_count: number;
        teacher_count: number;
        class_count: number;
        status: string;
    }>;
};

type AgencyAnalyticsApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendAgencyAnalyticsData;
    message?: string;
};

export default async function AgencyDashboard() {
    // Default/fallback data
    const defaultAnalytics: BackendAgencyAnalyticsData = {
        total_tenants: 0,
        active_tenants: 0,
        inactive_tenants: 0,
        total_users: 0,
        total_students: 0,
        total_teachers: 0,
        total_classes: 0,
        tenant_overview: [],
    };

    let analyticsData = defaultAnalytics;

    // Fetch agency analytics from API
    try {
        const res = await getModel<AgencyAnalyticsApiResponse>('/analytics/agency').catch(() => {
            return null;
        });

        if (res && !isErrorResponse(res)) {
            // Handle different response structures
            if (res.data) {
                // Standard nested response structure
                analyticsData = res.data;
            } else if (res.success && (res as any).total_tenants !== undefined) {
                // Direct response structure (data at root level)
                analyticsData = res as BackendAgencyAnalyticsData;
            }
            
            // Ensure tenant_overview is an array
            if (analyticsData.tenant_overview && !Array.isArray(analyticsData.tenant_overview)) {
                analyticsData.tenant_overview = [];
            }
            
            // Handle status field - convert boolean is_active to string status if needed
            if (analyticsData.tenant_overview) {
                analyticsData.tenant_overview = analyticsData.tenant_overview.map((tenant: any) => {
                    // If status is missing but is_active exists, convert it
                    if (!tenant.status && tenant.is_active !== undefined) {
                        tenant.status = tenant.is_active ? 'active' : 'inactive';
                    }
                    // Ensure status is a string
                    if (typeof tenant.status === 'boolean') {
                        tenant.status = tenant.status ? 'active' : 'inactive';
                    }
                    return tenant;
                });
            }
            
            // Calculate stats from tenant_overview if not provided directly
            if (analyticsData.tenant_overview && analyticsData.tenant_overview.length > 0) {
                // If total_tenants is not provided, calculate from tenant_overview
                if (!analyticsData.total_tenants || analyticsData.total_tenants === 0) {
                    analyticsData.total_tenants = analyticsData.tenant_overview.length;
                }
                
                // If active_tenants is not provided, calculate from tenant_overview
                if (!analyticsData.active_tenants && analyticsData.active_tenants !== 0) {
                    analyticsData.active_tenants = analyticsData.tenant_overview.filter((t: any) => {
                        const status = t.status || (t.is_active !== undefined ? (t.is_active ? 'active' : 'inactive') : 'active');
                        return status === 'active' || status === true || status === 'Active';
                    }).length;
                }
                
                // If inactive_tenants is not provided, calculate from tenant_overview
                if (!analyticsData.inactive_tenants && analyticsData.inactive_tenants !== 0) {
                    analyticsData.inactive_tenants = analyticsData.tenant_overview.filter((t: any) => {
                        const status = t.status || (t.is_active !== undefined ? (t.is_active ? 'active' : 'inactive') : 'inactive');
                        return status !== 'active' && status !== true && status !== 'Active';
                    }).length;
                }
                
                // Calculate totals from tenant_overview if not provided
                if (!analyticsData.total_students || analyticsData.total_students === 0) {
                    analyticsData.total_students = analyticsData.tenant_overview.reduce((sum: number, t: any) => {
                        return sum + (Number(t.student_count || t.studentCount || t.students || 0));
                    }, 0);
                }
                
                if (!analyticsData.total_teachers || analyticsData.total_teachers === 0) {
                    analyticsData.total_teachers = analyticsData.tenant_overview.reduce((sum: number, t: any) => {
                        return sum + (Number(t.teacher_count || t.teacherCount || t.teachers || 0));
                    }, 0);
                }
                
                if (!analyticsData.total_classes || analyticsData.total_classes === 0) {
                    analyticsData.total_classes = analyticsData.tenant_overview.reduce((sum: number, t: any) => {
                        return sum + (Number(t.class_count || t.classCount || t.classes || 0));
                    }, 0);
                }
            }
        }
    } catch {
        // Handle all errors gracefully without throwing
        // Use default data on error - page will show with default values
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your tenants, users, and view analytics for your agency.
                </p>
            </div>

            {/* Stats */}
            <AgencyStats 
                analytics={{
                    totalTenants: analyticsData.total_tenants || 0,
                    activeTenants: analyticsData.active_tenants || 0,
                    inactiveTenants: analyticsData.inactive_tenants || 0,
                    totalUsers: analyticsData.total_users || 0,
                    totalStudents: analyticsData.total_students || 0,
                    totalTeachers: analyticsData.total_teachers || 0,
                    totalClasses: analyticsData.total_classes || 0,
                }}
            />

            {/* Tenants Overview */}
            <AgencyTenantsOverview 
                tenants={analyticsData.tenant_overview?.map((t: any) => {
                    // Handle different field name variations from backend
                    const tenantId = t.tenant_id || t.id || t.tenantId || '';
                    const schoolName = t.school_name || t.name || t.schoolName || '';
                    const status = t.status || (t.is_active !== undefined ? (t.is_active ? 'active' : 'inactive') : 'active');
                    const studentCount = t.student_count || t.studentCount || t.students || 0;
                    const teacherCount = t.teacher_count || t.teacherCount || t.teachers || 0;
                    const classCount = t.class_count || t.classCount || t.classes || 0;
                    
                    return {
                        id: tenantId,
                        name: schoolName,
                        status: (status === 'active' || status === true || status === 'Active') ? 'active' : 'inactive' as 'active' | 'inactive',
                        studentCount: Number(studentCount) || 0,
                        teacherCount: Number(teacherCount) || 0,
                        classCount: Number(classCount) || 0,
                        createdAt: t.created_at || t.createdAt || new Date().toISOString(),
                    };
                }).filter((t: any) => t.id && t.name) || []} 
            />

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/agency/tenants"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage Tenants</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">View and manage your school tenants</p>
                    </a>
                    <a
                        href="/agency/users"
                        className="group p-5 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <UsersIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">Manage Users</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-12">Manage tenant users for your agency</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

