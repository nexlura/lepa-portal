import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

import LogoutButton from '@/components/LogoutButton';
import SettingsNavigation from './Sidebar/SettingsNavigation';
import SidebarNavigation from './Sidebar/Navigation';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}
export interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

const MobileMenu = ({ isOpen, onClose }: SidebarProps) => {

    // const SidebarNav = SidebarNavigation as unknown as React.FC<{ collapsed?: boolean }>;

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed z-40 sm:rounded-lg inset-y-0 left-0 right:0 sm:my-4 bg-white w-full transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className={`flex h-16 items-center justify-end px-4 border-gray-200`}>
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <SidebarNavigation />
                    <div className=" border-gray-200 p-4">
                        <SettingsNavigation />
                        <LogoutButton />
                    </div>
                </div>
            </div >
        </>
    );
}

export default MobileMenu