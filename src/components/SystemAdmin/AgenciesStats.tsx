import {
    BuildingOffice2Icon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

interface AgenciesStatsProps {
    agencies: Agency[];
}

const AgenciesStats = ({ agencies }: AgenciesStatsProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Calculate stats from agencies data
    const totalAgencies = agencies.length;
    const activeAgencies = agencies.filter(a => a.status === 'active').length;
    const suspendedAgencies = agencies.filter(a => a.status === 'suspended').length;
    const inactiveAgencies = agencies.filter(a => a.status === 'inactive').length;
    const totalTenantsManaged = agencies.reduce((sum, a) => sum + a.tenantCount, 0);
    const ministryCount = agencies.filter(a => a.type === 'Ministry').length;
    const districtOfficeCount = agencies.filter(a => a.type === 'District Office').length;
    const stateBoardCount = agencies.filter(a => a.type === 'State/County Board').length;

    const stats = [
        {
            name: 'Total Agencies',
            value: formatNumber(totalAgencies),
            description: 'All government agencies',
            icon: BuildingOffice2Icon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Active Agencies',
            value: formatNumber(activeAgencies),
            description: 'Agencies currently active',
            icon: CheckCircleIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Suspended Agencies',
            value: formatNumber(suspendedAgencies),
            description: 'Agencies currently suspended',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-yellow-400',
        },
        {
            name: 'Inactive Agencies',
            value: formatNumber(inactiveAgencies),
            description: 'Agencies currently inactive',
            icon: XCircleIcon,
            iconColor: 'text-gray-400',
        },
        {
            name: 'Schools Managed',
            value: formatNumber(totalTenantsManaged),
            description: 'Total schools under agency oversight',
            icon: BuildingOfficeIcon,
            iconColor: 'text-indigo-400',
        },
        {
            name: 'Ministry Offices',
            value: formatNumber(ministryCount),
            description: 'Ministry-level agencies',
            icon: BuildingOffice2Icon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'District Offices',
            value: formatNumber(districtOfficeCount),
            description: 'District-level education offices',
            icon: UserGroupIcon,
            iconColor: 'text-orange-400',
        },
        {
            name: 'State/County Boards',
            value: formatNumber(stateBoardCount),
            description: 'State and county education boards',
            icon: BuildingOffice2Icon,
            iconColor: 'text-teal-400',
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

export default AgenciesStats;

