'use client';

import { Input } from '@/components/UIKit/Input';
import { Field, Label } from '@/components/UIKit/Fieldset';

interface TableControlsProps {
    search: string;
    setSearch: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
}

const TableControls = ({ search, setSearch, statusFilter, setStatusFilter }: TableControlsProps) => {
    return (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
                <Label>Search Tenants</Label>
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Field>
            <Field>
                <Label>Status</Label>
                <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </Field>
        </div>
    );
};

export default TableControls;

