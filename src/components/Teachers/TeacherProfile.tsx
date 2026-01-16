'use client'

import Breadcrumbs from './TeacherDetails/BreadCrumbs'
import TopCards from './TeacherDetails/TopCards'
import PersonalInfoSection from './TeacherDetails/PersonalInfo'
import DocumentsList, { Doc } from '../DocumentsList'

export type TeacherProfile = {
    id: number
    fullName: string
    email: string
    phone?: string
    address?: string
    sex?: string
    status?: string
    joinDate?: string
    subjects: string[]
    classes: Array<{ id: string; label: string }>
    createdAt?: string
    updatedAt?: string
}

interface TeacherProfileViewProps {
    teacher: TeacherProfile
    attachments?: Doc[]

}

const TeacherProfileView = ({ teacher, attachments = [] }: TeacherProfileViewProps) => {
    return (
        <div className="space-y-6">
            <div className="w-full flex justify-between items-center">
                {/* Breadcrumbs */}
                <Breadcrumbs teacher={teacher} />

                {/* <Link href="/dashboard" className="text-primary-800 hover:text-primary-900 text-sm flex items-center gap-x-1.5">
                    Access Information <span><ShieldExclamationIcon className="w-6 h-6" /></span>
                </Link> */}
            </div>

            {/* Top cards */}
            <TopCards teacher={teacher} />

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Contact and personal info */}
                <PersonalInfoSection teacher={teacher} />

                {/* Right rail: Teaching Responsibilities */}
                <DocumentsList documents={attachments} />

            </div>
        </div>
    )
}

export default TeacherProfileView

