'use client';

import { Input } from '@/components/UIKit/Input';
import { Field, Label } from '@/components/UIKit/Fieldset';
import SearchableSelect from '@/components/UIKit/SearchableSelect';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

interface TableControlsProps {
    search: string;
    setSearch: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    typeFilter: string;
    setTypeFilter: (value: string) => void;
    agencies: Agency[];
}

const TableControls = ({ 
    search, 
    setSearch, 
    statusFilter, 
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    agencies 
}: TableControlsProps) => {
    // Calculate counts for each status
    const allStatusCount = agencies.length;
    const activeCount = agencies.filter(a => a.status === 'active').length;
    const suspendedCount = agencies.filter(a => a.status === 'suspended').length;
    const inactiveCount = agencies.filter(a => a.status === 'inactive').length;

    // Get unique types
    const types = Array.from(new Set(agencies.map(a => a.type)));

    const statusOptions = [
        { value: 'All', label: 'All Status', icon: null, count: allStatusCount },
        { value: 'active', label: 'Active', icon: CheckCircleIcon, count: activeCount },
        { value: 'suspended', label: 'Suspended', icon: ExclamationTriangleIcon, count: suspendedCount },
        { value: 'inactive', label: 'Inactive', icon: XCircleIcon, count: inactiveCount },
    ];

    return (
        <div className="mb-6 space-y-4">
            {/* Search */}
            <Field>
                <Label>Search Agencies</Label>
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Field>

            {/* Status Filter */}
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
                                                : option.value === 'suspended'
                                                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-sm'
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
                                                    : option.value === 'suspended'
                                                    ? 'text-yellow-600'
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
                                                    : option.value === 'suspended'
                                                    ? 'bg-yellow-200 text-yellow-900'
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

            {/* Type Filter */}
            <Field>
                <SearchableSelect
                    label="Filter by Type"
                    value={typeFilter || null}
                    onChange={(value) => setTypeFilter(value || 'All')}
                    options={[
                        { id: 'All', name: 'All Types' },
                        ...types.map((type) => ({ id: type, name: type })),
                    ]}
                    placeholder="Search type..."
                    emptyLabel="No types found"
                />
            </Field>
        </div>
    );
};

export default TableControls;

