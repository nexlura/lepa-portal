'use client'

import { useState } from 'react'
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button'
import { ImportStudentsModal, EditStudentModal } from '@/components/Students'
import type { MinimalStudent } from '@/components/Students/ImportStudentsModal'
import type { EditStudentFormData } from '@/components/Students/EditStudentModal'

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

export default function StudentAdmissionsPage() {
    const [students, setStudents] = useState<StudentRecord[]>([])

    const [showImportModal, setShowImportModal] = useState(false)

    const [editTarget, setEditTarget] = useState<StudentRecord | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)

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

    const handleEditStudent = (updated: EditStudentFormData) => {
        if (!editTarget) return
        setStudents(prev => prev.map(s => {
            if (s.id !== editTarget.id) return s
            return {
                ...s,
                name: updated.fullName,
                gender: updated.gender ?? s.gender,
                dateOfBirth: updated.dateOfBirth ?? s.dateOfBirth,
                email: updated.email ?? s.email,
                phone: updated.phone ?? s.phone,
                address: updated.address ?? s.address,
                city: updated.city ?? s.city,
                state: updated.state ?? s.state,
                postalCode: updated.postalCode ?? s.postalCode,
                grade: updated.grade ?? s.grade,
                classSection: updated.classSection ?? s.classSection,
                enrollmentDate: updated.enrollmentDate ?? s.enrollmentDate,
                previousSchool: updated.previousSchool ?? s.previousSchool,
                guardianName: updated.guardianName ?? s.guardianName,
                guardianRelationship: updated.guardianRelationship ?? s.guardianRelationship,
                guardianEmail: updated.guardianEmail ?? s.guardianEmail,
                guardianPhone: updated.guardianPhone ?? s.guardianPhone,
            }
        }))
        setShowEditModal(false)
        setEditTarget(null)
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
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {/* <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Admissions</h3> */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{s.name}</div>
                                            <div className="text-xs text-gray-500">{s.email || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{s.grade || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{s.dateOfBirth || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{s.guardianName || '-'} {s.guardianPhone ? `(${s.guardianPhone})` : ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{s.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button onClick={() => { setEditTarget(s); setShowEditModal(true) }}>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Individual admission moved to dedicated page */}
            <ImportStudentsModal open={showImportModal} onClose={setShowImportModal} onSubmit={handleImportStudents} />
            <EditStudentModal
                open={showEditModal}
                onClose={(o) => { if (!o) setEditTarget(null); setShowEditModal(o) }}
                initialData={editTarget ? {
                    fullName: editTarget.name,
                    gender: editTarget.gender,
                    dateOfBirth: editTarget.dateOfBirth,
                    email: editTarget.email,
                    phone: editTarget.phone,
                    address: editTarget.address,
                    city: editTarget.city,
                    state: editTarget.state,
                    postalCode: editTarget.postalCode,
                    grade: editTarget.grade,
                    classSection: editTarget.classSection,
                    enrollmentDate: editTarget.enrollmentDate,
                    previousSchool: editTarget.previousSchool,
                    guardianName: editTarget.guardianName,
                    guardianRelationship: editTarget.guardianRelationship,
                    guardianEmail: editTarget.guardianEmail,
                    guardianPhone: editTarget.guardianPhone,
                } : null}
                onSubmit={handleEditStudent}
            />
        </div>
    )
} 