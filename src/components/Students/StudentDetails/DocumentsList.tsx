"use client"

import { useState } from "react"
import { DocumentIcon, EyeIcon, ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline"

export interface StudentDocument {
    id: string | number
    name: string
    url?: string
    previewUrl?: string
}

interface DocumentsListProps {
    documents: StudentDocument[]
}

const DocumentsList = ({ documents }: DocumentsListProps) => {
    const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null)

    const handleDownload = (doc: StudentDocument) => {
        if (!doc.url && !doc.previewUrl) return
        const a = document.createElement('a')
        a.href = (doc.url || doc.previewUrl) as string
        a.download = doc.name
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-semibold text-gray-900 mb-3">Documents</div>
            {documents.length === 0 ? (
                <div className="text-xs text-gray-500">No documents uploaded.</div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {documents.map(doc => (
                        <li key={doc.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DocumentIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-900">{doc.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                                    onClick={() => setPreviewDoc(doc)}
                                    disabled={!doc.previewUrl && !doc.url}
                                >
                                    <EyeIcon className="h-4 w-4 mr-1" /> Preview
                                </button>
                                <button
                                    className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                                    onClick={() => handleDownload(doc)}
                                    disabled={!doc.previewUrl && !doc.url}
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Download
                                </button>
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
                        <div className="flex-1 overflow-hidden">
                            {(previewDoc.previewUrl || previewDoc.url) ? (
                                <iframe src={(previewDoc.previewUrl || previewDoc.url) as string} className="w-full h-full" />
                            ) : (
                                <div className="h-full w-full grid place-items-center text-sm text-gray-500">No preview available</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DocumentsList 