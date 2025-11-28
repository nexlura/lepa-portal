import { Student } from "@/app/(portal)/students/[pid]/page"
import { formatPhoneNumber } from "@/utils"
import { formatDate } from "@/utils/formatDate"

interface PersonalInfoProps {
    student: Student
}

const PersonalInfoSection = ({ student }: PersonalInfoProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 lg:col-span-2">
            <div className="text-base font-semibold text-gray-900">Student Information</div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 capitalize">
                <div>
                    <dt className="text-xs text-gray-500">Full name</dt>
                    <dd className="text-sm text-gray-900 ">{student.fullName}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Gender</dt>
                    <dd className="text-sm text-gray-900">{student.sex}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Date of birth</dt>
                    <dd className="text-sm text-gray-900">{formatDate(student.dateOfBirth)}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center lowercase">
                        student@springfield.edu
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center">
                        {formatPhoneNumber(23230967676)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-start">
                        <span>{student.address || ''}</span>
                    </dd>
                </div>
            </dl>

            <div className="pt-4">
                <div className="text-base font-semibold text-gray-900">Guardian Information</div>
                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt className="text-xs text-gray-500">Name</dt>
                        <dd className="text-sm text-gray-900">-</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Relationship</dt>
                        <dd className="text-sm text-gray-900">-</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900">-</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Phone</dt>
                        <dd className="text-sm text-gray-900">-</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default PersonalInfoSection