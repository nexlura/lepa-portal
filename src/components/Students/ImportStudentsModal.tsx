import { useState, useRef } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Button } from '@/components/UIKit/Button'

export type MinimalStudent = {
    name: string
    dateOfBirth: string
    grade: string
    gender?: string
    email?: string
    guardianName?: string
    guardianPhone?: string
}

type CSVValidationResult = {
    isValid: boolean
    students: MinimalStudent[]
    errors: string[]
}

const ImportStudentsModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onSubmit: (students: MinimalStudent[]) => void
}) => {
    const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateCSV = (file: File): Promise<CSVValidationResult> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = (e.target?.result as string) || ''
                const lines = text.split('\n').filter(line => line.trim())
                if (lines.length < 2) {
                    resolve({ isValid: false, students: [], errors: ['CSV must include header and at least one row'] })
                    return
                }
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
                const requiredHeaders = ['name', 'date_of_birth', 'grade']
                const missing = requiredHeaders.filter(h => !headers.includes(h))
                if (missing.length) {
                    resolve({ isValid: false, students: [], errors: [`Missing required headers: ${missing.join(', ')}`] })
                    return
                }

                const students: MinimalStudent[] = []
                const errors: string[] = []

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim())
                    const get = (key: string) => values[headers.indexOf(key)] || ''

                    const student: MinimalStudent = {
                        name: get('name'),
                        dateOfBirth: get('date_of_birth'),
                        grade: get('grade'),
                        gender: headers.includes('gender') ? get('gender') : undefined,
                        email: headers.includes('email') ? get('email') : undefined,
                        guardianName: headers.includes('guardian_name') ? get('guardian_name') : undefined,
                        guardianPhone: headers.includes('guardian_phone') ? get('guardian_phone') : undefined,
                    }

                    if (!student.name) errors.push(`Row ${i + 1}: name is required`)
                    if (!student.dateOfBirth) errors.push(`Row ${i + 1}: date_of_birth is required`)
                    if (!student.grade) errors.push(`Row ${i + 1}: grade is required`)

                    if (student.name && student.dateOfBirth && student.grade) {
                        students.push(student)
                    }
                }

                resolve({ isValid: errors.length === 0, students, errors })
            }
            reader.readAsText(file)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.name.endsWith('.csv')) {
            setValidationResult({ isValid: false, students: [], errors: ['Please select a .csv file'] })
            return
        }
        setIsProcessing(true)
        try {
            const result = await validateCSV(file)
            setValidationResult(result)
        } catch {
            setValidationResult({ isValid: false, students: [], errors: ['Error processing CSV file'] })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        setValidationResult(null)
        setIsProcessing(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        onClose(false)
    }

    const handleSubmit = () => {
        if (validationResult?.isValid && validationResult.students.length) {
            onSubmit(validationResult.students)
            handleClose()
        }
    }

    const downloadTemplate = () => {
        const url = '/students_minimal_template.csv'
        const a = document.createElement('a')
        a.href = url
        a.download = 'students_minimal_template.csv'
        a.click()
    }

    return (
        <Dialog size="lg" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Import Students (Minimal)</DialogTitle>
            <DialogDescription>
                Upload a CSV with the minimal fields. You can complete full details later.
                <button onClick={downloadTemplate} className="ml-2 text-blue-600 hover:text-blue-800 underline">Download template</button>
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
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
                            Required headers: name, date_of_birth, grade. Optional: gender, email, guardian_name, guardian_phone
                        </p>
                    </Field>

                    {isProcessing && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-sm text-gray-600">Processing CSV...</span>
                        </div>
                    )}

                    {validationResult && !isProcessing && (
                        <div className="space-y-4">
                            {validationResult.isValid ? (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    <div className="flex items-center justify-between">
                                        <span>CSV is valid</span>
                                        <span className="font-medium">{validationResult.students.length} students found</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    <div className="space-y-2">
                                        <div className="font-medium">CSV validation failed:</div>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {validationResult.errors.map((err, idx) => (
                                                <li key={idx}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {validationResult.isValid && validationResult.students.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Preview:</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {validationResult.students.slice(0, 5).map((s, i) => (
                                            <div key={i} className="text-sm text-gray-600">
                                                <span className="font-medium">{s.name}</span> - {s.grade} (DOB: {s.dateOfBirth})
                                            </div>
                                        ))}
                                        {validationResult.students.length > 5 && (
                                            <div className="text-sm text-gray-500 italic">...and {validationResult.students.length - 5} more</div>
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
                <Button color="primary" onClick={handleSubmit} disabled={!validationResult?.isValid || !validationResult.students.length}>
                    Import {validationResult?.students.length || 0} Students
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportStudentsModal 