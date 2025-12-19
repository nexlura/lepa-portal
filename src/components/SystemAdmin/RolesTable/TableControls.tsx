'use client';

import { Input } from '@/components/UIKit/Input';
import { Field, Label } from '@/components/UIKit/Fieldset';

interface TableControlsProps {
    search: string;
    setSearch: (value: string) => void;
}

const TableControls = ({ search, setSearch }: TableControlsProps) => {
    return (
        <div className="mb-4">
            <Field>
                <Label>Search Roles</Label>
                <Input
                    type="text"
                    placeholder="Search by name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Field>
        </div>
    );
};

export default TableControls;

