import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import SidebarNavigation from './Navigation';
import SettingsNavigation from './SettingsNavigation';
import LogoutButton from '@/components/LogoutButton';
import { WordmarkLogo } from '@/components/Logo';

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

export default function Sidebar({ isOpen, onClose }: SidebarProps) {

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onClose}
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
                        <div className="flex items-center gap-2">
                            <WordmarkLogo height={28} />
                            <span className="text-xl font-semibold text-primary-600 hidden sm:inline">Lepa</span>
                        </div>
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