'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/UIKit/Tooltip';
interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
        name: 'Admissions',
        icon: ClipboardDocumentListIcon,
        subItems: [
            { name: 'Admission Form', href: '/admissions/new' },
            { name: 'Applicants', href: '/admissions' },
        ],
    },
    { name: 'Classes', href: '/classes', icon: BookOpenIcon },
    { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
    { name: 'Students', href: '/students', icon: UserGroupIcon },
];

const SidebarNavigation: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpanded = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(name => name !== itemName)
                : [...prev, itemName]
        );
    };

    // Keep parents expanded if pathname matches any of their subitems
    useEffect(() => {
        const activeParents = navigation
            .filter(item =>
                item.subItems?.some(subItem => pathname.startsWith(subItem.href))
            )
            .map(item => item.name);

        setExpandedItems(activeParents);
    }, [pathname]);

    const isItemActive = (item: NavigationItem) => {
        if (item.href) {
            return pathname === item.href;
        }
        if (item.subItems) {
            return item.subItems.some(subItem => pathname.startsWith(subItem.href));
        }
        return false;
    };

    const isSubItemActive = (href: string) => pathname.startsWith(href);

    return (
        <nav className={`flex-1 py-6 space-y-2 px-4`}>
            {navigation.map(item => {
                const isActive = isItemActive(item);
                const isExpanded = expandedItems.includes(item.name);

                if (item.subItems) {
                    const buttonContent = (
                        <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`group flex w-full text-gray-500 items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                ? 'bg-primary-100 text-gray-900'
                                : 'hover:bg-primary-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon
                                className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                            />
                            {!collapsed && item.name}
                            {!collapsed && (isExpanded ? (
                                <ChevronDownIcon className="ml-auto h-4 w-4 font-bold" />
                            ) : (
                                <ChevronRightIcon className="ml-auto h-4 w-4 font-bold" />
                            ))}
                        </button>
                    );

                    return (
                        <div key={item.name}>
                            {collapsed ? (
                                <Tooltip content={item.name} position="right">
                                    {buttonContent}
                                </Tooltip>
                            ) : (
                                buttonContent
                            )}

                            {!collapsed && isExpanded && (
                                <div className="ml-5 mt-2 ">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.href}
                                            className={`relative border-l-2 border-gray-200 group flex text-gray-500 items-center pl-4 py-1 text-[0.84rem] font-medium transition-colors
                                                    ${isSubItemActive(subItem.href)
                                                    ? 'text-gray-900 border-primary-300'
                                                    : 'hover:bg-primary-50 hover:text-gray-900 '
                                                }`}
                                        >
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                const linkContent = (
                    <Link
                        key={item.name}
                        href={item.href!}
                        className={`group flex text-gray-500 items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md transition-colors ${isActive
                            ? 'bg-primary-100 text-gray-900'
                            : 'hover:bg-primary-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon
                            className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                        />
                        {!collapsed && item.name}
                    </Link>
                );

                return (
                    <div key={item.name}>
                        {collapsed ? (
                            <Tooltip content={item.name} position="right">
                                {linkContent}
                            </Tooltip>
                        ) : (
                            linkContent
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default SidebarNavigation;
