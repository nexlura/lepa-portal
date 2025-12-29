import {
    BuildingOfficeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface TenantsStatsProps {
    tenants: Tenant[];
}

const TenantsStats = ({ tenants }: TenantsStatsProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Calculate stats from tenants data
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const inactiveTenants = tenants.filter(t => t.status === 'inactive').length;

    const stats = [
        {
            name: 'Total Tenants',
            value: formatNumber(totalTenants),
            description: 'All registered school tenants',
            icon: BuildingOfficeIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Active Tenants',
            value: formatNumber(activeTenants),
            description: 'Tenants currently active',
            icon: CheckCircleIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Inactive Tenants',
            value: formatNumber(inactiveTenants),
            description: 'Tenants currently inactive',
            icon: XCircleIcon,
            iconColor: 'text-gray-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

export default TenantsStats;

