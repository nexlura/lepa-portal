'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChevronRightIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline'
import TopCards from '@/components/Students/StudentDetails/TopCards'
import DocumentsList, { StudentDocument } from '@/components/Students/StudentDetails/DocumentsList'
import PersonalInfoSection from '@/components/Students/StudentDetails/PersonalInfo'
import Breadcrumbs from '@/components/Students/StudentDetails/BreadCrumbs'

interface StudentRecord {
    id: number
    name: string
    gender?: string
    dateOfBirth?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    grade: string
    classSection?: string
    enrollmentDate: string
    previousSchool?: string
    transferredFromSchool?: string
    promotedFromGrade?: string | number
    currentTeacherName?: string
    guardianName?: string
    guardianRelationship?: string
    guardianEmail?: string
    guardianPhone?: string
    status: 'Pending' | 'Enrolled'
    documents?: StudentDocument[]
}

const StudentDetailsPage = () => {
    const params = useParams()
    const router = useRouter()
    const [student, setStudent] = useState<StudentRecord | null>(null)

    const studentId = useMemo(() => {
        const idParam = params?.id
        if (!idParam) return NaN
        if (Array.isArray(idParam)) return Number(idParam[0])
        return Number(idParam)
    }, [params])

    useEffect(() => {
        try {
            const raw = localStorage.getItem('students:list')
            if (!raw) return
            const rows: StudentRecord[] = JSON.parse(raw)
            const s = rows.find(r => r.id === studentId) || null
            setStudent(s)
        } catch { /* ignore */ }
    }, [studentId])

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

export default StudentDetailsPage