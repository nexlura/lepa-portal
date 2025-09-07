import { useState } from 'react'
import { UserIcon, DocumentTextIcon, AcademicCapIcon, ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { Input } from '@/components/UIKit/Input'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { mockDocuments, mockStudent } from '@/app/admin/admissions/process/[id]/page'

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

    const handleSavePersonal = () => {
        // Save personal data
        console.log('Saving personal data:', personalData)
    }

    const handleSaveParent = () => {
        // Save parent data
        console.log('Saving parent data:', parentData)
    }

    const handleDownloadDocument = (document: any) => {
        // Handle document download
        console.log('Downloading document:', document.fileName)
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
        const file = event.target.files?.[0]
        if (file) {
            // Handle file upload
            console.log('Uploading file:', file.name, 'for type:', documentType)
            // Update document status
            setDocuments(prev => prev.map(doc =>
                doc.type === documentType
                    ? { ...doc, status: 'uploaded', fileName: file.name, uploadedAt: new Date().toISOString().split('T')[0] }
                    : doc
            ))
        }
    }

    const tabs = [
        { id: 'personal', name: 'Personal Details', icon: UserIcon },
        { id: 'parent', name: 'Parent', icon: DocumentTextIcon },
        { id: 'documents', name: 'Documents', icon: AcademicCapIcon },
    ]

    return (
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
                                        ? 'border-primary-500 text-primary-600'
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
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                                <Button color="primary" onClick={handleSavePersonal}>
                                    Save Changes
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <Label>Full Name</Label>
                                    <Input
                                        value={personalData.name}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Gender</Label>
                                    <Input
                                        value={personalData.gender}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, gender: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={personalData.dateOfBirth}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={personalData.email}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Phone</Label>
                                    <Input
                                        type="tel"
                                        value={personalData.phone}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Grade</Label>
                                    <Input
                                        value={personalData.grade}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, grade: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Class/Section</Label>
                                    <Input
                                        value={personalData.classSection}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, classSection: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Previous School</Label>
                                    <Input
                                        value={personalData.previousSchool}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, previousSchool: e.target.value }))}
                                    />
                                </Field>
                                <Field className="md:col-span-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={personalData.address}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>City</Label>
                                    <Input
                                        value={personalData.city}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>State</Label>
                                    <Input
                                        value={personalData.state}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Postal Code</Label>
                                    <Input
                                        value={personalData.postalCode}
                                        onChange={(e) => setPersonalData(prev => ({ ...prev, postalCode: e.target.value }))}
                                    />
                                </Field>
                            </div>
                        </div>
                    )}

                    {activeTab === 'parent' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Parent/Guardian Information</h3>
                                <Button color="primary" onClick={handleSaveParent}>
                                    Save Changes
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <Label>Guardian Name</Label>
                                    <Input
                                        value={parentData.guardianName}
                                        onChange={(e) => setParentData(prev => ({ ...prev, guardianName: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Relationship</Label>
                                    <Input
                                        value={parentData.guardianRelationship}
                                        onChange={(e) => setParentData(prev => ({ ...prev, guardianRelationship: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Guardian Email</Label>
                                    <Input
                                        type="email"
                                        value={parentData.guardianEmail}
                                        onChange={(e) => setParentData(prev => ({ ...prev, guardianEmail: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <Label>Guardian Phone</Label>
                                    <Input
                                        type="tel"
                                        value={parentData.guardianPhone}
                                        onChange={(e) => setParentData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                                    />
                                </Field>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
                            <div className="space-y-4">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {doc.status === 'uploaded'
                                                            ? `Uploaded on ${doc.uploadedAt} • ${doc.fileSize}`
                                                            : 'Required for enrollment'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {doc.status === 'uploaded' ? (
                                                    <>
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            Uploaded
                                                        </span>
                                                        <Button
                                                            outline
                                                            size="sm"
                                                            onClick={() => handleDownloadDocument(doc)}
                                                        >
                                                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                                            Download
                                                        </Button>

                                                    </>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileUpload(e, doc.type)}
                                                            className="hidden"
                                                            id={`upload-${doc.type}`}
                                                        />
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending
                                                        </span>
                                                        <Button
                                                            outline
                                                            size="sm"
                                                            onClick={() => document.getElementById(`upload-${doc.type}`)?.click()}
                                                        >
                                                            <CloudArrowUpIcon className="h-4 w-4 mr-1" />
                                                            Upload
                                                        </Button>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Documents Upload */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <div className="text-center">
                                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <label htmlFor="additional-docs" className="cursor-pointer">
                                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                                Upload Additional Documents
                                            </span>
                                            <span className="mt-1 block text-sm text-gray-500">
                                                PDF, DOC, DOCX, JPG, PNG up to 10MB
                                            </span>
                                        </label>
                                        <input
                                            id="additional-docs"
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || [])
                                                console.log('Uploading additional documents:', files)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApplicantTabs