import { DocumentTextIcon, ArrowDownTrayIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { Dispatch, SetStateAction } from 'react';

export type Document = {
    id: number;
    name: string;
    type: string;
    status: string;
    uploadedAt: string | null;
    fileSize: string | null;
    fileName: string | null;
}
interface DocumentTabProps {
    documents: Document[]
    setDocuments: Dispatch<SetStateAction<Document[]>>
}

const DocumentTab = ({ documents, setDocuments }: DocumentTabProps) => {


    const handleDownloadDocument = (document: Document) => {
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

    return (
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
    )
}

export default DocumentTab