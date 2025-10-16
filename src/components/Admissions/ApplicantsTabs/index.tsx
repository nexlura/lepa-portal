import { useState } from 'react'
import { UserIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

import PersonalDetailsTab from './PersonalDetailsTab'
import DocumentTab, { Document } from './DocumentTab'
import TabNavigation from './TabHeader'
import GuardianTab from './Guardian'
import { StudentRecord } from '@/app/dashboard/admissions/page'

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

const mockDocuments = [
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

const ApplicantTabs = () => {
    const [activeTab, setActiveTab] = useState('personal')

    // Form states
    const [personalData, setPersonalData] = useState({
        name: mockStudent.name,
        gender: mockStudent.gender || '',
        dateOfBirth: mockStudent.dateOfBirth || '',
        email: mockStudent.email || '',
        phone: mockStudent.phone || '',
        address: mockStudent.address || '',
        city: mockStudent.city || '',
        state: mockStudent.state || '',
        postalCode: mockStudent.postalCode || '',
        grade: mockStudent.grade || '',
        classSection: mockStudent.classSection || '',
        previousSchool: mockStudent.previousSchool || ''
    })

    const [parentData, setParentData] = useState({
        guardianName: mockStudent.guardianName || '',
        guardianRelationship: mockStudent.guardianRelationship || '',
        guardianPhone: mockStudent.guardianPhone || '',
        guardianAddress: ''
    })

    const [documents, setDocuments] = useState<Document[]>(mockDocuments)

    const tabs = [
        { id: 'personal', name: 'Personal Details', icon: UserIcon },
        { id: 'guardian', name: 'Guardian', icon: DocumentTextIcon },
        { id: 'documents', name: 'Documents', icon: AcademicCapIcon },
    ]

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
                {/* Tab Navigation */}
                <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'personal' && (
                        <PersonalDetailsTab personalData={personalData} setPersonalData={setPersonalData} />
                    )}

                    {activeTab === 'guardian' && (
                        <GuardianTab guardianData={parentData} setGuardianData={setParentData} />
                    )}

                    {activeTab === 'documents' && (
                        <DocumentTab documents={documents} setDocuments={setDocuments} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApplicantTabs