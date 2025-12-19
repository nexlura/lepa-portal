import CustomDropdown from '@/components/UIKit/CustomDropdown'
import { Dispatch, SetStateAction } from 'react'

interface TableControlsProps {
    gradeOptions: string[]
    gradeFilter: string
    setGradeFilter: Dispatch<SetStateAction<string>>
    searchInput: React.ReactNode
}

const SchoolClassesTableControls = ({
    gradeFilter,
    gradeOptions,
    setGradeFilter,
    searchInput
}: TableControlsProps) => {
    return (
        <div className='flex justify-between items-center mb-6'>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">All Classes</h3>
            <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {searchInput}

                <div>
                    <CustomDropdown
                        label={gradeFilter}
                        options={gradeOptions}
                        updateSelected={setGradeFilter}
                    />
                </div>
            </div>
        </div>
    )
}

export default SchoolClassesTableControls