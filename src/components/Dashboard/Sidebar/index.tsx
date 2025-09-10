import {
    XMarkIcon,
    ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';

import SidebarNavigation from './Navigation';
import { signOut } from '../../../../auth';
import SettingsNavigation from './SettingsNavigation';

interface SidebarProps {
    isOpen: boolean;
}

export interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

export default function Sidebar({ isOpen }: SidebarProps) {


    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed sm:rounded-lg inset-y-0 left-0 sm:my-4 bg-white lg:ml-4 w-64 transform  transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-16 items-center justify-between px-6 border-gray-200">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Lepa</h1>
                        </div>
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <SidebarNavigation />
                    <div className=" border-gray-200 p-4">
                        <SettingsNavigation />
                        {/* Logout */}
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <button
                                className="group flex w-full items-center px-3 py-2 text-sm font-medium text-accent-900 rounded-md hover:bg-primary-50 hover:text-gray-900 transition-colors"
                            >
                                <ArrowRightEndOnRectangleIcon className="mr-3 h-5 w-5 text-accent-900 group-hover:text-gray-500" />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
} 