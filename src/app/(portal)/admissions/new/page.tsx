'use client'

import { FormEvent, useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { FeedbackContext } from '@/context/feedback'
import FormSubmitFeedback from '@/components/FormAlert'
import { postModel } from '@/lib/connector'
import AddStudentHeader from '@/components/Students/AddStudent/Header'
import PersonalInfoForm from '@/components/Students/AddStudent/PersonalInfoForm'


export type AddStudentForm = {
    firstName: string
    lastName: string
    middleName: string
    gender: string
    dateOfBirth: string
    address: string
    enrollmentDate: string
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
        if (!form.dateOfBirth.trim()) next.dateOfBirth = 'Date of birth is required'
        if (!form.enrollmentDate.trim()) next.enrollmentDate = 'Enrollment date is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSuccess = () => {
        setFeedback({ status: 'success', text: 'Student added successfully!' })
        setForm(DEFAULT_FORM)
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
            const postData = {
                tenant_id: session.user.tenantId,
                first_name: form.firstName.trim(),
                last_name: form.lastName.trim(),
                middle_name: form.middleName.trim(),
                gender: form.gender.trim(),
                date_of_birth: form.dateOfBirth,
                ...(form.address && { address: form.address.trim() }),
                enrollment_date: form.enrollmentDate,
            }

            const resp = await postModel('/students', postData)

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
            </div>
        </div>
    )
}

export default NewStudentAdmissionPage

