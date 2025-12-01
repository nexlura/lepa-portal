'use client'

import { AcademicCapIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import TeachersTable from './Table'
import TeachersStats from './TeachersStats'
import EmptyState from '../EmptyState'

export interface Teacher {
    id: number
    name: string
    email: string
    subjects?: string[]
    classes?: string[]
    status: string
    joinDate: string
    phone?: string
    department?: string
    sex?: string
}

interface TeachersViewProps {
    teachers: Teacher[];
    totalPages: number
};

const TeachersView = ({ teachers, totalPages }: TeachersViewProps) => {
    if (teachers?.length < 1) {
        return (
            <>
                <EmptyState
                    heading='No Teachers Found'
                    subHeading='Get started by adding teachers'
                    button={
                        <Button
                            href="/teachers/new"
                            color='primary'
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                            Add Teacher
                        </Button>
                    }
                    icon={<AcademicCapIcon className='size-12 text-gray-500' />}
                />
            </>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all teacher records and information.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        href="/teachers/new"
                        color='primary'
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <TeachersStats />

            <TeachersTable teachers={teachers} totalPages={totalPages} />
        </div>
    )
}

export default TeachersView