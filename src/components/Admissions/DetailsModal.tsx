'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { StudentRecord } from '@/app/dashboard/admissions/page'
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '../UIKit/Button'
import { useRouter } from 'next/navigation'

interface DetailsModalProps {
    showViewModal: boolean,
    setShowViewModal: (o: boolean) => void,
    viewTarget: StudentRecord | null,
    setViewTarget: (o: StudentRecord | null) => void
}

export default function DetailsModal({ viewTarget, showViewModal, setShowViewModal, setViewTarget }: DetailsModalProps) {
    const router = useRouter()

    const handleProcessApplicant = () => {
        if (viewTarget) {
            setShowViewModal(false)
            setViewTarget(null)
            router.push(`/dashboard/admissions/process/${viewTarget.id}`)
        }
    }

    return (
        <Dialog open={showViewModal} onClose={setShowViewModal} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 hidden bg-zinc-950/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:block"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                    <DialogPanel
                        transition
                        className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-3xl"
                    >
                        {viewTarget && (
                            <div className="relative flex flex-col w-full items-center rounded-lg overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                {/* close button */}
                                {/* <button
                                    type="button"
                                    onClick={() => setShowViewModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon aria-hidden="true" className="size-6" />
                                </button> */}
                                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                                    <div
                                        className="sm:col-span-8 lg:col-span-7"
                                    >
                                        <div className='flex flex-col gap-y-6'>

                                            {/* Top Right Photo */}
                                            <div className='flex items-center gap-x-5'>

                                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-semibold select-none">
                                                    {viewTarget.name?.split(' ').map(p => p[0]).slice(0, 2).join('') || 'A'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{viewTarget.name}</h3>
                                                    <p className="text-sm text-gray-500">Application ID: APL291</p>
                                                </div>
                                            </div>
                                            {/* Details Grid */}
                                            <div className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-5 border-1 border-gray-300 rounded-lg">
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Name</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.name || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Gender</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.gender || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Date of Birth</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.dateOfBirth || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Address</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.address || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Parent Name</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.guardianName || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Parent Contact</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.guardianPhone || '-'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4 lg:col-span-5">
                                        <div className='flex flex-col gap-y-6'>
                                            {/* Top Left Status */}
                                            <div className='flex items-center justify-end h-24'>

                                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 h-fit">
                                                    {viewTarget.status}
                                                </span>
                                            </div>
                                            <div className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-1 gap-4 px-4 py-5 border-1 border-gray-300 rounded-lg">
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Applying for Grade</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.grade || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Method of Applying</div>
                                                    <div className="text-sm text-gray-900">Batch Import</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs capitalize text-gray-500">Application Date</div>
                                                    <div className="text-sm text-gray-900">{viewTarget.enrollmentDate || '-'}</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='w-full mt-8 flex justify-end'>
                                    <Button color="primary" onClick={handleProcessApplicant}>
                                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                                        Process Applicant
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
