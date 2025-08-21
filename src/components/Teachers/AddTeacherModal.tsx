import { useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'

const AddTeacherModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onSubmit: (data: {
        name: string
        email: string
        subject: string
        phone?: string
        department?: string
    }) => void
}) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        phone: '',
        department: '',
    })
    const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string }>({})

    const validate = () => {
        const next: { name?: string; email?: string; subject?: string } = {}
        if (!form.name.trim()) next.name = 'Teacher name is required'
        if (!form.email.trim()) next.email = 'Email is required'
        if (!form.subject.trim()) next.subject = 'Subject is required'

        // Basic email validation
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            next.email = 'Please enter a valid email address'
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return
        onSubmit(form)
        // Reset form
        setForm({ name: '', email: '', subject: '', phone: '', department: '' })
        setErrors({})
    }

    const handleClose = () => {
        onClose(false)
        // Reset form
        setForm({ name: '', email: '', subject: '', phone: '', department: '' })
        setErrors({})
    }

    return (
        <Dialog size="md" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Add a Teacher</DialogTitle>
            <DialogDescription>Provide details for the new teacher.</DialogDescription>
            <DialogBody>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Full Name</Label>
                        <Input
                            placeholder="e.g., Dr. Emily Wilson"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                        <Input
                            type="email"
                            placeholder="e.g., emily.wilson@lepa.edu"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Subject</Label>
                        <Input
                            placeholder="e.g., Mathematics"
                            value={form.subject}
                            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                            invalid={Boolean(errors.subject)}
                        />
                        {errors.subject ? <ErrorMessage>{errors.subject}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Department</Label>
                        <Input
                            placeholder="e.g., STEM"
                            value={form.department}
                            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                        />
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Phone Number</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                    </Field>
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={handleClose}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                >
                    Add Teacher
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTeacherModal 