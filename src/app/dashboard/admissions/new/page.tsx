'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '@/components/UIKit/Button'

export type AdmissionFormData = {
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

export default function NewStudentAdmissionPage() {
    const router = useRouter()
    const [form, setForm] = useState<AdmissionFormData>({
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

    const [errors, setErrors] = useState<Partial<Record<keyof AdmissionFormData, string>>>({})

    const validate = () => {
        const next: Partial<Record<keyof AdmissionFormData, string>> = {}
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        // TODO: persist to backend when available
        router.push('/dashboard/students/admissions')
    }

    return (
        <div className="space-y-8 pb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Student Admission</h1>
                    <p className="mt-1 text-sm text-gray-500">Fill out the form below to admit a new student.</p>
                </div>
                <div className="flex gap-3">
                    <Button plain onClick={() => router.back()}>Cancel</Button>
                    <Button color="primary" type="submit">Submit Admission</Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <section className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                            <Field className="sm:col-span-2">
                                <Label className="text-sm/6 text-gray-900 font-medium">Full Name</Label>
                                <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} invalid={Boolean(errors.fullName)} />
                                {errors.fullName ? <ErrorMessage>{errors.fullName}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Gender</Label>
                                <Input value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} invalid={Boolean(errors.gender)} />
                                {errors.gender ? <ErrorMessage>{errors.gender}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Date of Birth</Label>
                                <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} invalid={Boolean(errors.dateOfBirth)} />
                                {errors.dateOfBirth ? <ErrorMessage>{errors.dateOfBirth}</ErrorMessage> : null}
                            </Field>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} invalid={Boolean(errors.email)} />
                                {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Phone</Label>
                                <Input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                            </Field>
                            <Field className="sm:col-span-2">
                                <Label className="text-sm/6 text-gray-900 font-medium">Address</Label>
                                <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">City</Label>
                                <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">State</Label>
                                <Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Postal Code</Label>
                                <Input value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} />
                            </Field>
                        </div>
                    </div>
                </section>

                {/* Enrollment Details */}
                <section className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Enrollment Details</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Grade</Label>
                                <Input value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} invalid={Boolean(errors.grade)} />
                                {errors.grade ? <ErrorMessage>{errors.grade}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Class/Section</Label>
                                <Input value={form.classSection} onChange={(e) => setForm((f) => ({ ...f, classSection: e.target.value }))} />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Enrollment Date</Label>
                                <Input type="date" value={form.enrollmentDate} onChange={(e) => setForm((f) => ({ ...f, enrollmentDate: e.target.value }))} invalid={Boolean(errors.enrollmentDate)} />
                                {errors.enrollmentDate ? <ErrorMessage>{errors.enrollmentDate}</ErrorMessage> : null}
                            </Field>
                            <Field className="sm:col-span-2">
                                <Label className="text-sm/6 text-gray-900 font-medium">Previous School</Label>
                                <Input value={form.previousSchool} onChange={(e) => setForm((f) => ({ ...f, previousSchool: e.target.value }))} />
                            </Field>
                        </div>
                    </div>
                </section>

                {/* Guardian Information */}
                <section className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                            <Field className="sm:col-span-2">
                                <Label className="text-sm/6 text-gray-900 font-medium">Guardian Name</Label>
                                <Input value={form.guardianName} onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))} invalid={Boolean(errors.guardianName)} />
                                {errors.guardianName ? <ErrorMessage>{errors.guardianName}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Relationship</Label>
                                <Input value={form.guardianRelationship} onChange={(e) => setForm((f) => ({ ...f, guardianRelationship: e.target.value }))} />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Guardian Email</Label>
                                <Input type="email" value={form.guardianEmail} onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))} invalid={Boolean(errors.guardianEmail)} />
                                {errors.guardianEmail ? <ErrorMessage>{errors.guardianEmail}</ErrorMessage> : null}
                            </Field>
                            <Field>
                                <Label className="text-sm/6 text-gray-900 font-medium">Guardian Phone</Label>
                                <Input type="tel" value={form.guardianPhone} onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))} invalid={Boolean(errors.guardianPhone)} />
                                {errors.guardianPhone ? <ErrorMessage>{errors.guardianPhone}</ErrorMessage> : null}
                            </Field>
                        </div>
                    </div>
                </section>


            </form>
        </div>
    )
} 