import { Dispatch, FormEvent, RefObject, SetStateAction } from 'react'

import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Listbox, ListboxOption } from '@/components/UIKit/listbox'
import { AddTeacherForm, AddTeacherFormErrors } from '@/app/(portal)/teachers/new/page'

interface PersonalInfoFormProps {
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>
    firstNameInputRef: RefObject<HTMLInputElement | null>
    form: AddTeacherForm
    setForm: Dispatch<SetStateAction<AddTeacherForm>>
    errors: AddTeacherFormErrors
}

const SEX_OPTIONS = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
    { id: 'other', name: 'Other' },
]

const PersonalInfoForm = ({
    handleSubmit,
    firstNameInputRef,
    form,
    setForm,
    errors
}: PersonalInfoFormProps) => {
    return (
        <div className="grid gap-6  ">
            <section className="px-6">
                <div>
                    <p className="mt-1 text-sm text-gray-500">
                        Fill out personal information .
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <Field className='sm:col-span-6'>
                        <Label>First Name *</Label>
                        <Input
                            ref={firstNameInputRef}
                            placeholder="e.g., Emily"
                            value={form.firstName}
                            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                            invalid={Boolean(errors.firstName)}
                        />
                        {errors.firstName ? <ErrorMessage>{errors.firstName}</ErrorMessage> : null}
                    </Field>

                    <Field className='sm:col-span-6'>
                        <Label>Last Name *</Label>
                        <Input
                            placeholder="e.g., Wilson"
                            value={form.lastName}
                            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                            invalid={Boolean(errors.lastName)}
                        />
                        {errors.lastName ? <ErrorMessage>{errors.lastName}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-6">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            placeholder="e.g., emily.wilson@lepa.edu"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                    </Field>

                    <Field className='sm:col-span-6'>
                        <Label>Phone Number *</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            invalid={Boolean(errors.phone)}
                        />
                        {errors.phone ? <ErrorMessage>{errors.phone}</ErrorMessage> : null}
                    </Field>
                    <Field className='sm:col-span-4'>
                        <Label>Sex</Label>
                        <Listbox
                            value={form.sex}
                            onChange={(value) => setForm((f) => ({ ...f, sex: value }))}
                            placeholder="Select sex"
                            invalid={Boolean(errors.sex)}
                        >
                            {SEX_OPTIONS.map((option) => (
                                <ListboxOption key={option.id} value={option.id}>
                                    {option.name}
                                </ListboxOption>
                            ))}
                        </Listbox>
                        {errors.sex ? <ErrorMessage>{errors.sex}</ErrorMessage> : null}
                    </Field>

                    <Field className='sm:col-span-4'>
                        <Label>Address</Label>
                        <Input
                            placeholder="e.g., 123 Main St, City, State"
                            value={form.address}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        />
                    </Field>
                    <Field className='sm:col-span-4'>
                        <Label>Password *</Label>
                        <Input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            invalid={Boolean(errors.password)}
                        />
                        {errors.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                    </Field>
                </form>
            </section>
        </div>
    )
}

export default PersonalInfoForm