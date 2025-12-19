import { Dispatch, SetStateAction } from "react"
import CustomDropdown from "@/components/UIKit/CustomDropdown"
interface TableControlsProps {
    searchInput: React.ReactNode
    genderOptions: string[]
    genderFilter: string
    setGenderFilter: Dispatch<SetStateAction<string>>
}

const StudentTableControls = ({
    searchInput,
    genderFilter,
    genderOptions,
    setGenderFilter
}: TableControlsProps) => {
    return (
        <div className='flex justify-between items-center mb-6'>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                All Students
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* SEARCH INPUT */}
                {searchInput}

                {/* GENDER FILTER */}
                <div >
                    <CustomDropdown
                        label={genderFilter}
                        options={genderOptions}
                        updateSelected={setGenderFilter}
                    />
                </div>
            </div>
        </div>
    )
}

export default StudentTableControls
