'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/UIKit/Button'
import { MultiSelect, MultiSelectOption } from '@/components/UIKit/MultiSelect'
import FormSubmitFeedback from '@/components/FormAlert'
import { FeedbackContext } from '@/context/feedback'
import { useSession } from 'next-auth/react'
import { postModel, getModel } from '@/lib/connector'
import revalidatePage from '@/app/actions/revalidate-path'
import clsx from 'clsx'
import PersonalInfoForm from '@/components/Teachers/PersonalinfoForm'

const SUBJECT_OPTIONS: MultiSelectOption[] = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'literature', name: 'Literature' },
    { id: 'art', name: 'Art' },
    { id: 'music', name: 'Music' },
    { id: 'physical_education', name: 'Physical Education' },
    { id: 'computer_science', name: 'Computer Science' },
]

const ASSIGNMENT_TABS = [
    { id: 'subjects', label: 'Assigned Subjects', description: 'Choose all subjects this teacher can cover.' },
    { id: 'classes', label: 'Assigned Classes', description: 'Pick the classes or grades they belong to.' },
] as const

type AssignmentTab = (typeof ASSIGNMENT_TABS)[number]['id']

type BackendClass = {
    id: string
    name: string
    grade: string
}

const DEFAULT_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    sex: '',
    subjects: [] as MultiSelectOption[],
    assignedClasses: [] as MultiSelectOption[],
}

const AddTeacherPage = () => {
    const router = useRouter()
    const firstNameInputRef = useRef<HTMLInputElement>(null)
    const { setFeedback } = useContext(FeedbackContext)
    const { data: session } = useSession()

    const [form, setForm] = useState(DEFAULT_FORM)
    const [errors, setErrors] = useState<{
        firstName?: string
        lastName?: string
        email?: string
        phone?: string
        password?: string
        sex?: string
    }>({})
    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [classes, setClasses] = useState<MultiSelectOption[]>([])
    const [loadingClasses, setLoadingClasses] = useState(false)
    const [activeTab, setActiveTab] = useState<AssignmentTab>('subjects')

    // Fetch classes once
    useEffect(() => {
        if (!loadingClasses && classes.length === 0) {
            setLoadingClasses(true)
            getModel('/classes?page=1&limit=100')
                .then((res) => {
                    if (res && res.data?.classes) {
                        const classOptions: MultiSelectOption[] = res.data.classes.map((cls: BackendClass) => ({
                            id: cls.id,
                            name: `${cls.name} (${cls.grade})`,
                        }))
                        setClasses(classOptions)
                    }
                })
                .catch((err) => {
                    console.error('Error fetching classes:', err)
                })
                .finally(() => {
                    setLoadingClasses(false)
                })
        }
    }, [classes.length, loadingClasses])

    const resetForm = () => {
        setForm(DEFAULT_FORM)
        setErrors({})
        setLocalError(null)
    }

    const validate = () => {
        const next: typeof errors = {}
        if (!form.firstName.trim()) {
            next.firstName = 'First name is required'
            firstNameInputRef.current?.focus()
        }
        if (!form.lastName.trim()) {
            next.lastName = 'Last name is required'
        }
        if (!form.email.trim()) {
            next.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            next.email = 'Please enter a valid email address'
        }
        if (!form.phone.trim()) {
            next.phone = 'Phone number is required'
        } else if (form.phone.length < 10 || form.phone.length > 15) {
            next.phone = 'Phone number must be between 10 and 15 characters'
        }
        if (!form.password.trim()) {
            next.password = 'Password is required'
        } else if (form.password.length < 6) {
            next.password = 'Password must be at least 6 characters'
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleVerificationSuccess = () => {
        revalidatePage('/teachers/1')
        setFeedback({ status: 'success', text: 'Teacher added successfully!' })
        resetForm()
        router.push('/teachers/1')
    }

    const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        if (!validate()) return

        if (!session?.user?.tenantId) {
            setLocalError('Session error: tenant ID not found')
            return
        }

        setLocalError(null)
        setIsLoading(true)

        try {
            const postData = {
                tenant_id: session.user.tenantId,
                first_name: form.firstName.trim(),
                last_name: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                password: form.password,
                ...(form.address.trim() && { address: form.address.trim() }),
                ...(form.sex && { sex: form.sex }),
                ...(form.subjects.length > 0 && { subjects: form.subjects.map((s) => s.id) }),
                ...(form.assignedClasses.length > 0 && { assigned_classes: form.assignedClasses.map((c) => c.id) }),
            }

            const resp = await postModel('/teachers', postData)

            if (resp && typeof resp === 'object' && 'error' in resp && resp.error) {
                setLocalError(resp.message || 'Something went wrong. Please try again')
                return
            }

            if (resp && typeof resp === 'object' && 'status' in resp && resp.status >= 200 && resp.status < 300) {
                handleVerificationSuccess()
                return
            }

            if (!resp || (resp && typeof resp === 'object' && !('error' in resp))) {
                handleVerificationSuccess()
                return
            }

            setLocalError('Something went wrong. Please try again')
        } catch (error) {
            console.error('Error during POST request:', error)
            setLocalError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 sm:px-6">
            <div className="w-9/12 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">Add a new teacher</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Add personal information and teaching responsibilities in one place.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button type="button" plain onClick={() => router.push('/teachers/1')}>
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" data-disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Teacher'}
                    </Button>
                </div>
            </div>

            {localError && (
                <div>
                    <FormSubmitFeedback msg={localError} />
                </div>
            )}

            <PersonalInfoForm
                errors={errors}
                firstNameInputRef={firstNameInputRef}
                form={form}
                handleSubmit={handleSubmit}
                setForm={setForm}
            />

            <section className="w-9/12  rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-zinc-100 px-6 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
                    <p className="text-sm text-gray-500">
                        Use tabs to toggle between subjects and classes when setting responsibilities.
                    </p>
                    <div className="mt-4 flex gap-4">
                        {ASSIGNMENT_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    'border-b-2 pb-2 text-sm font-medium transition-all',
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-900'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-6 pb-6 pt-4">
                    {ASSIGNMENT_TABS.map((tab) => {
                        const isSubjects = tab.id === 'subjects'
                        const isActive = activeTab === tab.id
                        if (!isActive) {
                            return null
                        }
                        return (
                            <div key={tab.id} className="space-y-4">
                                <p className="text-sm text-gray-500">{tab.description}</p>
                                {isSubjects ? (
                                    <MultiSelect
                                        options={SUBJECT_OPTIONS}
                                        selected={form.subjects}
                                        onChange={(selected) => setForm((f) => ({ ...f, subjects: selected }))}
                                        placeholder="Select subjects..."
                                        aria-label="Assign subjects"
                                    />
                                ) : (
                                    <MultiSelect
                                        options={classes}
                                        selected={form.assignedClasses}
                                        onChange={(selected) => setForm((f) => ({ ...f, assignedClasses: selected }))}
                                        placeholder={loadingClasses ? 'Loading classes...' : 'Select classes...'}
                                        aria-label="Assign classes"
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default AddTeacherPage

