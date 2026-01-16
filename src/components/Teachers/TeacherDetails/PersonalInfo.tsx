import { TeacherProfile } from '../TeacherProfile'
import { formatDate } from '@/utils/formatDate'
import { getTitleFromGender } from '@/utils/titleByGender'

interface PersonalInfoProps {
    teacher: TeacherProfile
}

const PersonalInfoSection = ({ teacher }: PersonalInfoProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 lg:col-span-2">
            <div className="text-base font-semibold text-gray-900">Teacher Information</div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <dt className="text-xs text-gray-500">Full name</dt>
                    <dd className="text-sm text-gray-900">{`${getTitleFromGender(teacher.sex)} ${teacher.fullName}`.trim() || teacher.fullName}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Sex</dt>
                    <dd className="text-sm text-gray-900">{teacher.sex ? teacher.sex.charAt(0).toUpperCase() + teacher.sex.slice(1) : '-'}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center">
                        {teacher.email || '-'}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center">
                        {teacher.phone || '-'}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-start">
                        <span>{teacher.address || '-'}</span>
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Join date</dt>
                    <dd className="text-sm text-gray-900">{formatDate(teacher.joinDate || '') || '-'}</dd>
                </div>
                {teacher.createdAt && (
                    <div>
                        <dt className="text-xs text-gray-500">Record created</dt>
                        <dd className="text-sm text-gray-900">{formatDate(teacher.createdAt) || '-'}</dd>
                    </div>
                )}
            </dl>
        </div>
    )
}

export default PersonalInfoSection

