'use client'

import { Button } from '@/components/UIKit/Button'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    isLoading: boolean
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>
}

const AddStudentHeader = ({ isLoading, handleSubmit }: HeaderProps) => {
    const router = useRouter()

    return (
        <div className="lg:w-10/12 xl:w-9/12 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">Add a new student</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Capture personal information and academic placement in one streamlined workflow.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button type="button" plain onClick={() => router.push('/students/1')}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Student'}
                </Button>
            </div>
        </div>
    )
}

export default AddStudentHeader

