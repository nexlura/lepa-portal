import { BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { TeacherProfile } from '../TeacherProfileView'

interface TeachingResponsibilitiesProps {
    teacher: TeacherProfile
}

const TeachingResponsibilities = ({ teacher }: TeachingResponsibilitiesProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-semibold text-gray-900 mb-3">Teaching Responsibilities</div>

            <div className="space-y-4">
                {/* Subjects */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpenIcon className="h-5 w-5 text-gray-400" />
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subjects</div>
                    </div>
                    {teacher.subjects.length === 0 ? (
                        <div className="text-xs text-gray-500">No subjects assigned.</div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {teacher.subjects.map((subject) => (
                                <span
                                    key={subject}
                                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Classes */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Classes</div>
                    </div>
                    {teacher.classes.length === 0 ? (
                        <div className="text-xs text-gray-500">No classes assigned.</div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {teacher.classes.map((cls) => (
                                <span
                                    key={cls.id}
                                    className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                                >
                                    {cls.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeachingResponsibilities

