import {
    BuildingOfficeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    UsersIcon,
    ChartBarIcon,
    BuildingOffice2Icon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface SystemAdminAnalytics {
    totalAgencies?: number;
    totalActiveAgencies?: number;
    totalSuspendedAgencies?: number;
    totalInactiveAgencies?: number;
    totalManagedSchools?: number;
    totalMinistryOffices?: number;
    totalTenants?: number;
    activeTenants?: number;
    totalSystemUsers?: number;
    totalStudentsAcrossTenants?: number;
    totalTeachersAcrossTenants?: number;
    totalClassesAcrossTenants?: number;
    totalSubjectsAcrossTenants?: number;
}

interface SystemAdminStatsProps {
    analytics: SystemAdminAnalytics;
}

const SystemAdminStats = ({ analytics }: SystemAdminStatsProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const stats = [
        {
            name: 'Total Agencies',
            value: formatNumber(analytics.totalAgencies || 0),
            description: 'Total number of agencies',
            icon: BuildingOffice2Icon,
            iconColor: 'text-emerald-400',
        },
        {
            name: 'Active Agencies',
            value: formatNumber(analytics.totalActiveAgencies || 0),
            description: 'Agencies currently active',
            icon: BuildingOffice2Icon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Managed Schools',
            value: formatNumber(analytics.totalManagedSchools || 0),
            description: 'Schools managed by agencies',
            icon: BuildingOfficeIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Total Tenants',
            value: formatNumber(analytics.totalTenants || 0),
            description: 'Total number of school tenants',
            icon: BuildingOfficeIcon,
            iconColor: 'text-indigo-400',
        },
        {
            name: 'Active Tenants',
            value: formatNumber(analytics.activeTenants || 0),
            description: 'Tenants currently active',
            icon: BuildingOfficeIcon,
            iconColor: 'text-cyan-400',
        },
        {
            name: 'System Users',
            value: formatNumber(analytics.totalSystemUsers || 0),
            description: 'Government and support users',
            icon: UsersIcon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'Total Students',
            value: formatNumber(analytics.totalStudentsAcrossTenants || 0),
            description: 'Students across all tenants',
            icon: UserGroupIcon,
            iconColor: 'text-pink-400',
        },
        {
            name: 'Total Teachers',
            value: formatNumber(analytics.totalTeachersAcrossTenants || 0),
            description: 'Teachers across all tenants',
            icon: AcademicCapIcon,
            iconColor: 'text-orange-400',
        },
        {
            name: 'Total Classes',
            value: formatNumber(analytics.totalClassesAcrossTenants || 0),
            description: 'Classes across all tenants',
            icon: BookOpenIcon,
            iconColor: 'text-teal-400',
        },
        {
            name: 'Total Subjects',
            value: formatNumber(analytics.totalSubjectsAcrossTenants || 0),
            description: 'Unique subjects across all tenants',
            icon: ChartBarIcon,
            iconColor: 'text-rose-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.name}
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stat.value}
                                    </dd>
                                    <dd className="text-xs text-gray-400 mt-1">
                                        {stat.description}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SystemAdminStats;

