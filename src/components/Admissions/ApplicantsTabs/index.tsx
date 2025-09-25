import { useState } from 'react'
import { UserIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

import { mockDocuments, mockStudent } from '@/app/dashboard/admissions/process/[id]/page'
import PersonalDetailsTab from './PersonalDetailsTab'
import DocumentTab from './DocumentTab'
import TabNavigation from './TabHeader'
import GuardianTab from './Guardian'

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
        guardianEmail: mockStudent.guardianEmail || '',
        guardianPhone: mockStudent.guardianPhone || ''
    })

    const [documents, setDocuments] = useState(mockDocuments)

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