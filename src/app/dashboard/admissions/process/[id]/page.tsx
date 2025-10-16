'use client'

import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import VerticalStepper from '@/components/Admissions/VerticalStepper'
import ApplicantTabs from '@/components/Admissions/ApplicantsTabs'

const ProcessApplicantPage = () => {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Process Applicant</h1>
                            <p className="mt-1 text-sm text-gray-500">Review and process admission application</p>
                        </div>
                        <Button plain onClick={() => router.back()}>
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Tabs */}
                    <ApplicantTabs />

                    {/* Right Column - Vertical Stepper */}
                    <VerticalStepper />
                </div>
            </div>
        </div>
    )
}

export default ProcessApplicantPage