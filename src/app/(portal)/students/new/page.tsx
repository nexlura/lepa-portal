'use client'

import { FormEvent, useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { FeedbackContext } from '@/context/feedback'
import FormSubmitFeedback from '@/components/FormAlert'
import { postFormData } from '@/lib/connector'
import AddStudentHeader from '@/components/Students/AddStudent/Header'
import PersonalInfoForm from '@/components/Students/AddStudent/PersonalInfoForm'
import AssignedClassTabs from '@/components/Students/AddStudent/AssignedClassTabs'
import StudentAttachments from '@/components/Students/AddStudent/StudentAttachments'

import type { AddStudentForm, AddStudentFormErrors } from '@/components/Students/AddStudent/types'

const DEFAULT_FORM: AddStudentForm = {
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    assignedClass: null,
    attachments: [],
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
            // Step 1: Create student without attachments
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

            // Extract student ID from response
            let studentId: string | null = null
            if (resp && typeof resp === 'object') {
                // Try different possible response structures
                if ('data' in resp && resp.data && typeof resp.data === 'object') {
                    const data = resp.data as Record<string, unknown>
                    studentId = (data.id as string) || (data.student_id as string) || null
                } else {
                    const respObj = resp as Record<string, unknown>
                    if ('id' in respObj) {
                        studentId = respObj.id as string
                    } else if ('student_id' in respObj) {
                        studentId = respObj.student_id as string
                    }
                }
            }

            if (!studentId) {
                setLocalError('Failed to create student: Student ID not found in response')
                return
            }

            // Step 2: Upload attachments if any
            if (form.attachments.length > 0) {
                for (const attachment of form.attachments) {
                    const attachmentFormData = new FormData()
                    attachmentFormData.append('student_id', studentId)
                    attachmentFormData.append('file', attachment.file)
                    attachmentFormData.append('file_type', 'other')
                    attachmentFormData.append('file_name', attachment.fileName)

                    const attachmentResp = await postFormData('/students/attachments', attachmentFormData)

                    if (attachmentResp && typeof attachmentResp === 'object' && 'error' in attachmentResp && attachmentResp.error) {
                        setLocalError(`Failed to upload ${attachment.fileName}: ${attachmentResp.message || 'Upload failed'}`)
                        return
                    }
                }
            }

            handleSuccess()
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
                <StudentAttachments
                    form={form}
                    setForm={setForm}
                />
                <AssignedClassTabs
                    form={form}
                    setForm={setForm}
                />
            </div>
        </div>
    )
}

export default NewStudentAdmissionPage

