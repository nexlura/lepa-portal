'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

type Option = {
    id: string, name: string
}

interface SelectMenuProps {
    options: Option[]
    selected: Option
    setSelected: (args: Option) => void
}

export default function SelectMenu({ options, selected, setSelected }: SelectMenuProps) {

    return (
        <Listbox value={selected} onChange={setSelected} >
            <div className="relative mt-3">
                <ListboxButton
                    className={clsx(
                        'relative block w-full appearance-none rounded-lg text-left',
                        'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2)-1px)]',
                        'sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(2)-1px)]',
                        'text-base/6 text-zinc-950 placeholder:text-zinc-400 sm:text-sm/6',
                        'border border-zinc-950/15 data-hover:border-zinc-950/20',
                        'bg-transparent focus:outline-hidden',
                        'data-invalid:border-red-500 data-invalid:data-hover:border-red-500',
                        'data-disabled:border-zinc-950/20 shadow-xs capitalize'
                    )}
                >
                    <span className="truncate pr-6">{selected?.name}</span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 sm:size-4 dark:text-gray-400"
                    />
                </ListboxButton>


                <ListboxOptions
                    transition
                    className="absolute capitalize z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.id}
                            value={option}
                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-primary-600 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-primary-500"
                        >
                            <span className="block truncate font-normal group-data-selected:font-semibold">{option.name}</span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 group-not-data-selected:hidden group-data-focus:text-white dark:text-primary-400">
                                <CheckIcon aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}
