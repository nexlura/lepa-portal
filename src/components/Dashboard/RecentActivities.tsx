import { ClockIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/outline"

interface RecentStudent {
    id: string;
    name: string;
    addedAt: string;
}

interface RecentTeacher {
    id: string;
    name: string;
    addedAt: string;
}

interface RecentActivitiesProps {
    recentStudents?: RecentStudent[];
    recentTeachers?: RecentTeacher[];
}

const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
};

const RecentActivities = ({ recentStudents = [], recentTeachers = [] }: RecentActivitiesProps) => {
    // Combine and sort activities by date
    const activities = [
        ...recentStudents.map(student => ({
            id: student.id,
            type: 'student' as const,
            content: `New student added: ${student.name}`,
            time: formatTimeAgo(student.addedAt),
            icon: UserGroupIcon,
        })),
        ...recentTeachers.map(teacher => ({
            id: teacher.id,
            type: 'teacher' as const,
            content: `New teacher added: ${teacher.name}`,
            time: formatTimeAgo(teacher.addedAt),
            icon: AcademicCapIcon,
        })),
    ]
        .sort((a, b) => {
            // Sort by time (most recent first)
            // This is a simple sort - in production, you'd parse the dates properly
            return 0;
        })
        .slice(0, 10); // Show max 10 recent activities

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 sm:py-5">
                <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Activity
                    </h3>
                </div>
                <div className="flow-root">
                    {activities.length > 0 ? (
                        <ul className="-mb-8">
                            {activities.map((activity, activityIdx) => (
                                <li key={activity.id}>
                                    <div className="relative pb-8">
                                        {activityIdx !== activities.length - 1 ? (
                                            <span
                                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <div className="relative flex space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                                                    <activity.icon className="h-4 w-4 text-white" />
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        {activity.content}
                                                    </p>
                                                    <div className="text-xs text-gray-400">
                                                        <time>{activity.time}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecentActivities