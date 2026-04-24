'use client';

import { Input } from '@/components/UIKit/Input';
import { Field, Label } from '@/components/UIKit/Fieldset';
import { CheckCircleIcon, XCircleIcon, ShieldCheckIcon, UserGroupIcon, AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';

interface TableControlsProps {
    search: string;
    setSearch: (value: string) => void;
    userTypeFilter: string;
    setUserTypeFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    userTypes: string[];
    users: SystemUser[];
}

const TableControls = ({ 
    search, 
    setSearch, 
    userTypeFilter, 
    setUserTypeFilter,
    statusFilter,
    setStatusFilter,
    userTypes,
    users
}: TableControlsProps) => {
    // Calculate counts for each status
    const allStatusCount = users.length;
    const activeCount = users.filter(u => u.status === 'active').length;
    const inactiveCount = users.filter(u => u.status === 'inactive').length;

    // Calculate counts for each user type
    const allUserTypeCount = users.length;
    const userTypeCounts = userTypes.reduce((acc, userType) => {
        acc[userType] = users.filter(u => u.userType === userType).length;
        return acc;
    }, {} as Record<string, number>);

    // Get user type icons
    const getUserTypeIcon = (userType: string) => {
        if (!userType) return null;
        const userTypeLower = userType.toLowerCase();
        if (userTypeLower.includes('system')) return ShieldCheckIcon;
        if (userTypeLower.includes('tenant')) return BuildingOfficeIcon;
        if (userTypeLower.includes('agency')) return UserGroupIcon;
        return null;
    };

    const statusOptions = [
        { value: 'All', label: 'All Status', icon: null, count: allStatusCount },
        { value: 'active', label: 'Active', icon: CheckCircleIcon, count: activeCount },
        { value: 'inactive', label: 'Inactive', icon: XCircleIcon, count: inactiveCount },
    ];

    return (
        <div className="mb-6 space-y-4">
            {/* Search */}
            <Field>
                <Label>Search Users</Label>
                <Input
                    type="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                    name="search-users-field"
                    id="search-users-field"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                />
            </Field>

            {/* Status Filter - Modern Button Group */}
            <Field>
                <Label>Filter by Status</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                    {statusOptions.map((option) => {
                        const Icon = option.icon;
                        const isActive = statusFilter === option.value;
                        
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${
                                        isActive
                                            ? option.value === 'active'
                                                ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-sm'
                                                : option.value === 'inactive'
                                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-300 shadow-sm'
                                                : 'bg-primary-100 text-primary-800 border-2 border-primary-300 shadow-sm'
                                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {Icon && (
                                    <Icon
                                        className={`h-4 w-4 ${
                                            isActive
                                                ? option.value === 'active'
                                                    ? 'text-green-600'
                                                    : 'text-gray-600'
                                                : 'text-gray-400'
                                        }`}
                                    />
                                )}
                                <span>{option.label}</span>
                                <span
                                    className={`
                                        ml-1 px-2 py-0.5 text-xs font-semibold rounded-full
                                        ${
                                            isActive
                                                ? option.value === 'active'
                                                    ? 'bg-green-200 text-green-900'
                                                    : option.value === 'inactive'
                                                    ? 'bg-gray-200 text-gray-900'
                                                    : 'bg-primary-200 text-primary-900'
                                                : 'bg-gray-100 text-gray-600'
                                        }
                                    `}
                                >
                                    {option.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Field>

            {/* User Type Filter - Modern Button Group */}
            <Field>
                <Label>Filter by User Type</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                    <button
                        type="button"
                        onClick={() => setUserTypeFilter('All')}
                        className={`
                            inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                            transition-all duration-200
                            ${
                                userTypeFilter === 'All'
                                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-300 shadow-sm'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <span>All User Types</span>
                        <span
                            className={`
                                ml-1 px-2 py-0.5 text-xs font-semibold rounded-full
                                ${
                                    userTypeFilter === 'All'
                                        ? 'bg-primary-200 text-primary-900'
                                        : 'bg-gray-100 text-gray-600'
                                }
                            `}
                        >
                            {allUserTypeCount}
                        </span>
                    </button>
                    {userTypes.map((userType) => {
                        const Icon = getUserTypeIcon(userType);
                        const isActive = userTypeFilter === userType;
                        const count = userTypeCounts[userType] || 0;
                        
                        return (
                            <button
                                key={userType}
                                type="button"
                                onClick={() => setUserTypeFilter(userType)}
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {Icon && (
                                    <Icon
                                        className={`h-4 w-4 ${
                                            isActive ? 'text-blue-600' : 'text-gray-400'
                                        }`}
                                    />
                                )}
                                <span className="max-w-[150px] truncate" title={userType}>{userType}</span>
                                <span
                                    className={`
                                        ml-1 px-2 py-0.5 text-xs font-semibold rounded-full
                                        ${
                                            isActive
                                                ? 'bg-blue-200 text-blue-900'
                                                : 'bg-gray-100 text-gray-600'
                                        }
                                    `}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Field>
        </div>
    );
};

export default TableControls;

