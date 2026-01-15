"use client"

import { useState } from "react"
import { EyeIcon, ArrowDownTrayIcon, XMarkIcon, DocumentTextIcon } from "@heroicons/react/24/outline"

const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return 'Unknown size'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } catch {
        return dateString
    }
}

export interface StudentDocument {
    id: string | number
    name: string
    url?: string
    previewUrl?: string
    fileType?: string
    uploadedAt?: string
    fileSize?: number
}

interface DocumentsListProps {
    documents: StudentDocument[]
}

const DocumentsList = ({ documents }: DocumentsListProps) => {
    const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null)

    const handleDownload = async (doc: StudentDocument) => {
        if (!doc.url && !doc.previewUrl) return
        const downloadUrl = doc.url || doc.previewUrl
        if (!downloadUrl) return
        
        try {
            // Fetch the file as a blob
            const response = await fetch(downloadUrl)
            if (!response.ok) throw new Error('Failed to fetch file')
            
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            
            // Create a temporary anchor element to trigger download
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = doc.name
            document.body.appendChild(a)
            a.click()
            
            // Cleanup
            document.body.removeChild(a)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Error downloading file:', error)
            // Fallback to opening in new tab if download fails
            window.open(downloadUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-semibold text-gray-900 mb-3">Documents</div>
            {documents.length === 0 ? (
                <div className="text-xs text-gray-500">No documents uploaded.</div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {documents.map(doc => (
                        <li key={doc.id} className="border border-gray-200 rounded-lg p-2 my-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1 min-w-0">
                                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate" title={doc.name}>
                                            {doc.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {doc.uploadedAt && `Uploaded on ${formatDate(doc.uploadedAt)}`}
                                            {doc.uploadedAt && doc.fileSize && ' • '}
                                            {doc.fileSize && formatFileSize(doc.fileSize)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                                        onClick={() => setPreviewDoc(doc)}
                                        disabled={!doc.previewUrl && !doc.url}
                                        title="Preview"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                    </button>
                                    <button
                                        className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                                        onClick={() => handleDownload(doc)}
                                        disabled={!doc.previewUrl && !doc.url}
                                        title="Download"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewDoc(null)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[75vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">{previewDoc.name}</div>
                            <button className="p-1 text-gray-500 hover:text-gray-900" onClick={() => setPreviewDoc(null)}>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {(previewDoc.previewUrl || previewDoc.url) ? (
                                (() => {
                                    const previewUrl = (previewDoc.previewUrl || previewDoc.url) as string
                                    const isImage = previewDoc.fileType?.startsWith('image/') || 
                                                   previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                                    
                                    if (isImage) {
                                        return (
                                            <div className="flex items-center justify-center h-full">
                                                <img 
                                                    src={previewUrl} 
                                                    alt={previewDoc.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        )
                                    }
                                    
                                    // For PDFs and other documents, use iframe
                                    return (
                                        <iframe 
                                            src={previewUrl} 
                                            className="w-full h-full border-0"
                                            title={previewDoc.name}
                                        />
                                    )
                                })()
                            ) : (
                                <div className="h-full w-full grid place-items-center text-sm text-gray-500">
                                    No preview available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DocumentsList 