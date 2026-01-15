import { CalendarIcon, UserIcon, BookOpenIcon } from "@heroicons/react/24/outline"

import { Student } from "@/app/(portal)/students/[pid]/page"
import StatusPill from "@/components/StatusPill"
import { formatDate } from "@/utils/formatDate"

interface TopCardsProps {
    student: Student
}

const TopCards = ({ student }: TopCardsProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Profile */}
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg shadow p-6 flex items-center gap-4 lg:col-span-2">
                <div className="h-20 w-20 rounded-full bg-accent-500 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1 capitalize">
                    <div className="text-lg font-semibold text-gray-900">
                        {student.fullName}
                    </div>
                    <div className="text-sm text-gray-500"> {student.currentClassName}</div>
                </div>
            </div>

            {/* Academic details */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
                <div className="text-base font-semibold text-gray-900 mb-3">Academic details</div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-2">
                        <StatusPill status={student.status} label="enrolled" />
                    </div>
                    <div className="flex gap-x-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs">
                            <CalendarIcon className="h-4 w-4 mr-1" />Enrolled: {formatDate(student.enrollmentDate)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs capitalize">
                            <BookOpenIcon className="h-4 w-4 mr-1" />
                            {`${student.currentClassName}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopCards