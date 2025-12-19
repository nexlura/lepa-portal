'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { FeedbackContext } from '@/context/feedback'
import FormSubmitFeedback from '@/components/FormAlert'
import { postFormData, getModel } from '@/lib/connector'
import AddStudentHeader from '@/components/Students/AddStudent/Header'
import PersonalInfoForm from '@/components/Students/AddStudent/PersonalInfoForm'
import AssignedClassTabs from '@/components/Students/AddStudent/AssignedClassTabs'
import { MultiSelectOption } from '@/components/UIKit/MultiSelect'

export type AddStudentForm = {
    firstName: string
    lastName: string
    middleName: string
    gender: string
    dateOfBirth: string
    address: string
    enrollmentDate: string
    assignedClass: MultiSelectOption | null
}

export type AddStudentFormErrors = Partial<Record<keyof AddStudentForm, string>>

const DEFAULT_FORM: AddStudentForm = {
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    assignedClass: null,
}

const NewStudentAdmissionPage = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const { setFeedback } = useContext(FeedbackContext)
    const firstNameInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState<AddStudentForm>(DEFAULT_FORM)
    const [errors, setErrors] = useState<AddStudentFormErrors>({})
    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [classes, setClasses] = useState<MultiSelectOption[]>([])
    const [loadingClasses, setLoadingClasses] = useState(false)

    type BackendClass = {
        id: string
        name: string
        grade: string
    }


    const validate = () => {
        const next: AddStudentFormErrors = {}
        if (!form.firstName.trim()) {
            next.firstName = 'First name is required'
            firstNameInputRef.current?.focus()
        }
        if (!form.lastName.trim()) {
            next.lastName = 'Last name is required'
        }
        if (!form.gender.trim()) next.gender = 'Gender is required'
        if (!form.dateOfBirth.trim()) {
            next.dateOfBirth = 'Date of birth is required'
        } else {
            const today = new Date().toISOString().split('T')[0]
            if (form.dateOfBirth >= today) {
                next.dateOfBirth = 'Date of birth cannot be current or future date'
            }
        }
        if (!form.enrollmentDate.trim()) next.enrollmentDate = 'Enrollment date is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSuccess = () => {
        setFeedback({ status: 'success', text: 'Student added successfully!' })
        router.push('/students/1')
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
            const formData = new FormData()
            formData.append('tenant_id', session.user.tenantId)
            formData.append('first_name', form.firstName.trim())
            formData.append('last_name', form.lastName.trim())
            formData.append('middle_name', form.middleName.trim())
            formData.append('sex', form.gender.trim())
            formData.append('date_of_birth', form.dateOfBirth)
            formData.append('enrollment_date', form.enrollmentDate)

            if (form.address) {
                formData.append('address', form.address.trim())
            }

            if (form.assignedClass) {
                formData.append('current_class_id', form.assignedClass.id)
            }

            const resp = await postFormData('/students', formData)

            if (resp && typeof resp === 'object' && 'error' in resp && resp.error) {
                setLocalError(resp.message || 'Something went wrong. Please try again')
                return
            }

            if (resp && typeof resp === 'object' && 'status' in resp && resp.status >= 200 && resp.status < 300) {
                handleSuccess()
                return
            }

            if (!resp || (resp && typeof resp === 'object' && !('error' in resp))) {
                handleSuccess()
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

    // Fetch classes once
    useEffect(() => {
        if (!loadingClasses && classes.length === 0) {
            setLoadingClasses(true)
            getModel<{ data?: { classes?: BackendClass[] } }>('/classes?page=1&limit=100')
                .then((res) => {
                    const serverClasses = res?.data?.classes
                    if (serverClasses && Array.isArray(serverClasses)) {
                        const classOptions: MultiSelectOption[] = serverClasses.map((cls) => ({
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


    return (
        <div className="flex flex-col items-center space-y-8 sm:px-6">
            <AddStudentHeader isLoading={isLoading} handleSubmit={handleSubmit} />

            {localError && (
                <div className="w-full lg:w-10/12 xl:w-9/12">
                    <FormSubmitFeedback msg={localError} />
                </div>
            )}

            <div className="lg:w-10/12 xl:w-9/12 rounded-md border border-zinc-200 bg-white py-5">
                <PersonalInfoForm
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    firstNameInputRef={firstNameInputRef}
                />
                <AssignedClassTabs
                    form={form}
                    setForm={setForm}
                    classes={classes}
                    loadingClasses={loadingClasses}
                />
            </div>
        </div>
    )
}

export default NewStudentAdmissionPage

