import { Dispatch, SetStateAction } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from "@heroicons/react/24/outline"
interface TableControlsProps {
    searchInput: React.ReactNode
    genderOptions: string[]
    genderFilter: string
    setGenderFilter: Dispatch<SetStateAction<string>>
}

const StudentTableControls = ({
    searchInput,
    genderFilter,
    genderOptions,
    setGenderFilter
}: TableControlsProps) => {
    return (
        <div className='flex justify-between items-center mb-6'>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
                All Students
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* SEARCH INPUT */}
                {searchInput}

                <div className=''>
                    <Menu as="div" className="relative inline-block">
                        <MenuButton className="w-48 capitalize inline-flex justify-between gap-x-1.5 rounded-md bg-gray-100 border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 shadow-xs hover:bg-gray-200">
                            {genderFilter}
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                {genderOptions.map(opt => (
                                    <MenuItem key={opt}
                                    >
                                        <a type="button"
                                            className="capitalize w-full inline-flex justify-between px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                            onClick={() => setGenderFilter(opt)}
                                        >
                                            {opt}
                                            {opt === genderFilter && (<CheckIcon className="size-5 " />)}
                                        </a>
                                    </MenuItem>
                                ))}

                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default StudentTableControls
