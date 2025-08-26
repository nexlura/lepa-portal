import { useState } from "react"

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "../UIKit/Dialog"
import { Button } from "../UIKit/Button"
import { Field, Label } from "../UIKit/Fieldset"

const ImportCsvModal = ({
    open,
    onClose,
    onImport,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onImport: (rows: Array<{
        name?: string
        grade?: string
        section?: string
        homeroomTeacher?: string
        capacity?: string
    }>) => void
}) => {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDownloadTemplate = () => {
        const headers = ['name', 'capacity']
        const sample = [
            headers.join(','),
            'Class 1,40',
            'Class 2 ,35',
        ].join('\n')
        const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'classes_template.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    const parseCsv = async (file: File) => {
        const text = await file.text()
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
        if (lines.length === 0) return []
        const headers = lines[0].split(',').map((h) => h.trim())
        const rows = lines.slice(1).map((line) => {
            const cols = line.split(',')
            const obj: Record<string, string> = {}
            headers.forEach((h, idx) => {
                const raw = (cols[idx] ?? '').trim()
                obj[h] = raw.replace(/^"|"$/g, '')
            })
            return obj
        })
        return rows
    }

    const handleImport = async () => {
        setError(null)
        if (!file) {
            setError('Please choose a CSV file to import')
            return
        }
        try {
            const rows = await parseCsv(file)
            if (!rows.length) {
                setError('No data found in CSV file')
                return
            }
            onImport(rows)
        } catch (e) {
            setError('Failed to parse CSV. Ensure it is a simple comma-separated file without embedded commas.')
        }
    }

    return (
        <Dialog size="md" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Import Classes from CSV</DialogTitle>
            <DialogDescription>
                Upload a CSV with headers: <span className="font-mono">name, capacity</span>.
            </DialogDescription>
            <DialogBody>
                {error ? (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                ) : null}
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">CSV File</Label>
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] text-base/6 text-zinc-950 placeholder:text-zinc-400 sm:text-sm/6 border border-zinc-950/10 bg-white focus:outline-hidden"
                        />
                    </Field>
                    <div className="text-sm text-gray-500">
                        Need a sample?{' '}
                        <button type="button" className="underline text-primary-600" onClick={handleDownloadTemplate}>
                            Download a template
                        </button>
                    </div>
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button color="primary" onClick={handleImport}>
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportCsvModal