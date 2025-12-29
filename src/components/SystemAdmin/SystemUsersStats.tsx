import {
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';

interface SystemUsersStatsProps {
    users: SystemUser[];
}

const SystemUsersStats = ({ users }: SystemUsersStatsProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Calculate stats from users data
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    
    // Count by user type
    const systemUsers = users.filter(u => 
        u.userType.toLowerCase().includes('system')
    ).length;
    const tenantUsers = users.filter(u => 
        u.userType.toLowerCase().includes('tenant')
    ).length;
    const agencyUsers = users.filter(u => 
        u.userType.toLowerCase().includes('agency')
    ).length;

    const stats = [
        {
            name: 'Total Users',
            value: formatNumber(totalUsers),
            description: 'All system users',
            icon: UsersIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Active Users',
            value: formatNumber(activeUsers),
            description: 'Users currently active',
            icon: CheckCircleIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Inactive Users',
            value: formatNumber(inactiveUsers),
            description: 'Users currently inactive',
            icon: XCircleIcon,
            iconColor: 'text-gray-400',
        },
        {
            name: 'System Users',
            value: formatNumber(systemUsers),
            description: 'System-level users',
            icon: ShieldCheckIcon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'Tenant Users',
            value: formatNumber(tenantUsers),
            description: 'Tenant-level users',
            icon: BuildingOfficeIcon,
            iconColor: 'text-teal-400',
        },
        {
            name: 'Agency Users',
            value: formatNumber(agencyUsers),
            description: 'Agency-level users',
            icon: UserGroupIcon,
            iconColor: 'text-orange-400',
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

export default SystemUsersStats;

