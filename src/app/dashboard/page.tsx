import {
    UserGroupIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
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

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome to your Lepa admin dashboard. Here&apos;s an overview of your school&apos;s data.
                </p>
            </div>

            {/* Stats grid */}
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

            {/* Recent activity */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Activity
                    </h3>
                    <div className="mt-5">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {[
                                    {
                                        id: 1,
                                        type: 'application',
                                        content: 'New student application received from John Doe',
                                        time: '2 hours ago',
                                    },
                                    {
                                        id: 2,
                                        type: 'enrollment',
                                        content: 'Sarah Smith enrolled in Grade 10',
                                        time: '4 hours ago',
                                    },
                                    {
                                        id: 3,
                                        type: 'teacher',
                                        content: 'New teacher profile created for Mr. Johnson',
                                        time: '1 day ago',
                                    },
                                ].map((activity, activityIdx) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {activityIdx !== 2 ? (
                                                <span
                                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                        <span className="text-white text-sm font-medium">
                                                            {activity.type.charAt(0).toUpperCase()}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.content}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time>{activity.time}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 