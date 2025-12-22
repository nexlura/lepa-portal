import { 
    BookOpenIcon, 
    UserGroupIcon, 
    BuildingOfficeIcon,
    UsersIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon
} from "@heroicons/react/24/outline"

interface ClassesAnalytics {
    totalClasses: number;
    totalCapacity: number;
    totalStudents: number;
    averageClassSize: number;
    classesAtFullCapacity: number;
    averageUtilizationRate: number;
}

interface ClassesStatsProps {
    analytics: ClassesAnalytics;
}

const ClassesStats = ({ analytics }: ClassesStatsProps) => {
    const stats = {
        totalClasses: analytics.totalClasses,
        totalCapacity: analytics.totalCapacity,
        totalStudents: analytics.totalStudents,
        averageClassSize: analytics.averageClassSize,
        classesAtFullCapacity: analytics.classesAtFullCapacity,
        averageUtilizationRate: analytics.averageUtilizationRate,
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatPercentage = (num: number) => {
        return `${num.toFixed(1)}%`;
    };

    const statCards = [
        {
            name: 'Total Classes',
            value: formatNumber(stats.totalClasses),
            description: 'Number of active classes in the school',
            icon: BookOpenIcon,
            iconColor: 'text-gray-400',
        },
        {
            name: 'Total Capacity',
            value: formatNumber(stats.totalCapacity),
            description: 'Max number of students all classes can accommodate',
            icon: BuildingOfficeIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Total Students',
            value: formatNumber(stats.totalStudents),
            description: 'Total enrolled students across all classes',
            icon: UserGroupIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Average Class Size',
            value: Math.round(stats.averageClassSize).toString(),
            description: 'Average number of students per class',
            icon: UsersIcon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'Classes at Full Capacity',
            value: formatNumber(stats.classesAtFullCapacity),
            description: 'Classes that have reached their maximum capacity',
            icon: CheckCircleIcon,
            iconColor: 'text-orange-400',
        },
        {
            name: 'Average Utilization',
            value: formatPercentage(stats.averageUtilizationRate),
            description: 'Average percentage of class capacity being used',
            icon: ArrowTrendingUpIcon,
            iconColor: 'text-indigo-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
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
    )
}

export default ClassesStats