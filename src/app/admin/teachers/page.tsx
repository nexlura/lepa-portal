'use client'

import { useState } from 'react'
import { AcademicCapIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

import AddTeacherModal from '@/components/Teachers/AddTeacherModal'
import ImportTeachersModal from '@/components/Teachers/ImportTeachersModal'
import { Button } from '@/components/UIKit/Button'

interface Teacher {
    id: number
    name: string
    email: string
    subject: string
    status: string
    joinDate: string
    phone?: string
    department?: string
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([
        {
            id: 1,
            name: 'Dr. Emily Wilson',
            email: 'emily.wilson@lepa.edu',
            subject: 'Mathematics',
            status: 'Active',
            joinDate: '2023-08-15',
            phone: '+1 (555) 123-4567',
            department: 'STEM'
        },
        {
            id: 2,
            name: 'Mr. David Chen',
            email: 'david.chen@lepa.edu',
            subject: 'Science',
            status: 'Active',
            joinDate: '2023-09-01',
            phone: '+1 (555) 234-5678',
            department: 'STEM'
        },
        {
            id: 3,
            name: 'Ms. Lisa Rodriguez',
            email: 'lisa.rodriguez@lepa.edu',
            subject: 'English',
            status: 'Active',
            joinDate: '2023-08-20',
            phone: '+1 (555) 345-6789',
            department: 'Humanities'
        },
    ])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)

    const handleAddTeacher = (teacherData: {
        name: string
        email: string
        subject: string
        phone?: string
        department?: string
    }) => {
        const newTeacher: Teacher = {
            id: Math.max(...teachers.map(t => t.id)) + 1,
            name: teacherData.name,
            email: teacherData.email,
            subject: teacherData.subject,
            phone: teacherData.phone,
            department: teacherData.department,
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0]
        }

        setTeachers(prev => [...prev, newTeacher])
        setShowAddModal(false)
    }

    const handleImportTeachers = (importedTeachers: {
        name: string
        email: string
        subject: string
        phone?: string
        department?: string
    }[]) => {
        const newTeachers: Teacher[] = importedTeachers.map((teacherData, index) => ({
            id: Math.max(...teachers.map(t => t.id)) + index + 1,
            name: teacherData.name,
            email: teacherData.email,
            subject: teacherData.subject,
            phone: teacherData.phone,
            department: teacherData.department,
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0]
        }))

        setTeachers(prev => [...prev, ...newTeachers])
        setShowImportModal(false)
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all teacher records and information.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowImportModal(true)}
                        outline
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        color='primary'
                    >
                        <PlusIcon className="h-4 w-4 mr-2 text-white" color='white' />
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Teachers
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">{teachers.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AcademicCapIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Teachers
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {teachers.filter(t => t.status === 'Active').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AcademicCapIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Departments
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {new Set(teachers.map(t => t.department).filter(Boolean)).size}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teachers table */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Faculty Directory
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teacher.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{teacher.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{teacher.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{teacher.department || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{teacher.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.joinDate}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddTeacherModal
                open={showAddModal}
                onClose={setShowAddModal}
                onSubmit={handleAddTeacher}
            />

            <ImportTeachersModal
                open={showImportModal}
                onClose={setShowImportModal}
                onSubmit={handleImportTeachers}
            />
        </div>
    )
} 