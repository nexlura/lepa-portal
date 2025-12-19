'use client';

import { useState } from 'react';
import { PlusIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Button } from '@/components/UIKit/Button';
import AgenciesTable from './AgenciesTable';
import AgenciesStats from './AgenciesStats';
import AgencyModal from './AgencyModal';
import EmptyState from '../EmptyState';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

interface AgenciesViewProps {
    agencies: Agency[];
    totalPages: number;
}

const AgenciesView = ({ agencies, totalPages }: AgenciesViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

    const handleAdd = () => {
        setSelectedAgency(null);
        setIsModalOpen(true);
    };

    const handleEdit = (agency: Agency) => {
        setSelectedAgency(agency);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAgency(null);
    };

    if (agencies?.length < 1) {
        return (
            <>
                <EmptyState
                    heading="No Agencies Found"
                    subHeading="Get started by adding a new government agency"
                    button={
                        <Button
                            onClick={handleAdd}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add Agency
                        </Button>
                    }
                    icon={<BuildingOffice2Icon className="size-12 text-gray-500" />}
                />
                <AgencyModal open={isModalOpen} onClose={handleCloseModal} agency={selectedAgency} />
            </>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Government Agencies</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage government agencies that oversee schools and enforce compliance.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            onClick={handleAdd}
                            color="primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color="white" />
                            Add Agency
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <AgenciesStats agencies={agencies} />

                {/* Agencies table */}
                <AgenciesTable agencies={agencies} totalPages={totalPages} onEdit={handleEdit} />
            </div>
            <AgencyModal open={isModalOpen} onClose={handleCloseModal} agency={selectedAgency} />
        </>
    );
};

export default AgenciesView;

