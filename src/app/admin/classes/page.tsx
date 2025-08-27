'use client'

import { useMemo, useState } from 'react'
import {
    BookOpenIcon,
    PlusIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import AddClassModal from '@/components/Classes/AddClassModal'
import ClassesTable from '@/components/Classes/ClassesTable'
import ImportClassesModal from '@/components/Classes/ImportClassesModal'


export type Klass = {
    id: number
    name: string
    capacity: string
    teacher?: string
    createdAt: string
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<Klass[]>([
        {
            id: 1,
            name: 'Class 1',
            teacher: '',
            capacity: '0',
            createdAt: '2024-01-12',
        },
        {
            id: 2,
            name: 'Class 2',
            teacher: 'Mr. Yolo',
            capacity: '35',
            createdAt: '2024-01-12',
        },
        {
            id: 3,
            name: 'Class 3',
            teacher: 'Ms. Mensah',
            capacity: '20',
            createdAt: '2024-01-12',
        },
    ])

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)

    const handleImportClasses = (importedClasses: {
        name: string
        capacity: string
        teacher?: string
    }[]) => {
        const newClasses: Klass[] = importedClasses.map((classData, index) => ({
            id: Math.max(...classes.map(t => t.id)) + index + 1,
            name: classData.name,
            capacity: classData.capacity,
            teacher: classData.teacher,
            createdAt: new Date().toISOString().split('T')[0]
        }))

        setClasses(prev => [...prev, ...newClasses])
        setIsImportOpen(false)
    }

    const handleAddClass = (classData: {
        name: string
        capacity: string
        teacher?: string
    }) => {
        const newClass: Klass = {
            id: Math.max(...classes.map(t => t.id)) + 1,
            name: classData.name,
            capacity: classData.capacity,
            teacher: classData.teacher,
            createdAt: new Date().toISOString().split('T')[0]
        }

        setClasses(prev => [...prev, newClass])
        setIsAddOpen(false)
    }

    const totalCapacity = useMemo(

        () => classes.reduce((sum, c) => sum + (Number(c.capacity) || 0), 0),
        [classes]
    )

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
                    <Button outline onClick={() => setIsImportOpen(true)}>
                        <ArrowUpTrayIcon data-slot="icon" />
                        Import CSV
                    </Button>
                    <Button color="primary" onClick={() => setIsAddOpen(true)}>
                        <PlusIcon data-slot="icon" />
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpenIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Classes
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">{classes.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpenIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Capacity
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">{totalCapacity}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Classes table */}
            <ClassesTable classes={classes} />
            {/* Add Class Modal */}
            <AddClassModal
                open={isAddOpen}
                onClose={setIsAddOpen}
                onSubmit={handleAddClass}
            />

            {/* CSV Import Modal */}
            <ImportClassesModal
                onClose={setIsImportOpen}
                onSubmit={handleImportClasses}
                open={isImportOpen}
            />
        </div>
    )
}



