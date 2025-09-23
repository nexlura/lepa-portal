'use client'

import { useMemo, useState, useEffect } from 'react'
import { ArrowDownTrayIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button';
import { ImportStudentsModal } from '@/components/Students'
import type { MinimalStudent } from '@/components/Students/ImportStudentsModal'
import EmptyState from '@/components/EmptyState';
import StudentTable from '@/components/Students/StudentTable';
import StudentTableControls from '@/components/Students/StudentTable/TableControls';

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
    documents?: { id: string | number, name: string, url?: string, previewUrl?: string }[]
}

export default function StudentsPage() {


    const [students, setStudents] = useState<StudentRecord[]>([])
    const [showImportModal, setShowImportModal] = useState(false)


    // UI state: search, filters, sorting, pagination
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Enrolled'>('All')
    const [gradeFilter, setGradeFilter] = useState<string>('All')
    const [sortBy, setSortBy] = useState<'name' | 'grade' | 'dateOfBirth' | 'enrollmentDate'>('name')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [page, setPage] = useState(1)
    const pageSize = 10

    // Load and persist to localStorage so the detail page can read
    useEffect(() => {
        try {
            const raw = localStorage.getItem('students:list')
            if (raw) {
                const parsed = JSON.parse(raw) as StudentRecord[]
                setStudents(parsed)
            }
        } catch { /* ignore */ }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem('students:list', JSON.stringify(students))
        } catch { /* ignore */ }
    }, [students])

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
            status: 'Pending',
            documents: []
        }))
        setStudents(prev => [...prev, ...imported])
        setShowImportModal(false)
    }

    // Derived data: unique grades for filter
    const gradeOptions = useMemo(() => {
        const set = new Set<string>(students.map(s => s.grade).filter(Boolean))
        return ['All', ...Array.from(set).sort()]
    }, [students])

    // Filtering, searching, sorting
    const filteredAndSorted = useMemo(() => {
        let rows = [...students]
        if (search.trim()) {
            const q = search.toLowerCase()
            rows = rows.filter(r => (
                r.name?.toLowerCase().includes(q) ||
                r.email?.toLowerCase().includes(q) ||
                r.grade?.toLowerCase().includes(q) ||
                r.guardianName?.toLowerCase().includes(q)
            ))
        }
        if (statusFilter !== 'All') {
            rows = rows.filter(r => r.status === statusFilter)
        }
        if (gradeFilter !== 'All') {
            rows = rows.filter(r => r.grade === gradeFilter)
        }
        rows.sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1
            const value = (key: typeof sortBy) => {
                switch (key) {
                    case 'name': return (a.name || '').localeCompare(b.name || '') * dir
                    case 'grade': return (a.grade || '').localeCompare(b.grade || '') * dir
                    case 'dateOfBirth': return ((a.dateOfBirth || '') > (b.dateOfBirth || '') ? 1 : -1) * dir
                    case 'enrollmentDate': return ((a.enrollmentDate || '') > (b.enrollmentDate || '') ? 1 : -1) * dir
                }
            }
            return value(sortBy)
        })
        return rows
    }, [students, search, statusFilter, gradeFilter, sortBy, sortDir])

    // Pagination
    const totalItems = filteredAndSorted.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const currentPage = Math.min(page, totalPages)
    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredAndSorted.slice(start, start + pageSize)
    }, [filteredAndSorted, currentPage, pageSize])

    const toggleSort = (key: typeof sortBy) => {
        if (sortBy === key) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(key)
            setSortDir('asc')
        }
    }

    if (students.length < 1) {
        return (
            <>
                <EmptyState
                    heading='No Students Found'
                    subHeading='Get started by importing admissions data'
                    button={
                        <Button onClick={() => setShowImportModal(true)} color='primary'>
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Import Admissions
                        </Button>
                    }
                    icon={<ClipboardDocumentListIcon className='size-12 text-gray-500' />}
                />
                {/* Individual admission moved to dedicated page */}
                <ImportStudentsModal
                    open={showImportModal}
                    onClose={setShowImportModal}
                    onSubmit={handleImportStudents}
                />
            </>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all student records and information.
                    </p>
                </div>
            </div>
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {/* Controls */}
                    <StudentTableControls
                        search={search}
                        statusFilter={statusFilter}
                        gradeOptions={gradeOptions}
                        gradeFilter={gradeFilter}
                        setSearch={setSearch}
                        setPage={setPage}
                        setStatusFilter={setStatusFilter}
                        setGradeFilter={setGradeFilter}
                    />
                    <div className="overflow-x-auto">
                        {/* Table */}
                        <StudentTable pagedRows={pagedRows} toggleSort={toggleSort} />
                    </div>

                    {/* Pagination controls */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing
                            <span className="font-medium">
                                {(currentPage - 1) * pageSize + (totalItems ? 1 : 0)}
                            </span> to <span className="font-medium">
                                {Math.min(currentPage * pageSize, totalItems)}
                            </span> of <span className="font-medium">
                                {totalItems}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button outline onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                            <div className="text-sm text-gray-700">Page {currentPage} of {totalPages}</div>
                            <Button outline onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual admission moved to dedicated page */}
            <ImportStudentsModal open={showImportModal} onClose={setShowImportModal} onSubmit={handleImportStudents} />
        </div>
    )
} 