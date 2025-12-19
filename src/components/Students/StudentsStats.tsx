import { 
    UserGroupIcon, 
    AcademicCapIcon,
    ChartBarIcon,
    BookOpenIcon,
    CalendarIcon,
    UserIcon
} from "@heroicons/react/24/outline"

interface StudentsAnalytics {
    totalStudents: number;
    activeStudents: number;
    enrolledStudents: number;
    averageAge: number;
    studentsByGender: {
        male: number;
        female: number;
        other: number;
    };
    newEnrollmentsThisMonth: number;
}

interface StudentsStatsProps {
    analytics: StudentsAnalytics;
}

const StudentsStats = ({ analytics }: StudentsStatsProps) => {
    const stats = {
        totalStudents: analytics.totalStudents,
        activeStudents: analytics.activeStudents,
        enrolledStudents: analytics.enrolledStudents,
        averageAge: analytics.averageAge,
        maleStudents: analytics.studentsByGender.male,
        femaleStudents: analytics.studentsByGender.female,
        newEnrollmentsThisMonth: analytics.newEnrollmentsThisMonth,
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDecimal = (num: number) => {
        return num.toFixed(1);
    };

    const statCards = [
        {
            name: 'Total Students',
            value: formatNumber(stats.totalStudents),
            description: 'Total number of students in the school',
            icon: UserGroupIcon,
            iconColor: 'text-gray-400',
        },
        {
            name: 'Active Students',
            value: formatNumber(stats.activeStudents),
            description: 'Students currently enrolled and active',
            icon: UserIcon,
            iconColor: 'text-green-400',
        },
        {
            name: 'Enrolled Students',
            value: formatNumber(stats.enrolledStudents),
            description: 'Students currently enrolled in classes',
            icon: AcademicCapIcon,
            iconColor: 'text-blue-400',
        },
        {
            name: 'Average Age',
            value: `${stats.averageAge} years`,
            description: 'Average age of all students',
            icon: ChartBarIcon,
            iconColor: 'text-purple-400',
        },
        {
            name: 'New Enrollments',
            value: formatNumber(stats.newEnrollmentsThisMonth),
            description: 'Students enrolled this month',
            icon: CalendarIcon,
            iconColor: 'text-orange-400',
        },
        {
            name: 'Gender Distribution',
            value: `${formatNumber(stats.maleStudents)}M / ${formatNumber(stats.femaleStudents)}F`,
            description: 'Male and female student counts',
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

export default StudentsStats

