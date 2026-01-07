import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

import { formatDate } from "@/utils/formatDate"
import StatusPill from "@/components/StatusPill"
import { Student } from "@/app/(portal)/students/[pid]/page"

interface StudentsTableBodyProps {
    students: Student[]
}

const StudentsTableBody = ({ students }: StudentsTableBodyProps) => {
    const router = useRouter()

    const handleRowClick = (studentId: string) => {
        router.push(`/students/profile/${studentId}`)
    }

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
                <tr
                    key={s.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(s.id)}
                >
                    <td className="px-6 py-3 whitespace-nowrap capitalize">
                        <div className="text-sm font-medium text-gray-900">
                            {`${s.firstName} ${s.lastName}`}
                        </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(s.dateOfBirth)}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap capitalize">
                        <div className="text-sm text-gray-500">{s.sex}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="capitalize text-sm text-gray-900">{s.currentClassName}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <StatusPill status={s.status} label='enrolled' />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
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
    )
}

export default StudentsTableBody