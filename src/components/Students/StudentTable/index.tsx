'use client'

import { useState } from 'react'

import StudentTableControls from './TableControls'
import { StudentsViewProps } from '../StudentsView'
import StudentsTableBody from './TableBody'
import TableFoot from '@/components/TableFoot'
import StudentsTableHead from './TableHead'

const StudentsTable = ({ students, totalPages }: StudentsViewProps) => {

    const [search, setSearch] = useState('')
    const [gradeFilter, setGradeFilter] = useState<string>('All')

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                <StudentTableControls
                    search={search}
                    setSearch={setSearch}
                    gradeFilter={gradeFilter}
                    gradeOptions={['class 1']}
                    setGradeFilter={setGradeFilter}
                />
                <div className="overflow-x-auto">
                    {/* Individual admission moved to dedicated page */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <StudentsTableHead />
                        <StudentsTableBody students={students} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>


    )
}

export default StudentsTable