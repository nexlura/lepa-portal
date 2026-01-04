import { BuildingOfficeIcon, UsersIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface AgencyAnalytics {
    totalTenants: number;
    activeTenants: number;
    inactiveTenants: number;
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
}

interface AgencyStatsProps {
    analytics: AgencyAnalytics;
}

const AgencyStats = ({ analytics }: AgencyStatsProps) => {
    const stats = [
        {
            name: 'Total Tenants',
            value: analytics.totalTenants,
            description: 'Total number of tenants under your agency',
            icon: BuildingOfficeIcon,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            name: 'Active Tenants',
            value: analytics.activeTenants,
            description: 'Tenants currently active and operational',
            icon: BuildingOfficeIcon,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
        {
            name: 'Total Users',
            value: analytics.totalUsers,
            description: 'Total tenant admin users across all tenants',
            icon: UsersIcon,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            name: 'Total Students',
            value: analytics.totalStudents,
            description: 'Total students across all managed schools',
            icon: UserGroupIcon,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
        },
        {
            name: 'Total Teachers',
            value: analytics.totalTeachers,
            description: 'Total teachers across all managed schools',
            icon: AcademicCapIcon,
            color: 'bg-amber-500',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
        {
            name: 'Total Classes',
            value: analytics.totalClasses,
            description: 'Total classes across all managed schools',
            icon: BuildingOfficeIcon,
            color: 'bg-rose-500',
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.name}
                        className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
                    >
                        <dt>
                            <div className={`absolute rounded-md ${stat.bgColor} p-3`}>
                                <Icon className={`h-6 w-6 ${stat.textColor}`} aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">{stat.value.toLocaleString()}</p>
                        </dd>
                        {stat.description && (
                            <dd className="ml-16 mt-1">
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </dd>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AgencyStats;

