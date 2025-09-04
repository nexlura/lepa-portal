'use client'

import { useState } from 'react'
import { PlusIcon, ArrowDownTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button'
import { ImportStudentsModal } from '@/components/Students'
import type { MinimalStudent } from '@/components/Students/ImportStudentsModal'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import AdmissionsTable from '@/components/Admissions/AdmissionTable'

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
                        Import CSV
                    </Button>
                    <Button color="primary" href="/admin/students/admissions/new">
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
            <Dialog size="xl" open={showViewModal} onClose={(o) => { if (!o) setViewTarget(null); setShowViewModal(o) }} className="relative z-20">
                <DialogTitle>Applicant Details</DialogTitle>
                <DialogDescription>Review the applicant information and proceed when ready.</DialogDescription>
                <DialogBody>
                    {viewTarget && (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                            {/* Photo */}
                            <div className="sm:col-span-3 flex items-start">
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-semibold select-none">
                                    {viewTarget.name?.split(' ').map(p => p[0]).slice(0, 2).join('') || 'A'}
                                </div>
                            </div>
                            {/* Top-right status */}
                            <div className="sm:col-span-9 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{viewTarget.name}</h3>
                                    <p className="text-sm text-gray-500">{viewTarget.email || viewTarget.phone || 'No contact provided'}</p>
                                </div>
                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 h-fit">{viewTarget.status}</span>
                            </div>
                            {/* Details grid */}
                            <div className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs uppercase text-gray-500">Gender</div>
                                    <div className="text-sm text-gray-900">{viewTarget.gender || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-gray-500">Date of Birth</div>
                                    <div className="text-sm text-gray-900">{viewTarget.dateOfBirth || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-gray-500">Application Date</div>
                                    <div className="text-sm text-gray-900">{viewTarget.enrollmentDate || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-gray-500">Applying for Grade</div>
                                    <div className="text-sm text-gray-900">{viewTarget.grade || '-'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => { setShowViewModal(false); setViewTarget(null) }}>Close</Button>
                    <Button color="primary" onClick={() => { /* placeholder for processing flow */ }}>
                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                        Process applicant
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
} 