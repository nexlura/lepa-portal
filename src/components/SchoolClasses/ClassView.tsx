'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import { PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { SchoolClass } from '@/app/(portal)/classes/[pageNumber]/page'
import EmptyState from '../EmptyState'
import ClassesStats from './ClassesStats'
import AddSchoolClassModal from './AddClassModal'
import SchoolClassesTable from '@/components/SchoolClasses/Table'
interface ClassesAnalytics {
    totalClasses: number;
    totalCapacity: number;
    totalStudents: number;
    averageClassSize: number;
    classesAtFullCapacity: number;
    averageUtilizationRate: number;
}

interface ClassesViewProps {
    classes: SchoolClass[]
    session: Session | null
    totalPages: number
    analytics: ClassesAnalytics
};

const SchoolClassesView = ({ classes, totalPages, session, analytics }: ClassesViewProps) => {
    const [isAddOpen, setIsAddOpen] = useState(false)
    //show empty-state component when we have zero items
    if (classes.length < 1) {
        return (
            <>
                <EmptyState
                    heading='No Classes Found'
                    subHeading='Get started by adding Classes'
                    button={
                        <Button
                            onClick={() => setIsAddOpen(true)}
                            color='primary'
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                            Add Class
                        </Button>
                    }
                    icon={<BookOpenIcon className='size-12 text-gray-500' />}
                />
                {/* Modals */}
                <AddSchoolClassModal
                    open={isAddOpen}
                    onClose={setIsAddOpen}
                    session={session}
                />
            </>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all classes, add new ones, or import in bulk via CSV.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        color="primary"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <PlusIcon data-slot="icon" />
                        Add Class
                    </Button>
                </div>
            </div>
            <ClassesStats analytics={analytics} />

            {/* Classes table */}
            <SchoolClassesTable classes={classes} totalPages={totalPages} />

            <AddSchoolClassModal open={isAddOpen} onClose={setIsAddOpen} session={session} />
        </div>
    );
};

export default SchoolClassesView;
