import {
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
    studentsCount: number;
    teachersCount: number;
    classesCount: number;
    studentTeacherRatio: number;
}

const DashboardStats = ({ studentsCount, teachersCount, classesCount, studentTeacherRatio }: DashboardStatsProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const stats = [
        {
            name: 'Students',
            value: formatNumber(studentsCount),
            icon: UserGroupIcon,
        },
        {
            name: 'Teachers',
            value: formatNumber(teachersCount),
            icon: AcademicCapIcon,
        },
        {
            name: 'Classes',
            value: formatNumber(classesCount),
            icon: BookOpenIcon,
        },
        {
            name: 'Student–Teacher Ratio',
            value: studentTeacherRatio > 0 ? `${studentTeacherRatio.toFixed(1)}:1` : 'N/A',
            icon: ChartBarIcon,
        },
    ];

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
                                    <dd>
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
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