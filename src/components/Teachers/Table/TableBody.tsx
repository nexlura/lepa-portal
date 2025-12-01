import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

import { Teacher } from "../TeachersView"
import { formatDate } from "@/utils/formatDate"
import StatusPill from "@/components/StatusPill"
import { getTitleFromGender } from "@/utils/titleByGender"

interface TeachersTableBodyProps {
    teachers: Teacher[]
}

const TeachersTableBody = ({ teachers }: TeachersTableBodyProps) => {
    const router = useRouter()

    const handleRowClick = (teacherId: number) => {
        router.push(`/teachers/profile/${teacherId}`)
    }

    return (
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
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                            {`${getTitleFromGender(teacher.sex)}. ${teacher.name}`}
                        </div>
                    </td>
                    <td className="px-6 py-3">
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
                    <td className="px-6 py-3">
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
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{teacher.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap capitalize">
                        <StatusPill status={teacher.status} />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(teacher.joinDate)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <ChevronRightIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default TeachersTableBody