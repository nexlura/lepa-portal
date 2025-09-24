import { StudentRecord } from "@/app/dashboard/admissions/page"

interface PersonalInfoProps {
    student: StudentRecord
}

const PersonalInfoSection = ({ student }: PersonalInfoProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 lg:col-span-2">
            <div className="text-base font-semibold text-gray-900">Student Information</div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <dt className="text-xs text-gray-500">Full name</dt>
                    <dd className="text-sm text-gray-900">{student.name}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Gender</dt>
                    <dd className="text-sm text-gray-900">{student.gender || '-'}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Date of birth</dt>
                    <dd className="text-sm text-gray-900">{student.dateOfBirth || '-'}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center">
                        {student.email || '-'}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-center">
                        {student.phone || '-'}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900 inline-flex items-start">
                        <span>{student.address || '-'}{student.city ? `, ${student.city}` : ''}{student.state ? `, ${student.state}` : ''}{student.postalCode ? `, ${student.postalCode}` : ''}</span>
                    </dd>
                </div>
            </dl>

            <div className="pt-4">
                <div className="text-base font-semibold text-gray-900">Guardian Information</div>
                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt className="text-xs text-gray-500">Name</dt>
                        <dd className="text-sm text-gray-900">{student.guardianName || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Relationship</dt>
                        <dd className="text-sm text-gray-900">{student.guardianRelationship || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900">{student.guardianEmail || '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-500">Phone</dt>
                        <dd className="text-sm text-gray-900">{student.guardianPhone || '-'}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default PersonalInfoSection