'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { MultiSelectOption } from '@/components/UIKit/MultiSelect'
import FormSubmitFeedback from '@/components/FormAlert'
import { FeedbackContext } from '@/context/feedback'
import { postModel, getModel } from '@/lib/connector'
import revalidatePage from '@/app/actions/revalidate-path'
import PersonalInfoForm from '@/components/Teachers/AddTeacher/PersonalinfoForm'
import AssignedTabs from '@/components/Teachers/AddTeacher/AssignedTabs'
import AddTeacherHeader from '@/components/Teachers/AddTeacher/Header'

export type AddTeacherForm = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    sex: string;
    subjects: MultiSelectOption[];
    assignedClasses: MultiSelectOption[];
}

export type AddTeacherFormErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    sex?: string;
}

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
        setFeedback({ status: 'success', text: 'Teacher added successfully!' })
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
        <div className="flex flex-col items-center space-y-8 sm:px-6">
            <AddTeacherHeader isLoading={isLoading} handleSubmit={handleSubmit} />

            {localError && (
                <div>
                    <FormSubmitFeedback msg={localError} />
                </div>
            )}

            <div className=' lg:w-10/12 xl:w-9/12 rounded-md border border-zinc-200 bg-white py-5'>

                <PersonalInfoForm
                    errors={errors}
                    firstNameInputRef={firstNameInputRef}
                    form={form}
                    handleSubmit={handleSubmit}
                    setForm={setForm}
                />
                <AssignedTabs
                    classes={classes}
                    form={form}
                    loadingClasses={loadingClasses}
                    setForm={setForm}
                />
            </div>

        </div>
    )
}

export default AddTeacherPage

