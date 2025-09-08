'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { mockStudent } from '@/app/admin/admissions/process/[id]/page'

const admissionSteps = [
    { id: 1, name: 'Application Review', description: 'Review submitted application', completed: true },
    { id: 2, name: 'Document Verification', description: 'Verify required documents', completed: true },
    { id: 3, name: 'Interview', description: 'Conduct student interview', completed: false },
    { id: 5, name: 'Final Decision', description: 'Make admission decision', completed: false },
]

const VerticalStepper = () => {
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(3) // Currently on step 3

    const handleEnroll = () => {
        // Handle enrollment logic
        console.log('Enrolling student:', mockStudent.id)
        router.push('/admin/admissions')
    }

    const handleReject = () => {
        // Handle rejection logic
        console.log('Rejecting student:', mockStudent.id)
        router.push('/admin/admissions')
    }

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Admission Flow</h2>

                {/* Vertical Stepper */}
                <div className="relative">
                    {admissionSteps.map((step, index) => (
                        <div key={step.id} className="relative flex items-start">
                            {/* Connector Line */}
                            {index < admissionSteps.length - 1 && (
                                <div className={`absolute left-4 top-8 w-0.5 h-8 ${step.completed ? 'bg-green-200' : 'bg-gray-200'
                                    }`} />
                            )}

                            {/* Step Circle */}
                            <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                                ? 'bg-secondary-600 text-white'
                                : index === currentStep - 1
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step.completed ? (
                                    <CheckIcon className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>

                            {/* Step Content */}
                            <div className="ml-4 flex-1 min-w-0 pb-8">
                                <p className={`text-sm font-medium ${step.completed || index === currentStep - 1
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <Button
                        color="primary"
                        className="w-full"
                        onClick={handleEnroll}
                    >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Enroll Student
                    </Button>
                    <Button
                        outline
                        className="w-full"
                        onClick={handleReject}
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Reject Application
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default VerticalStepper