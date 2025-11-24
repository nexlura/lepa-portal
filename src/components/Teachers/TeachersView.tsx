'use client'

import { useState } from 'react'
import { AcademicCapIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

import AddTeacherModal from '@/components/Teachers/AddTeacherModal'
import { Button } from '@/components/UIKit/Button'
import { Session } from 'next-auth'
import TeachersTable from './Table'
import TeachersStats from './TeachersStats'
import EmptyState from '../EmptyState'

export interface Teacher {
    id: number
    name: string
    email: string
    subject: string
    status: string
    joinDate: string
    phone?: string
    department?: string
}

interface TeachersViewProps {
    teachers: Teacher[];
};

const TeachersView = ({ teachers }: TeachersViewProps) => {
    const [showAddModal, setShowAddModal] = useState(false)

    if (teachers?.length < 1) {
        return (
            <>
                <EmptyState
                    heading='No Teachers Found'
                    subHeading='Get started by adding teachers'
                    button={
                        <Button
                            onClick={() => setShowAddModal(true)}
                            color='primary'
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                            Add Teacher
                        </Button>
                    }
                    icon={<AcademicCapIcon className='size-12 text-gray-500' />}
                />
                {/* Modals */}
                <AddTeacherModal
                    open={showAddModal}
                    onClose={setShowAddModal}
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
                        outline
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        color='primary'
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <TeachersStats />

            <TeachersTable teachers={teachers} />

            {/* Modals */}
            <AddTeacherModal
                open={showAddModal}
                onClose={setShowAddModal}
            />
        </div>
    )
}

export default TeachersView