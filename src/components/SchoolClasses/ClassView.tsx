'use client'

import { useContext, useState } from 'react'
import { Session } from 'next-auth'
import { PlusIcon, BookOpenIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { SchoolClass } from '@/app/(portal)/classes/[pageNumber]/page'
import { postFormData } from '@/lib/connector'
import EmptyState from '../EmptyState'
import ClassesStats from './ClassesStats'
import AddSchoolClassModal from './AddClassModal'
import SchoolClassesTable from '@/components/SchoolClasses/Table'
import ImportClassesModal from './ImportClassesModal'
import revalidatePage from '@/app/actions/revalidate-path'
import { FeedbackContext } from '@/context/feedback'
interface ClassesAnalytics {
    totalClasses: number;
    totalCapacity: number;
    averageClassSize: number;
}

interface ClassesViewProps {
    classes: SchoolClass[]
    session: Session | null
    totalPages: number
    analytics: ClassesAnalytics
};

const SchoolClassesView = ({ classes, totalPages, session, analytics }: ClassesViewProps) => {
    const { setFeedback } = useContext(FeedbackContext)

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isImportModal, setIsImportModal] = useState(false)

    const handleImpModalClose = () => {
        setIsImportModal(false)
    }

    const handleVerificationSuccess = () => {
        revalidatePage('/classes/1');
        setFeedback({ status: 'success', text: 'Classes added successfully!' })
    };
    //handle import classes
    const handleImportSubmit = async (file: File) => {
        if (!session?.user?.tenantId) {
            console.error('Tenant ID not found for bulk upload')
            return
        }

        try {
            const formData = new FormData()
            formData.append('tenant_id', session.user.tenantId)
            formData.append('file', file)

            await postFormData('/classes/bulk-upload', formData)
            handleVerificationSuccess()
        } catch (error) {
            console.error('Error during classes bulk upload:', error)
        }
    }
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
        <>
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
                        type='button'
                        outline
                        onClick={() => setIsImportModal(true)}
                    >
                        <ArrowUpOnSquareIcon className="h-4 w-4 mr-2 text-white" color='white' />
                        Import Classes
                    </Button>
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

        </div>
            <AddSchoolClassModal open={isAddOpen} onClose={setIsAddOpen} session={session} />
            <ImportClassesModal
                onClose={handleImpModalClose}
                onSubmit={handleImportSubmit}
                open={isImportModal}
            />
        </>

    );
};

export default SchoolClassesView;
