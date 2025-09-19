'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, ChevronRightIcon, CalendarIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'

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
    guardianName?: string
    guardianRelationship?: string
    guardianEmail?: string
    guardianPhone?: string
    status: 'Pending' | 'Enrolled'
}

export default function StudentDetailsPage() {
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
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
                <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                <ChevronRightIcon className="mx-2 h-4 w-4" />
                <Link href="/dashboard/students" className="hover:text-gray-900">Students</Link>
                <ChevronRightIcon className="mx-2 h-4 w-4" />
                <span className="text-gray-900">{student.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">Grade {student.grade}{student.classSection ? ` • ${student.classSection}` : ''}</p>
                </div>
                <button onClick={() => router.push('/dashboard/students')} className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to students
                </button>
            </div>

            {/* Top cards */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Profile */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-green-700" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-lg font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Student id: {student.id}</div>
                        <div className="text-xs text-gray-500">Status: <span className="font-medium">{student.status}</span></div>
                    </div>
                </div>

                {/* Academic details */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
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

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Contact and personal info */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4 lg:col-span-2">
                    <div className="text-base font-semibold text-gray-900">Student information</div>
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
                            <dd className="text-sm text-gray-900 inline-flex items-center"><EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />{student.email || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Phone</dt>
                            <dd className="text-sm text-gray-900 inline-flex items-center"><PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />{student.phone || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Address</dt>
                            <dd className="text-sm text-gray-900 inline-flex items-start"><MapPinIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-400" />
                                <span>{student.address || '-'}{student.city ? `, ${student.city}` : ''}{student.state ? `, ${student.state}` : ''}{student.postalCode ? `, ${student.postalCode}` : ''}</span>
                            </dd>
                        </div>
                    </dl>

                    <div className="pt-2">
                        <div className="text-sm font-medium text-gray-900">Guardian</div>
                        <div className="text-sm text-gray-700">{student.guardianName || '-'}{student.guardianRelationship ? ` (${student.guardianRelationship})` : ''}</div>
                        <div className="text-xs text-gray-500">{student.guardianEmail || ''}{student.guardianPhone ? ` • ${student.guardianPhone}` : ''}</div>
                    </div>
                </div>

                {/* Right rail (placeholders for attendance/QR) */}
                <div className="space-y-5">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-semibold text-gray-900 mb-2">Attendance</div>
                        <div className="text-xs text-gray-500">Coming soon</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-sm font-semibold text-gray-900 mb-3">Create ABC Id</div>
                        <div className="h-28 w-28 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
} 