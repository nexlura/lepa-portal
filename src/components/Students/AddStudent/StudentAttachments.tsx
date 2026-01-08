'use client'

import { DocumentTextIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useRef } from 'react'
import type { AddStudentForm, StudentAttachment } from '@/components/Students/AddStudent/types'

interface StudentAttachmentsProps {
    form: AddStudentForm
    setForm: Dispatch<SetStateAction<AddStudentForm>>
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type === 'application/pdf') return 'pdf'
    if (file.type.includes('word') || file.type.includes('document')) return 'document'
    return 'other'
}

const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
}

const StudentAttachments = ({ form, setForm }: StudentAttachmentsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        const newAttachments: StudentAttachment[] = files.map((file) => {
            const attachment: StudentAttachment = {
                file,
                fileName: file.name,
                type: getFileType(file),
                size: file.size,
            }

            // Create preview for images
            if (isImageFile(file)) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setForm((prev) => ({
                        ...prev,
                        attachments: prev.attachments.map((att) =>
                            att.fileName === file.name
                                ? { ...att, preview: reader.result as string }
                                : att
                        ),
                    }))
                }
                reader.readAsDataURL(file)
            }

            return attachment
        })

        setForm((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...newAttachments],
        }))

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveAttachment = (index: number) => {
        setForm((prev) => {
            const attachment = prev.attachments[index]
            // Clean up preview URL if it exists
            if (attachment.preview && attachment.preview.startsWith('data:')) {
                // Data URLs don't need explicit cleanup, but we'll remove it anyway
            }
            return {
                ...prev,
                attachments: prev.attachments.filter((_, i) => i !== index),
            }
        })
    }

    return (
        <section className="border-t border-zinc-200 mt-5 px-6">
            <div className="flex flex-col gap-2 mb-4">
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Student Attachments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Upload documents, photos, or other files related to this student
                    </p>
                </div>
            </div>

            {/* Uploaded Attachments List */}
            {form.attachments.length > 0 && (
                <div className="space-y-4 mb-6">
                    {form.attachments.map((attachment, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    {attachment.preview ? (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={attachment.preview}
                                                alt={attachment.fileName}
                                                className="h-16 w-16 object-cover rounded-md border border-gray-200"
                                            />
                                        </div>
                                    ) : (
                                        <DocumentTextIcon className="h-8 w-8 text-gray-400 flex-shrink-0 mt-1" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {attachment.fileName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {attachment.type} • {formatFileSize(attachment.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAttachment(index)}
                                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                                    aria-label="Remove attachment"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                <div className="text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                        <label htmlFor="student-attachments" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload Attachments
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                                PDF, DOC, DOCX, JPG, PNG up to 10MB
                            </span>
                        </label>
                        <input
                            ref={fileInputRef}
                            id="student-attachments"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="sr-only"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StudentAttachments

