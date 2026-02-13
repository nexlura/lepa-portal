import { SetStateAction } from 'react'
import { PlusIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'

interface ClassesMainHeaderProps {
    setIsAddOpen: (value: SetStateAction<boolean>) => void
    setIsImportModal: (value: SetStateAction<boolean>) => void
}

const ClassesMainHeader = ({ setIsAddOpen, setIsImportModal }: ClassesMainHeaderProps) => {
    return (
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
    )
}

export default ClassesMainHeader