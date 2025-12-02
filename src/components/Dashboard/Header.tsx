'use client';

import {
    Bars3Icon,
} from '@heroicons/react/24/outline';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar';
import { IconLogo } from '@/components/Logo';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { data: session } = useSession();

    const [currentUser, setCurrentUser] = useState<{
        role: string;
        userId: string;
        email?: string | null;
        name?: string | null
        schoolName?: string | null
    } | null>()


    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user)
        }

    }, [currentUser, session])


    return (
        <header className="sm:py-3">
            <div className='h-full w-full border-b-2 sm:border-none border-gray-200' >
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 ">
                    {/* Left side - Mobile logo and menu button */}
                    <div className="flex items-center gap-x-6 lg:hidden">
                        <button
                            className="rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={onMenuClick}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <IconLogo height={24} />
                    </div>

                    {/* Center - Desktop collapse toggle */}
                    <div className="flex-1 max-w-lg mx-4 lg:mx-8">

                    </div>

                    {/* Right side - User menu and notifications */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}


                        {/* User avatar and menu */}
                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex flex-col items-end capitalize">
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