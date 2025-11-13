'use client'

import { useState } from 'react'
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button'
import AddClassModal from '@/components/SchoolClasses/AddClassModal'
import ClassesTable from '@/components/SchoolClasses/Table'
import { SchoolClass } from '@/app/(portal)/classes/[pageNumber]/page'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'
interface ClassesViewProps {
    classes: SchoolClass[];
    session: Session | null
};

const ClassesView = ({ classes, session }: ClassesViewProps) => {
    const { status } = useSession()
    const [isAddOpen, setIsAddOpen] = useState(false)

    const isLoadingUser = status === 'loading'

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
                    <Button outline>
                        <ArrowUpTrayIcon data-slot="icon" />
                        Import CSV
                    </Button>

                    <Button
                        color="primary"
                        disabled={isLoadingUser}
                        onClick={() => setIsAddOpen(true)}
                    >
                        <PlusIcon data-slot="icon" />
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Classes table */}
            <ClassesTable classes={classes} />

            {/* Only mount modal when user session is loaded */}
            {status === 'authenticated' && (
                <AddClassModal open={isAddOpen} onClose={setIsAddOpen} session={session} />
            )}
        </div>
    );
};

export default ClassesView;
