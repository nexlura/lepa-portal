import { ClockIcon } from "@heroicons/react/24/outline"

const RecentActivities = () => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 sm:py-5 ">
                <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Activity
                    </h3>
                </div>
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
                            {
                                id: 4,
                                type: 'application',
                                content: 'Application approved for Jane Wilson',
                                time: '2 days ago',
                            },
                        ].map((activity, activityIdx) => (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {activityIdx !== 3 ? (
                                        <span
                                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                                                <span className="text-white text-xs font-medium">
                                                    {activity.type.charAt(0).toUpperCase()}
                                                </span>
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
                </div>
            </div>
        </div>
    )
}

export default RecentActivities