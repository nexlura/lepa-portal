'use client'

import { Dispatch, FormEvent, RefObject, SetStateAction } from 'react'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import type { AddStudentForm, AddStudentFormErrors } from '@/components/Students/AddStudent/types'

interface PersonalInfoFormProps {
    form: AddStudentForm
    setForm: Dispatch<SetStateAction<AddStudentForm>>
    errors: AddStudentFormErrors
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>
    firstNameInputRef: RefObject<HTMLInputElement | null>
}

const PersonalInfoForm = ({ form, setForm, errors, handleSubmit, firstNameInputRef }: PersonalInfoFormProps) => {
    return (
        <section className="px-6">
            <div>
                <p className="mt-1 text-sm text-gray-500">
                    Start with the student&apos;s core identity information.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-12">
                <Field className="sm:col-span-6">
                    <Label>First Name *</Label>
                    <Input
                        ref={firstNameInputRef}
                        placeholder="e.g., Amina"
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        invalid={Boolean(errors.firstName)}
                    />
                    {errors.firstName ? <ErrorMessage>{errors.firstName}</ErrorMessage> : null}
                </Field>
                <Field className="sm:col-span-6">
                    <Label>Last Name *</Label>
                    <Input
                        placeholder="e.g., Marrah"
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        invalid={Boolean(errors.lastName)}
                    />
                    {errors.lastName ? <ErrorMessage>{errors.lastName}</ErrorMessage> : null}
                </Field>
                <Field className="sm:col-span-4">
                    <Label>Middle Name </Label>
                    <Input
                        placeholder="e.g., James"
                        value={form.middleName}
                        onChange={(e) => setForm((f) => ({ ...f, middleName: e.target.value }))}
                        invalid={Boolean(errors.middleName)}
                    />
                </Field>
                <Field className="sm:col-span-4">
                    <Label>Gender *</Label>
                    <Input
                        placeholder="e.g., Female"
                        value={form.gender}
                        onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                        invalid={Boolean(errors.gender)}
                    />
                    {errors.gender ? <ErrorMessage>{errors.gender}</ErrorMessage> : null}
                </Field>
                <Field className="sm:col-span-4">
                    <Label>Date of Birth *</Label>
                    <Input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                        invalid={Boolean(errors.dateOfBirth)}
                    />
                    {errors.dateOfBirth ? <ErrorMessage>{errors.dateOfBirth}</ErrorMessage> : null}
                </Field>
                <Field className="sm:col-span-8">
                    <Label>Address </Label>
                    <Input
                        placeholder="e.g., 19 James Street, Freetown"
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        invalid={Boolean(errors.middleName)}
                    />
                </Field>
                <Field className="sm:col-span-4">
                    <Label>Enrollment Date </Label>
                    <Input
                        type="date"
                        value={form.enrollmentDate}
                        onChange={(e) => setForm((f) => ({ ...f, enrollmentDate: e.target.value }))}
                        invalid={Boolean(errors.enrollmentDate)}
                    />
                </Field>
            </form>
        </section>
    )
}

export default PersonalInfoForm

