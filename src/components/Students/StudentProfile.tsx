'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChevronRightIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'

import TopCards from '@/components/Students/StudentDetails/TopCards'
import DocumentsList from '@/components/Students/StudentDetails/DocumentsList'
import PersonalInfoSection from '@/components/Students/StudentDetails/PersonalInfo'
import Breadcrumbs from '@/components/Students/StudentDetails/BreadCrumbs'
import { Student } from '@/app/(portal)/students/[pid]/page'

interface StudentProfileViewProps {
    student: Student
}

const StudentProfileView = ({ student }: StudentProfileViewProps) => {
    const router = useRouter()

    if (!student) {
        return (
            <div className="space-y-6">
                <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
                    <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                    <ChevronRightIcon className="mx-2 h-4 w-4" />
                    <Link href="/dashboard/students" className="hover:text-gray-900">Students</Link>
                </nav>
                <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                    Student not found.
                    <div className="mt-4">
                        <button onClick={() => router.push('/dashboard/students')} className="inline-flex items-center text-primary-600 hover:text-primary-700">
                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to students
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className='w-full flex justify-between items-center'>
                {/* Breadcrumbs */}
                <Breadcrumbs student={student} />

                <Link href="/dashboard" className=" text-primary-800 hover:text-primary-900 text-sm flex items-center gap-x-1.5">
                    Access Information <span><ShieldExclamationIcon className='w-6 h-6' /></span>
                </Link>
            </div>


            {/* Top cards */}
            <TopCards student={student} />

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Contact and personal info */}
                <PersonalInfoSection student={student} />

                {/* Right rail: Documents */}
                <DocumentsList documents={[
                    { id: '01', name: 'Transcript', previewUrl: '/', url: '/' },
                    { id: '01', name: 'Birth Certificate', previewUrl: '/', url: '/' }
                ]} />
            </div>
        </div>
    )
}

export default StudentProfileView