'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckIcon, XMarkIcon, UserIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button'
import { StudentRecord } from '@/app/admin/admissions/page'

// Mock data - in real app this would come from API
const mockStudent: StudentRecord = {
    id: 1,
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: '2010-05-15',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    grade: 'Grade 5',
    classSection: 'A',
    enrollmentDate: '2024-01-15',
    previousSchool: 'Elementary School',
    guardianName: 'Jane Doe',
    guardianRelationship: 'Mother',
    guardianEmail: 'jane.doe@example.com',
    guardianPhone: '+1234567891',
    status: 'Pending'
}

const admissionSteps = [
    { id: 1, name: 'Application Review', description: 'Review submitted application', completed: true },
    { id: 2, name: 'Document Verification', description: 'Verify required documents', completed: true },
    { id: 3, name: 'Interview', description: 'Conduct student interview', completed: false },
    { id: 4, name: 'Assessment', description: 'Academic assessment', completed: false },
    { id: 5, name: 'Final Decision', description: 'Make admission decision', completed: false },
]

export default function ProcessApplicantPage() {
    const params = useParams()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('personal')
    const [currentStep, setCurrentStep] = useState(3) // Currently on step 3

    const handleEnroll = () => {
        // Handle enrollment logic
        console.log('Enrolling student:', mockStudent.id)
        router.push('/admin/admissions')
    }

    const handleReject = () => {
        // Handle rejection logic
        console.log('Rejecting student:', mockStudent.id)
        router.push('/admin/admissions')
    }

    const tabs = [
        { id: 'personal', name: 'Personal Details', icon: UserIcon },
        { id: 'parent', name: 'Parent', icon: DocumentTextIcon },
        { id: 'documents', name: 'Documents', icon: AcademicCapIcon },
    ]

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Process Applicant</h1>
                            <p className="mt-1 text-sm text-gray-500">Review and process admission application</p>
                        </div>
                        <Button plain onClick={() => router.back()}>
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Right Column - Tabs */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`${activeTab === tab.id
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                            >
                                                <Icon className="h-4 w-4 mr-2" />
                                                {tab.name}
                                            </button>
                                        )
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'personal' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.name}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.gender}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.dateOfBirth}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.phone}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Grade</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.grade}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {mockStudent.address}, {mockStudent.city}, {mockStudent.state} {mockStudent.postalCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'parent' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Parent/Guardian Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.guardianName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.guardianRelationship}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Guardian Email</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.guardianEmail}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                                                <p className="mt-1 text-sm text-gray-900">{mockStudent.guardianPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Birth Certificate</p>
                                                        <p className="text-xs text-gray-500">Required for enrollment</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Uploaded
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Previous School Records</p>
                                                        <p className="text-xs text-gray-500">Academic transcripts</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Immunization Records</p>
                                                        <p className="text-xs text-gray-500">Health department records</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Uploaded
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Left Column - Admission Flow Steps */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Admission Flow</h2>
                            <div className="space-y-4">
                                {admissionSteps.map((step, index) => (
                                    <div key={step.id} className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                                            ? 'bg-green-100 text-green-600'
                                            : index === currentStep - 1
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step.completed ? (
                                                <CheckIcon className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-medium">{step.id}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${step.completed || index === currentStep - 1
                                                ? 'text-gray-900'
                                                : 'text-gray-500'
                                                }`}>
                                                {step.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 space-y-3">
                                <Button
                                    color="primary"
                                    className="w-full"
                                    onClick={handleEnroll}
                                >
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    Enroll Student
                                </Button>
                                <Button
                                    outline
                                    className="w-full"
                                    onClick={handleReject}
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    Reject Application
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
