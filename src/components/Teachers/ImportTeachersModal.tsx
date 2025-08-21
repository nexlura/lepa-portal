import { useState, useRef } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Button } from '../UIKit/Button'

interface TeacherData {
    name: string
    email: string
    subject: string
    phone?: string
    department?: string
}

interface CSVValidationResult {
    isValid: boolean
    teachers: TeacherData[]
    errors: string[]
}

const ImportTeachersModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onSubmit: (teachers: TeacherData[]) => void
}) => {
    const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateCSV = (file: File): Promise<CSVValidationResult> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target?.result as string
                const lines = text.split('\n').filter(line => line.trim())

                if (lines.length < 2) {
                    resolve({
                        isValid: false,
                        teachers: [],
                        errors: ['CSV file must have at least a header row and one data row']
                    })
                    return
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
                const requiredHeaders = ['name', 'email', 'subject']
                const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))

                if (missingHeaders.length > 0) {
                    resolve({
                        isValid: false,
                        teachers: [],
                        errors: [`Missing required headers: ${missingHeaders.join(', ')}`]
                    })
                    return
                }

                const teachers: TeacherData[] = []
                const errors: string[] = []

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i]
                    const values = line.split(',').map(v => v.trim())

                    if (values.length < 3) {
                        errors.push(`Row ${i + 1}: Insufficient data`)
                        continue
                    }

                    const teacher: TeacherData = {
                        name: values[headers.indexOf('name')] || '',
                        email: values[headers.indexOf('email')] || '',
                        subject: values[headers.indexOf('subject')] || '',
                        phone: headers.includes('phone') ? values[headers.indexOf('phone')] || '' : '',
                        department: headers.includes('department') ? values[headers.indexOf('department')] || '' : ''
                    }

                    // Validate required fields
                    if (!teacher.name.trim()) {
                        errors.push(`Row ${i + 1}: Name is required`)
                    }
                    if (!teacher.email.trim()) {
                        errors.push(`Row ${i + 1}: Email is required`)
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
                        errors.push(`Row ${i + 1}: Invalid email format`)
                    }
                    if (!teacher.subject.trim()) {
                        errors.push(`Row ${i + 1}: Subject is required`)
                    }

                    if (teacher.name.trim() && teacher.email.trim() && teacher.subject.trim()) {
                        teachers.push(teacher)
                    }
                }

                resolve({
                    isValid: errors.length === 0,
                    teachers,
                    errors
                })
            }
            reader.readAsText(file)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.csv')) {
            setValidationResult({
                isValid: false,
                teachers: [],
                errors: ['Please select a valid CSV file']
            })
            return
        }

        setIsProcessing(true)

        try {
            const result = await validateCSV(file)
            setValidationResult(result)
        } catch {
            setValidationResult({
                isValid: false,
                teachers: [],
                errors: ['Error processing CSV file']
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSubmit = () => {
        if (validationResult?.isValid && validationResult.teachers.length > 0) {
            onSubmit(validationResult.teachers)
            handleClose()
        }
    }

    const handleClose = () => {
        setValidationResult(null)
        setIsProcessing(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onClose(false)
    }

    const downloadTemplate = () => {
        const csvContent = 'name,email,subject,phone,department\nDr. Emily Wilson,emily.wilson@lepa.edu,Mathematics,+1 (555) 123-4567,STEM\nMr. David Chen,david.chen@lepa.edu,Science,+1 (555) 234-5678,STEM'
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'teachers_template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <Dialog size="lg" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Import Teachers from CSV</DialogTitle>
            <DialogDescription>
                Upload a CSV file to import multiple teachers at once.
                <button
                    onClick={downloadTemplate}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                    Download template
                </button>
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    {/* File Upload */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">CSV File</Label>
                        <div className="mt-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            The CSV should include columns for: name, email, subject (required), phone, department (optional)
                        </p>
                    </Field>

                    {/* Processing State */}
                    {isProcessing && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-sm text-gray-600">Processing CSV file...</span>
                        </div>
                    )}

                    {/* Validation Results */}
                    {validationResult && !isProcessing && (
                        <div className="space-y-4">
                            {validationResult.isValid ? (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    <div className="flex items-center justify-between">
                                        <span>CSV file is valid!</span>
                                        <span className="font-medium">{validationResult.teachers.length} teachers found</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    <div className="space-y-2">
                                        <div className="font-medium">CSV validation failed:</div>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {validationResult.errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Preview of valid teachers */}
                            {validationResult.isValid && validationResult.teachers.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Preview of teachers to be imported:</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {validationResult.teachers.slice(0, 5).map((teacher, index) => (
                                            <div key={index} className="text-sm text-gray-600">
                                                <span className="font-medium">{teacher.name}</span> - {teacher.email} ({teacher.subject})
                                            </div>
                                        ))}
                                        {validationResult.teachers.length > 5 && (
                                            <div className="text-sm text-gray-500 italic">
                                                ... and {validationResult.teachers.length - 5} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={handleClose}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!validationResult?.isValid || validationResult.teachers.length === 0}
                >
                    Import {validationResult?.teachers.length || 0} Teachers
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportTeachersModal 