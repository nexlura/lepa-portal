'use client'

import { useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

import StudentTableControls from './TableControls'
import { StudentsViewProps } from '../StudentsView'
import { formatDate } from '@/utils/formatDate'
import StatusPill from '@/components/StatusPill'

const StudentsTable = ({ students }: StudentsViewProps) => {
    const router = useRouter()

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
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    DOB
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/students/profile/${s.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        <div className="text-sm font-medium text-gray-900">
                                            {`${s.firstName} ${s.lastName}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{formatDate(s.dateOfBirth)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        <div className="text-sm text-gray-500">{s.sex}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{s.currentClassName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusPill status={s.status} label='enrolled' />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    )
}

export default StudentsTable