'use client'

import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button';
import EmptyState from '@/components/EmptyState';
import { Student } from '@/app/(portal)/students/[pid]/page';
import StudentsTable from '@/components/Students/StudentTable';

export interface StudentsViewProps {
    students: Student[]
    totalPages: number
}


const StudentsView = ({ students, totalPages }: StudentsViewProps) => {

    if (students.length < 1) {
        return (
            <>
                <EmptyState
                    heading='No Students Found'
                    subHeading='Get started by importing admissions data'
                    button={
                        <Button
                            href="/students/new"
                            color='primary'
                        >
                            <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                            Add Student
                        </Button>
                    }
                    icon={<ClipboardDocumentListIcon className='size-12 text-gray-500' />}
                />

            </>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all student records and information.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        href="/students/new"
                        color='primary'
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                        Add Student
                    </Button>
                </div>
            </div>

            <StudentsTable totalPages={totalPages} students={students} />
        </div>
    )
}

export default StudentsView