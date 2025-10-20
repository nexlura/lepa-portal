'use client';

import {
    BellIcon,
    Bars3Icon,
    ArrowLeftEndOnRectangleIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar';
import { Logo } from '@/components/Logo';

export default function Header({ onMenuClick, onDesktopToggleSidebar, isSidebarCollapsed }: { onMenuClick?: () => void; onDesktopToggleSidebar?: () => void; isSidebarCollapsed?: boolean }) {
    const { data: session } = useSession();

    const [currentUser, setCurrentUser] = useState<{
        role: string;
        email?: string | null;
        name?: string | null
        schoolName?: string | null
    } | null>()


    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user)
            console.log('current user', session.user);

        }
    }, [session])


    return (
        <header className="sm:py-3">
            <div className='h-full w-full border-b-2 border-gray-200 lg:hidden' >
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 ">
                    {/* Left side - Mobile logo and menu button */}
                    <div className="flex items-center gap-x-6 lg:hidden">
                        <button
                            className="rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={onMenuClick}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <Logo height={24} icon={true} />
                    </div>

                    {/* Center - Desktop collapse toggle */}
                    <div className="flex-1 max-w-lg mx-4 lg:mx-8">
                        <div className="hidden lg:flex">
                            <button
                                className="px-2 py-1 rounded-md text-red-500 hover:text-gray-600 hover:bg-gray-100"
                                onClick={onDesktopToggleSidebar}
                                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                {isSidebarCollapsed ? (
                                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                                ) : (
                                    <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right side - User menu and notifications */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                            <BellIcon className="h-6 w-6" />
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                        </button>

                        {/* User avatar and menu */}
                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">
                                    {currentUser && currentUser.role}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {currentUser && currentUser.name}
                                </span>
                            </div>
                            {currentUser?.name && (<Avatar fullName={currentUser?.name} />)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 