import { Dispatch, SetStateAction } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TableControlsProps {
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    gradeOptions: string[]
    gradeFilter: string
    setGradeFilter: Dispatch<SetStateAction<string>>
}

const StudentTableControls = ({
    search,
    setSearch,
    gradeFilter,
    gradeOptions,
    setGradeFilter
}: TableControlsProps) => {
    return (
        <div className='flex justify-between items-center mb-6'>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">All Students</h3>
            <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative bg-gray-100 w-full sm:w-72 rounded-md">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }}
                            placeholder="Search by class name"
                            className="w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>
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

export default StudentTableControls