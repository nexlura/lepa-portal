import { BuildingOffice2Icon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline"

import { StudentRecord } from "@/app/dashboard/admissions/page"

interface TopCardsProps {
    student: StudentRecord
}

const TopCards = ({ student }: TopCardsProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Profile */}
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 lg:col-span-2">
                <div className="h-20 w-20 rounded-full bg-green-200 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-green-700" />
                </div>
                <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Student ID: {student.id}</div>
                </div>
            </div>

            {/* Academic details */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
                <div className="text-base font-semibold text-gray-900 mb-3">Academic details</div>
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs">{`Grade ${student.grade}${student.classSection ? ` - ${student.classSection}` : ''}`}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs"><CalendarIcon className="h-4 w-4 mr-1" />Enrolled {student.enrollmentDate || '-'}</span>
                    {student.previousSchool && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs"><BuildingOffice2Icon className="h-4 w-4 mr-1" />{student.previousSchool}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TopCards