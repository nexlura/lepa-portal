import { BuildingOffice2Icon, CalendarIcon, UserIcon, ArrowTrendingUpIcon, BookOpenIcon } from "@heroicons/react/24/outline"

interface StudentLikeRecord {
    id: number
    name: string
    grade: string
    classSection?: string
    enrollmentDate: string
    previousSchool?: string
    transferredFromSchool?: string
    promotedFromGrade?: string | number
    currentTeacherName?: string
}

interface TopCardsProps {
    student: StudentLikeRecord
}

const TopCards = ({ student }: TopCardsProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Profile */}
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg shadow p-6 flex items-center gap-4 lg:col-span-2">
                <div className="h-20 w-20 rounded-full bg-accent-500 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Student ID: {student.id}</div>
                </div>
            </div>

            {/* Academic details */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
                <div className="text-base font-semibold text-gray-900 mb-3">Academic details</div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs">
                            <CalendarIcon className="h-4 w-4 mr-1" />Enrolled {student.enrollmentDate || '-'}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs">
                            <BookOpenIcon className="h-4 w-4 mr-1" /> {`${student.grade}${student.classSection ? ` - ${student.classSection}` : ''}`}
                        </span>
                    </div>
                    <div className="flex gap-x-2">
                        {/* {student.transferredFromSchool && (
                        <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-900 px-3 py-1 text-xs">
                            <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                            Transferred from {student.transferredFromSchool}
                        </span>
                    )} */}
                        {student.previousSchool && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs"><BuildingOffice2Icon className="h-4 w-4 mr-1" />{student.previousSchool}</span>
                        )}

                        <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-900 px-3 py-1 text-xs">
                            <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                            Transferred from School One
                        </span>
                        {student.promotedFromGrade && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 px-3 py-1 text-xs"><ArrowTrendingUpIcon className="h-4 w-4 mr-1" />Promoted from Grade {student.promotedFromGrade}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopCards