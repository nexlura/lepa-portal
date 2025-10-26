'use client'

import { useState } from 'react'
import {

    PlusIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import AddClassModal from '@/components/SchoolClasses/AddClassModal'
import ClassesTable from '@/components/SchoolClasses/Table'
import { SchoolClass } from '@/app/(portal)/classes/[pageNumber]/page'
interface ClassesViewProps {
    classes: SchoolClass[]
}

const ClassesView = ({ classes }: ClassesViewProps) => {
    // const [classes, setClasses] = useState<Klass[]>()

    const [isAddOpen, setIsAddOpen] = useState(false)

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
                    <Button outline >
                        <ArrowUpTrayIcon data-slot="icon" />
                        Import CSV
                    </Button>
                    <Button color="primary" onClick={() => setIsAddOpen(true)}>
                        <PlusIcon data-slot="icon" />
                        Add Class
                    </Button>
                </div>
            </div>
            {/* Classes table */}
            <ClassesTable classes={classes} />
            {/* Add Class Modal */}
            <AddClassModal
                open={isAddOpen}
                onClose={setIsAddOpen}
            />
        </div>
    )
}

export default ClassesView