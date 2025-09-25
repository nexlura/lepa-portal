import { Dispatch, SetStateAction } from 'react'

import { Input } from '@/components/UIKit/Input'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Button } from '@/components/UIKit/Button'

type GuardianData = {
    guardianName: string;
    guardianRelationship: string;
    guardianPhone: string
    guardianAddress: string;
}

interface GuardianTabProps {
    guardianData: GuardianData
    setGuardianData: Dispatch<SetStateAction<GuardianData>>
}

const GuardianTab = ({ guardianData, setGuardianData }: GuardianTabProps) => {
    const handleSaveParent = () => {
        // Save personal data
        console.log('Saving parent data:', guardianData)
    }

    return (
        <form action={handleSaveParent}>
            <div className="border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900">Guardian Information</h2>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="guardian-name" className="block text-sm/6 font-medium text-gray-900">
                            Guardian Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="guardian-name"
                                name="guardian-name"
                                type="text"
                                value={guardianData.guardianName.split(' ')[0]}
                                autoComplete="guardian-name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="guardian-relationship" className="block text-sm/6 font-medium text-gray-900">
                            Guardian Relationship
                        </label>
                        <div className="mt-2">
                            <input
                                id="guardian-relationship"
                                name="guardian-relationship"
                                type="text"
                                value={guardianData.guardianRelationship.split(' ')[1]}
                                autoComplete="guardian-relationship"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="guardian-phone" className="block text-sm/6 font-medium text-gray-900">
                            Guardian Phone
                        </label>
                        <div className="mt-2">
                            <input
                                id="guardian-phone"
                                name="guardian-phone"
                                type="date"
                                value={guardianData.guardianPhone}
                                autoComplete="guardian-phone"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="guardian-address" className="block text-sm/6 font-medium text-gray-900">
                            Guardian Address
                        </label>
                        <div className="mt-2">
                            <input
                                id="guardian-address"
                                name="guardian-address"
                                value={guardianData.guardianAddress}
                                autoComplete="guardian-address"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">

                <Button
                    type="submit"
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                    Save
                </Button>
            </div>
        </form>
    )
}

export default GuardianTab