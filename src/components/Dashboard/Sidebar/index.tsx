import React from 'react';

import SidebarNavigation from './Navigation';
import SettingsNavigation from './SettingsNavigation';
import LogoutButton from '@/components/LogoutButton';
import { IconLogo } from '@/components/Logo';

interface SidebarProps {
    collapsed?: boolean;
    onDesktopToggleSidebar?: () => void
}
export interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

const Sidebar = ({ collapsed, onDesktopToggleSidebar }: SidebarProps) => {

    const SidebarNav = SidebarNavigation as unknown as React.FC<{ collapsed?: boolean }>;

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed sm:rounded-lg inset-y-0 left-0 sm:my-4 bg-white lg:ml-4 ${collapsed ? 'w-16' : 'w-64'} transform  transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 -translate-x-full`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className={`flex  h-16 items-center ${collapsed ? 'justify-center' : 'justify-between '} px-4 border-gray-200 `}>
                        {/* Logo */}
                        <IconLogo height={28} />

                        {!collapsed && (
                            <button
                                onClick={onDesktopToggleSidebar}
                                className="text-gray-500 hover:bg-primary-50 hover:text-gray-900 transition-all duration-300 p-2 rounded-md cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 22 22">
                                    <path
                                        fill="currentColor"
                                        d="M9.367 2.25h5.266c1.092 0 1.958 0 2.655.057c.714.058 1.317.18 1.869.46a4.75 4.75 0 0 1 2.075 2.077c.281.55.403 1.154.461 1.868c.057.697.057 1.563.057 2.655v5.266c0 1.092 0 1.958-.057 2.655c-.058.714-.18 1.317-.46 1.869a4.75 4.75 0 0 1-2.076 2.075c-.552.281-1.155.403-1.869.461c-.697.057-1.563.057-2.655.057H9.367c-1.092 0-1.958 0-2.655-.057c-.714-.058-1.317-.18-1.868-.46a4.75 4.75 0 0 1-2.076-2.076c-.281-.552-.403-1.155-.461-1.869c-.057-.697-.057-1.563-.057-2.655V9.367c0-1.092 0-1.958.057-2.655c.058-.714.18-1.317.46-1.868a4.75 4.75 0 0 1 2.077-2.076c.55-.281 1.154-.403 1.868-.461c.697-.057 1.563-.057 2.655-.057M6.834 3.802c-.62.05-1.005.147-1.31.302a3.25 3.25 0 0 0-1.42 1.42c-.155.305-.251.69-.302 1.31c-.051.63-.052 1.434-.052 2.566v5.2c0 1.133 0 1.937.052 2.566c.05.62.147 1.005.302 1.31a3.25 3.25 0 0 0 1.42 1.42c.305.155.69.251 1.31.302c.392.032.851.044 1.416.05V3.752c-.565.005-1.024.017-1.416.049"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                    {collapsed && (
                        <div className='flex justify-center items-center px-4 '>
                            <button
                                onClick={onDesktopToggleSidebar}
                                className='flex justify-center py-2 text-gray-600 w-full hover:bg-primary-50 hover:text-gray-900 transition-all duration-300 rounded-md cursor-pointer'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 22 22"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3.5v17M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"></path></svg>
                            </button>
                        </div>
                    )}
                    {/* Navigation */}
                    <SidebarNav collapsed={collapsed} />
                    <div className=" border-gray-200 p-4">
                        <SettingsNavigation collapsed={collapsed} />
                        <LogoutButton collapsed={collapsed} />
                    </div>
                </div>
            </div >
        </>
    );
}

export default Sidebar