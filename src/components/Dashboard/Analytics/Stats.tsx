import {
    UserGroupIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const stats = [
    {
        name: 'Total Students',
        value: '1,234',
        change: '+12%',
        changeType: 'positive',
        icon: UserGroupIcon,
    },
    {
        name: 'Total Teachers',
        value: '89',
        change: '+5%',
        changeType: 'positive',
        icon: AcademicCapIcon,
    },
    {
        name: 'Applications',
        value: '456',
        change: '+23%',
        changeType: 'positive',
        icon: DocumentTextIcon,
    },
    {
        name: 'Admission Rate',
        value: '78%',
        change: '+2%',
        changeType: 'positive',
        icon: ChartBarIcon,
    },
];

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="bg-white overflow-hidden shadow rounded-lg"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <stat.icon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.name}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            {stat.change}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DashboardStats