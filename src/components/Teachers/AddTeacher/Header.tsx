import { Button } from '@/components/UIKit/Button'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    isLoading: boolean
}

const AddTeacherHeader = ({ isLoading }: HeaderProps) => {
    const router = useRouter()

    return (
        <div className="w-9/12 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">Add a new teacher</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Add personal information and teaching responsibilities in one place.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button type="button" plain onClick={() => router.push('/teachers/1')}>
                    Cancel
                </Button>
                <Button type="submit" color="primary" data-disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Teacher'}
                </Button>
            </div>
        </div>
    )
}

export default AddTeacherHeader