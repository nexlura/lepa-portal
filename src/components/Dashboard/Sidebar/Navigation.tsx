'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    BuildingOfficeIcon,
    UsersIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/UIKit/Tooltip';

interface NavigationItem {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: { name: string; href: string }[];
}

// Tenant admin navigation
const tenantNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Classes', href: '/classes', icon: BookOpenIcon },
    { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
    { name: 'Students', href: '/students', icon: UserGroupIcon },
];

// System admin navigation
const systemAdminNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/system-admin/dashboard', icon: HomeIcon },
    { name: 'Tenants', href: '/system-admin/tenants', icon: BuildingOfficeIcon },
    { name: 'System Users', href: '/system-admin/users', icon: UsersIcon },
    { name: 'Roles & Permissions', href: '/system-admin/roles', icon: ShieldCheckIcon },
];

const SidebarNavigation: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is system admin
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                if (session?.user?.role) {
                    setUserRole(session.user.role);
                }
            } catch (error) {
                console.warn('Error fetching session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSession();
    }, []);

    // Determine which navigation to show
    const isSystemAdmin = userRole?.toLowerCase().includes('system') || pathname.startsWith('/system-admin');
    const navigation = isSystemAdmin ? systemAdminNavigation : tenantNavigation;

    const toggleExpanded = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(name => name !== itemName)
                : [...prev, itemName]
        );
    };

    // Keep parents expanded if pathname matches any of their subitems
    useEffect(() => {
        if (isLoading) return;
        
        const activeParents = navigation
            .filter(item =>
                item.subItems?.some(subItem => pathname.startsWith(subItem.href))
            )
            .map(item => item.name);

        setExpandedItems(activeParents);
    }, [pathname, isLoading, userRole]);

    const isItemActive = (item: NavigationItem) => {
        if (item.href) {
            return pathname.startsWith(item.href);
        }
        if (item.subItems) {
            return item.subItems.some(subItem => pathname.startsWith(subItem.href));
        }
        return false;
    };

    const isSubItemActive = (href: string) => pathname === href;

    // Show loading state or empty state while checking role
    if (isLoading) {
        return (
            <nav className={`flex-1 py-6 space-y-2 px-4`}>
                <div className="text-sm text-gray-400 text-center">Loading...</div>
            </nav>
        );
    }

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
