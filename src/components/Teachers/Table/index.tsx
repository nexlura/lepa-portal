'use client'

import { useRouter } from "next/navigation"

import { getTitleFromGender } from "@/utils/titleByGender"
import { Teacher } from "../TeachersView"
import { formatDate } from "@/utils/formatDate"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import StatusPill from "@/components/StatusPill"

interface TeachersTableProps {
    teachers: Teacher[]
}

const TeachersTable = ({ teachers }: TeachersTableProps) => {
    const router = useRouter()

    const handleRowClick = (teacherId: number) => {
        router.push(`/teachers/profile/${teacherId}`)
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    All Teachers
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subjects
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Classes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.map((teacher) => (
                                <tr
                                    key={teacher.id}
                                    className="hover:bg-gray-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                    tabIndex={0}
                                    role="button"
                                    onClick={() => handleRowClick(teacher.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            handleRowClick(teacher.id)
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 capitalize">
                                            {`${getTitleFromGender(teacher.sex)}. ${teacher.name}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {teacher.subjects.map((subject, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800"
                                                        >
                                                            {subject}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {teacher.classes && teacher.classes.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {teacher.classes.map((className, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800"
                                                        >
                                                            {className}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{teacher.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        <StatusPill status={teacher.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(teacher.joinDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ChevronRightIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TeachersTable