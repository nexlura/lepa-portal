import { ExclamationTriangleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import type { Dispatch, SetStateAction } from "react"

type BulkUploadResult = {
    successCount: number
    failureCount: number
    totalCount: number
    failedMessages: string[]
}

interface BulkUploadFeedbackProps {
    bulkResult: BulkUploadResult
    showBulkDetails: boolean
    setShowBulkDetails: Dispatch<SetStateAction<boolean>>
    setBulkResult: Dispatch<SetStateAction<BulkUploadResult | null>>
}

const BulkUploadFeedback = ({
    bulkResult,
    showBulkDetails,
    setShowBulkDetails,
    setBulkResult,
}: BulkUploadFeedbackProps) => {
    const message = `Upload completed with issues — ${bulkResult.successCount} student${
        bulkResult.successCount > 1 ? "s were" : " was"
    } created successfully.`

    return (
        <div className="flex rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
            <div>
                <div>
                    {bulkResult.successCount === 0 && bulkResult.failureCount === bulkResult.totalCount && (
                        <span className="flex font-medium text-red-700">
                            <span className="shrink-0">
                                <XCircleIcon aria-hidden="true" className="size-5 text-red-600 mr-2" />
                            </span>
                            Upload failed. All {bulkResult.totalCount} student
                            {bulkResult.totalCount === 1 ? '' : 's'} already exist or failed validation.
                        </span>
                    )}
                    {bulkResult.successCount > 0 && bulkResult.failureCount > 0 && (
                        <div className="flex font-medium space-y-0.5">
                            <span className="shrink-0">
                                <ExclamationTriangleIcon aria-hidden="true" className="size-5 text-amber-500 mr-2" />
                            </span>
                            <div className="text-sm font-medium text-amber-800">{message}</div>
                        </div>
                    )}
                </div>

                {bulkResult.failureCount > 0 && bulkResult.failedMessages.length > 0 && (
                    <div className="mt-2">
                        <button
                            type="button"
                            className="text-xs font-medium text-amber-700 hover:text-amber-900 underline"
                            onClick={() => setShowBulkDetails(prev => !prev)}
                        >
                            {showBulkDetails ? 'Hide failed rows' : `View (${bulkResult.failureCount}) failed rows`}
                        </button>
                        {showBulkDetails && (
                            <ul className="mt-2 list-disc list-inside text-xs text-gray-700 space-y-1">
                                {bulkResult.failedMessages.map((msg, idx) => (
                                    <li key={idx}>{msg}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                    <button
                        type="button"
                        className="inline-flex rounded-md bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 focus-visible:outline-hidden"
                        onClick={() => setBulkResult(null)}
                    >
                        <span className="sr-only">Dismiss</span>
                        <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export type { BulkUploadResult }
export default BulkUploadFeedback


