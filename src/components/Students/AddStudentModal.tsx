import { useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '@/components/UIKit/Button'

export type AddStudentFormData = {
    fullName: string
    gender: string
    dateOfBirth: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    grade: string
    classSection?: string
    enrollmentDate: string
    previousSchool?: string
    guardianName: string
    guardianRelationship?: string
    guardianEmail?: string
    guardianPhone: string
}

const AddStudentModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onSubmit: (data: AddStudentFormData) => void
}) => {
    const [form, setForm] = useState<AddStudentFormData>({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        grade: '',
        classSection: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        previousSchool: '',
        guardianName: '',
        guardianRelationship: '',
        guardianEmail: '',
        guardianPhone: '',
    })

    const [errors, setErrors] = useState<Partial<Record<keyof AddStudentFormData, string>>>({})

    const validate = () => {
        const next: Partial<Record<keyof AddStudentFormData, string>> = {}
        if (!form.fullName.trim()) next.fullName = 'Full name is required'
        if (!form.gender.trim()) next.gender = 'Gender is required'
        if (!form.dateOfBirth.trim()) next.dateOfBirth = 'Date of birth is required'
        if (!form.grade.trim()) next.grade = 'Grade is required'
        if (!form.enrollmentDate.trim()) next.enrollmentDate = 'Enrollment date is required'
        if (!form.guardianName.trim()) next.guardianName = 'Guardian name is required'
        if (!form.guardianPhone.trim()) next.guardianPhone = 'Guardian phone is required'

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            next.email = 'Enter a valid email address'
        }
        if (form.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) {
            next.guardianEmail = 'Enter a valid email address'
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return
        onSubmit(form)
        handleClose()
    }

    const handleClose = () => {
        onClose(false)
        setForm({
            fullName: '',
            gender: '',
            dateOfBirth: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            grade: '',
            classSection: '',
            enrollmentDate: new Date().toISOString().split('T')[0],
            previousSchool: '',
            guardianName: '',
            guardianRelationship: '',
            guardianEmail: '',
            guardianPhone: '',
        })
        setErrors({})
    }

    return (
        <Dialog size="lg" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Admit a Student</DialogTitle>
            <DialogDescription>Provide full details to admit a new student.</DialogDescription>
            <DialogBody>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    {/* Personal */}
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Full Name</Label>
                        <Input
                            placeholder="e.g., Johnathan Doe"
                            value={form.fullName}
                            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                            invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName ? <ErrorMessage>{errors.fullName}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Gender</Label>
                        <Input
                            placeholder="e.g., Male/Female/Other"
                            value={form.gender}
                            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                            invalid={Boolean(errors.gender)}
                        />
                        {errors.gender ? <ErrorMessage>{errors.gender}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Date of Birth</Label>
                        <Input
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                            invalid={Boolean(errors.dateOfBirth)}
                        />
                        {errors.dateOfBirth ? <ErrorMessage>{errors.dateOfBirth}</ErrorMessage> : null}
                    </Field>

                    {/* Contact */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                        <Input
                            type="email"
                            placeholder="e.g., john.doe@example.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Phone</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Address</Label>
                        <Input
                            placeholder="Street address"
                            value={form.address}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">City</Label>
                        <Input
                            value={form.city}
                            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">State</Label>
                        <Input
                            value={form.state}
                            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Postal Code</Label>
                        <Input
                            value={form.postalCode}
                            onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                        />
                    </Field>

                    {/* Enrollment */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Grade</Label>
                        <Input
                            placeholder="e.g., Grade 10"
                            value={form.grade}
                            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                            invalid={Boolean(errors.grade)}
                        />
                        {errors.grade ? <ErrorMessage>{errors.grade}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Class/Section</Label>
                        <Input
                            placeholder="e.g., A"
                            value={form.classSection}
                            onChange={(e) => setForm((f) => ({ ...f, classSection: e.target.value }))}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Enrollment Date</Label>
                        <Input
                            type="date"
                            value={form.enrollmentDate}
                            onChange={(e) => setForm((f) => ({ ...f, enrollmentDate: e.target.value }))}
                            invalid={Boolean(errors.enrollmentDate)}
                        />
                        {errors.enrollmentDate ? <ErrorMessage>{errors.enrollmentDate}</ErrorMessage> : null}
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Previous School</Label>
                        <Input
                            placeholder="e.g., Springfield High School"
                            value={form.previousSchool}
                            onChange={(e) => setForm((f) => ({ ...f, previousSchool: e.target.value }))}
                        />
                    </Field>

                    {/* Guardian */}
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Name</Label>
                        <Input
                            placeholder="e.g., Jane Doe"
                            value={form.guardianName}
                            onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))}
                            invalid={Boolean(errors.guardianName)}
                        />
                        {errors.guardianName ? <ErrorMessage>{errors.guardianName}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Relationship</Label>
                        <Input
                            placeholder="e.g., Mother/Father/Guardian"
                            value={form.guardianRelationship}
                            onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Email</Label>
                        <Input
                            type="email"
                            placeholder="e.g., jane.doe@example.com"
                            value={form.guardianEmail}
                            onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))}
                            invalid={Boolean(errors.guardianEmail)}
                        />
                        {errors.guardianEmail ? <ErrorMessage>{errors.guardianEmail}</ErrorMessage> : null}
                    </Field>
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Guardian Phone</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 987-6543"
                            value={form.guardianPhone}
                            onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
                            invalid={Boolean(errors.guardianPhone)}
                        />
                        {errors.guardianPhone ? <ErrorMessage>{errors.guardianPhone}</ErrorMessage> : null}
                    </Field>
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={handleClose}>Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>Admit Student</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddStudentModal 