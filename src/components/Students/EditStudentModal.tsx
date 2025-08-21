import { useEffect, useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '@/components/UIKit/Button'

export type EditStudentFormData = {
    fullName: string
    gender?: string
    dateOfBirth?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    grade?: string
    classSection?: string
    enrollmentDate?: string
    previousSchool?: string
    guardianName?: string
    guardianRelationship?: string
    guardianEmail?: string
    guardianPhone?: string
}

const EditStudentModal = ({ open, onClose, initialData, onSubmit }: {
    open: boolean
    onClose: (open: boolean) => void
    initialData: EditStudentFormData | null
    onSubmit: (data: EditStudentFormData) => void
}) => {
    const [form, setForm] = useState<EditStudentFormData>({ fullName: '' })
    const [errors, setErrors] = useState<Partial<Record<keyof EditStudentFormData, string>>>({})

    useEffect(() => {
        if (initialData) setForm(initialData)
    }, [initialData])

    const validate = () => {
        const next: Partial<Record<keyof EditStudentFormData, string>> = {}
        if (!form.fullName?.trim()) next.fullName = 'Full name is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return
        onSubmit(form)
        onClose(false)
    }

    return (
        <Dialog size="lg" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Update Student Record</DialogTitle>
            <DialogDescription>Complete or edit the student's information.</DialogDescription>
            <DialogBody>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Full Name</Label>
                        <Input
                            value={form.fullName}
                            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                            invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName ? <ErrorMessage>{errors.fullName}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Gender</Label>
                        <Input value={form.gender || ''} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Date of Birth</Label>
                        <Input type="date" value={form.dateOfBirth || ''} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                        <Input type="email" value={form.email || ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Phone</Label>
                        <Input type="tel" value={form.phone || ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Address</Label>
                        <Input value={form.address || ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">City</Label>
                        <Input value={form.city || ''} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">State</Label>
                        <Input value={form.state || ''} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Postal Code</Label>
                        <Input value={form.postalCode || ''} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} />
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Grade</Label>
                        <Input value={form.grade || ''} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Class/Section</Label>
                        <Input value={form.classSection || ''} onChange={(e) => setForm((f) => ({ ...f, classSection: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Enrollment Date</Label>
                        <Input type="date" value={form.enrollmentDate || ''} onChange={(e) => setForm((f) => ({ ...f, enrollmentDate: e.target.value }))} />
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Previous School</Label>
                        <Input value={form.previousSchool || ''} onChange={(e) => setForm((f) => ({ ...f, previousSchool: e.target.value }))} />
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Name</Label>
                        <Input value={form.guardianName || ''} onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Relationship</Label>
                        <Input value={form.guardianRelationship || ''} onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Email</Label>
                        <Input type="email" value={form.guardianEmail || ''} onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))} />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Phone</Label>
                        <Input type="tel" value={form.guardianPhone || ''} onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))} />
                    </Field>
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Save Changes</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditStudentModal 