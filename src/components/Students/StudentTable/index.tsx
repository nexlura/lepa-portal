'use client'

import { useState } from 'react'

import StudentTableControls from './TableControls'
import { Student } from '@/app/(portal)/students/[pid]/page'
import StudentsTableBody from './TableBody'
import TableFoot from '@/components/TableFoot'
import StudentsTableHead from './TableHead'

interface StudentsTableProps {
    students: Student[];
    totalPages: number;
}

const StudentsTable = ({ students, totalPages }: StudentsTableProps) => {

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