import { AcademicCapIcon, CalendarIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { TeacherProfile } from '../TeacherProfileView'
import { formatDate } from '@/utils/formatDate'
import StatusPill from '@/components/StatusPill'

interface TopCardsProps {
    teacher: TeacherProfile
}

const TopCards = ({ teacher }: TopCardsProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Profile */}
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg shadow p-6 flex items-center gap-4 lg:col-span-2">
                <div className="h-20 w-20 rounded-full bg-accent-500 flex items-center justify-center">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                    <div className="capitalize text-lg font-semibold text-gray-900">
                        {teacher.fullName}
                    </div>
                    <div className="text-sm text-gray-500">Teacher ID: 001</div>
                </div>
            </div>

            {/* Teaching details */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
                <div className="text-base font-semibold text-gray-900 mb-3">Teaching details</div>
                <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-900 px-3 py-1 text-xs">
                            <CalendarIcon className="h-4 w-4 mr-1" />Joined {formatDate(teacher.joinDate || '') || '-'}
                        </span>
                        {teacher.subjects.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs">
                                <BookOpenIcon className="h-4 w-4 mr-1" /> {teacher.subjects.length} {teacher.subjects.length === 1 ? 'Subject' : 'Subjects'}
                            </span>
                        )}
                        {teacher.classes.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-900 px-3 py-1 text-xs">
                                <UserGroupIcon className="h-4 w-4 mr-1" /> {teacher.classes.length} {teacher.classes.length === 1 ? 'Class' : 'Classes'}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-x-2">
                        <StatusPill status={teacher.status || ''} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopCards

