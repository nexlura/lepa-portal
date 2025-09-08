'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    Cog6ToothIcon,
    XMarkIcon,
    ArrowRightEndOnRectangleIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    {
        name: 'Admissions',
        icon: ClipboardDocumentListIcon,
        subItems: [
            { name: 'Admission Form', href: '/admin/admissions/new' },
            { name: 'Applicants', href: '/admin/admissions' },
        ]
    },
    { name: 'Classes', href: '/admin/classes', icon: BookOpenIcon },
    { name: 'Teachers', href: '/admin/teachers', icon: AcademicCapIcon },
    { name: 'Students', href: '/admin/students', icon: UserGroupIcon },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpanded = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(name => name !== itemName)
                : [...prev, itemName]
        );
    };

    const isItemActive = (item: NavigationItem) => {
        if (item.href) {
            return pathname === item.href;
        }
        if (item.subItems) {
            return item.subItems.some(subItem => pathname === subItem.href);
        }
        return false;
    };

    const isSubItemActive = (href: string) => {
        return pathname === href;
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onToggle}
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
                            onClick={onToggle}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = isItemActive(item);
                            const isExpanded = expandedItems.includes(item.name);

                            if (item.subItems) {
                                return (
                                    <div key={item.name}>
                                        <button
                                            onClick={() => toggleExpanded(item.name)}
                                            className={`group flex w-full text-gray-500 items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                ? 'bg-primary-200 text-gray-900'
                                                : 'hover:bg-primary-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <item.icon
                                                className={`mr-3 h-5 w-5 flex-shrink-0 text-accent-900 ${isActive ? '' : ' group-hover:text-gray-500'
                                                    }`}
                                            />
                                            {item.name}
                                            {isExpanded ? (
                                                <ChevronDownIcon className="ml-auto h-4 w-4" />
                                            ) : (
                                                <ChevronRightIcon className="ml-auto h-4 w-4" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="ml-5 mt-1 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className={`relative group flex text-gray-500 items-center px-3 py-1 text-[0.84rem] font-medium rounded-md transition-colors ${isSubItemActive(subItem.href)
                                                            ? 'text-gray-900'
                                                            : 'hover:bg-primary-50 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full bg-gray-300 mr-3 ${isSubItemActive(subItem.href)
                                                            ? 'bg-primary-500'
                                                            : 'hover:bg-primary-50 hover:text-gray-900'
                                                            } `}></span>
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href!}
                                    className={`group flex text-gray-500 items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-primary-200 text-gray-900'
                                        : 'hover:bg-primary-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 text-gray-500 ${isActive ? 'text-gray-900' : ' group-hover:text-gray-500'
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className=" border-gray-200 p-4">
                        <Link
                            href={'/admin/settings'}
                            className={`group flex text-gray-500 items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${'/admin/settings' === pathname
                                ? 'bg-primary-200 text-gray-900'
                                : 'hover:bg-primary-50 hover:text-gray-900'
                                }`}
                        >
                            <Cog6ToothIcon
                                className={`mr-3 h-5 w-5 flex-shrink-0 text-accent-900 ${'settings' === pathname ? '' : ' group-hover:text-gray-500'
                                    }`}
                            />
                            Settings
                        </Link>
                        <button
                            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-accent-900 rounded-md hover:bg-primary-50 hover:text-gray-900 transition-colors"
                        >
                            <ArrowRightEndOnRectangleIcon className="mr-3 h-5 w-5 text-accent-900 group-hover:text-gray-500" />
                            Logout
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
} 