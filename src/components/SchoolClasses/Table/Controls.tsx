import { Dispatch, SetStateAction } from 'react'

interface TableControlsProps {
    gradeOptions: string[]
    gradeFilter: string
    setGradeFilter: Dispatch<SetStateAction<string>>
    searchInput: React.ReactElement
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

                <div className='bg-gray-100 px-2 rounded-md'>
                    <select
                        value={gradeFilter}
                        onChange={(e) => { setGradeFilter(e.target.value) }}
                        className="rounded-md border-gray-300 py-2 pr-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                        {gradeOptions.map(g => (
                            <option key={g} value={g}>{g === 'All' ? 'All grades' : g}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SchoolClassesTableControls