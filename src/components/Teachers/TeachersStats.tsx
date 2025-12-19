import { 
    AcademicCapIcon, 
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChartBarIcon,
    BookOpenIcon
} from "@heroicons/react/24/outline"

interface TeachersAnalytics {
    totalTeachers: number;
    activeTeachers: number;
    teachersWithClasses: number;
    teachersWithoutClasses: number;
    averageStudentsPerTeacher: number;
    totalSubjectsTaught: number;
}

interface TeachersStatsProps {
    analytics: TeachersAnalytics;
}

const TeachersStats = ({ analytics }: TeachersStatsProps) => {
    const stats = {
        totalTeachers: analytics.totalTeachers,
        activeTeachers: analytics.activeTeachers,
        teachersWithClasses: analytics.teachersWithClasses,
        teachersWithoutClasses: analytics.teachersWithoutClasses,
        averageStudentsPerTeacher: analytics.averageStudentsPerTeacher,
        totalSubjectsTaught: analytics.totalSubjectsTaught,
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDecimal = (num: number) => {
        return num.toFixed(1);
    };

    const statCards = [
        {
            name: 'Total Teachers',
            value: formatNumber(stats.totalTeachers),
            description: 'Total number of teachers in the school',
            icon: AcademicCapIcon,
            iconColor: 'text-gray-400',
        },
        {
            name: 'Active Teachers',
            value: formatNumber(stats.activeTeachers),
            description: 'Teachers currently active and teaching',
            icon: CheckCircleIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Teachers with Classes',
            value: formatNumber(stats.teachersWithClasses),
            description: 'Teachers assigned to one or more classes',
            icon: UserGroupIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Teachers without Classes',
            value: formatNumber(stats.teachersWithoutClasses),
            description: 'Teachers not yet assigned to any class',
            icon: XCircleIcon,
            iconColor: 'text-orange-400',
        },
        {
            name: 'Average Students per Teacher',
            value: formatDecimal(stats.averageStudentsPerTeacher),
            description: 'Average number of students assigned per teacher',
            icon: ChartBarIcon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'Total Subjects Taught',
            value: formatNumber(stats.totalSubjectsTaught),
            description: 'Unique number of subjects being taught',
            icon: BookOpenIcon,
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

export default TeachersStats