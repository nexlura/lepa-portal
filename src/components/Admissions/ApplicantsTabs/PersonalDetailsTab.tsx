import { Dispatch, SetStateAction } from 'react'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/UIKit/Button';

type PersonalData = {
    name: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    grade: string;
    classSection: string;
    previousSchool: string;
}

interface PersonalDetsTabProps {
    personalData: PersonalData
    setPersonalData: Dispatch<SetStateAction<PersonalData>>
}

const genders = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
]

const PersonalDetailsTab = ({ personalData, setPersonalData }: PersonalDetsTabProps) => {



    const handleSavePersonal = () => {
        // Save personal data
        console.log('Saving personal data:', personalData)
    }

    return (
        <form>
            <div className="border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900">Personal Details</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                        <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                            Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">
                            <UserCircleIcon aria-hidden="true" className="size-16 text-gray-300" />
                            <button
                                type="button"
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                value={personalData.name.split(' ')[0]}
                                autoComplete="first-name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2">
                            <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                value={personalData.name.split(' ')[1]}
                                autoComplete="family-name"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="date-of-birth" className="block text-sm/6 font-medium text-gray-900">
                            Date of Birth
                        </label>
                        <div className="mt-2">
                            <input
                                id="date-of-birth"
                                name="date-of-birth"
                                type="date"
                                value={personalData.dateOfBirth}
                                autoComplete="date-of-birth"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <fieldset>
                            <legend className="">Gender</legend>

                            <div className="mt-4 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                {genders.map((gender) => (
                                    <div key={gender.id} className="flex items-center">
                                        <input
                                            defaultChecked={gender.id === personalData.gender}
                                            id={gender.id}
                                            name="notification-method"
                                            type="radio"
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                        />
                                        <label htmlFor={gender.id} className="ml-3 block text-sm/6 font-medium text-gray-900">
                                            {gender.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                    <div className="sm:col-span-4">
                        <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">
                            Address
                        </label>
                        <div className="mt-2">
                            <input
                                id="address"
                                name="address"
                                autoComplete="address"
                                value={personalData.address}
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

export default PersonalDetailsTab