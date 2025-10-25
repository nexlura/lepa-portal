import { Cog6ToothIcon, BellIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const settingsSections = [
        {
            id: 'profile',
            name: 'Profile Settings',
            description: 'Manage your account profile and personal information',
            icon: UserIcon,
            href: '#',
        },
        {
            id: 'notifications',
            name: 'Notification Preferences',
            description: 'Configure how you receive notifications and alerts',
            icon: BellIcon,
            href: '#',
        },
        {
            id: 'security',
            name: 'Security Settings',
            description: 'Manage your password and security preferences',
            icon: ShieldCheckIcon,
            href: '#',
        },
        {
            id: 'system',
            name: 'System Settings',
            description: 'Configure system-wide settings and preferences',
            icon: Cog6ToothIcon,
            href: '#',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Settings sections */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {settingsSections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <section.icon className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {section.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Configure
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <button className="relative group bg-white p-6 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <div>
                                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                                    <UserIcon className="h-6 w-6" />
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Update Profile
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Change your personal information and contact details.
                                </p>
                            </div>
                        </button>

                        <button className="relative group bg-white p-6 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <div>
                                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                                    <ShieldCheckIcon className="h-6 w-6" />
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Change Password
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Update your password to keep your account secure.
                                </p>
                            </div>
                        </button>

                        <button className="relative group bg-white p-6 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <div>
                                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                                    <BellIcon className="h-6 w-6" />
                                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Notification Settings
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Configure your notification preferences and alerts.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 