'use client'

import { useState } from 'react'
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button'
import { ImportStudentsModal } from '@/components/Students'
import type { MinimalStudent } from '@/components/Students/ImportStudentsModal'
import AdmissionsTable from '@/components/Admissions/AdmissionTable'
import DetailsModal from '@/components/Admissions/DetailsModal'

export interface StudentRecord {
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

export default function StudentAdmissionsPage() {
    const [students, setStudents] = useState<StudentRecord[]>([])

    const [showImportModal, setShowImportModal] = useState(false)

    const [viewTarget, setViewTarget] = useState<StudentRecord | null>(null)
    const [showViewModal, setShowViewModal] = useState(false)

    const handleImportStudents = (rows: MinimalStudent[]) => {
        const startId = Math.max(0, ...students.map(s => s.id)) + 1
        const imported: StudentRecord[] = rows.map((r, idx) => ({
            id: startId + idx,
            name: r.name,
            dateOfBirth: r.dateOfBirth,
            grade: r.grade,
            gender: r.gender,
            email: r.email,
            guardianName: r.guardianName,
            guardianPhone: r.guardianPhone,
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
        }))
        setStudents(prev => [...prev, ...imported])
        setShowImportModal(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Admissions</h1>
                    <p className="mt-1 text-sm text-gray-500">Admit students individually or by CSV import. Complete minimal imports later.</p>
                </div>
                <div className="flex gap-3">
                    <Button outline onClick={() => setShowImportModal(true)}>
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Batch Import
                    </Button>
                    <Button color="primary" href="/dashboard/students/admissions/new">
                        <PlusIcon className="h-4 w-4 mr-2 text-white" />
                        Admit Student
                    </Button>
                </div>
            </div>
            {/* Table */}
            <AdmissionsTable
                students={students}
                setViewTarget={setViewTarget}
                setShowViewModal={setShowViewModal}
            />

            {/* Individual admission moved to dedicated page */}
            <ImportStudentsModal open={showImportModal} onClose={setShowImportModal} onSubmit={handleImportStudents} />

            {/* Applicant View Modal */}
            {/* <ApplicantDetailsModal showViewModal={showViewModal} setShowViewModal={setShowViewModal} viewTarget={viewTarget} setViewTarget={setViewTarget} /> */}
            <DetailsModal
                showViewModal={showViewModal}
                setShowViewModal={setShowViewModal}
                viewTarget={viewTarget}
                setViewTarget={setViewTarget} />
        </div>
    )
} 