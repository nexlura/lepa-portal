'use client'

import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { StudentRecord } from '@/app/admin/admissions/page'
import VerticalStepper from '@/components/Admissions/VerticalStepper'
import ApplicantTabs from '@/components/Admissions/ApplicantsTabs'

// Mock data - in real app this would come from API
export const mockStudent: StudentRecord = {
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

export const mockDocuments = [
    {
        id: 1,
        name: 'Birth Certificate',
        type: 'birth_certificate',
        status: 'uploaded',
        uploadedAt: '2024-01-10',
        fileSize: '2.3 MB',
        fileName: 'birth_certificate_john_doe.pdf'
    },
    {
        id: 2,
        name: 'Previous School Records',
        type: 'school_records',
        status: 'pending',
        uploadedAt: null,
        fileSize: null,
        fileName: null
    },
    {
        id: 3,
        name: 'Immunization Records',
        type: 'immunization',
        status: 'uploaded',
        uploadedAt: '2024-01-12',
        fileSize: '1.8 MB',
        fileName: 'immunization_records_john_doe.pdf'
    }
]

export default function ProcessApplicantPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {/* Left Column - Tabs */}
                    <ApplicantTabs />

                    {/* Right Column - Vertical Stepper */}
                    <VerticalStepper />
                </div>
            </div>
        </div>
    )
}
