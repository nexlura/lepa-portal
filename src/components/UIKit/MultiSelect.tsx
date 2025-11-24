'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'

export interface MultiSelectOption {
    id: string
    name: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    selected: MultiSelectOption[]
    onChange: (selected: MultiSelectOption[]) => void
    placeholder?: string
    className?: string
    invalid?: boolean
    'aria-label'?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select options...',
    className,
    invalid,
    'aria-label': ariaLabel,
}: MultiSelectProps) {
    const handleRemove = (optionToRemove: MultiSelectOption, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(selected.filter((opt) => opt.id !== optionToRemove.id))
    }

    return (
        <Headless.Listbox value={selected} onChange={onChange} multiple>
            <div className="relative">
                <Headless.ListboxButton
                    aria-label={ariaLabel}
                    className={clsx(
                        // Basic layout
                        'relative block w-full appearance-none rounded-lg',
                        'py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
                        // Horizontal padding
                        'pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
                        // Typography
                        'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
                        // Border
                        'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
                        // Background color
                        'bg-transparent dark:bg-white/5',
                        // Hide default focus styles
                        'focus:outline-hidden',
                        // Invalid state
                        invalid && 'border-red-500 data-hover:border-red-500 dark:border-red-500 dark:data-hover:border-red-500',
                        // Disabled state
                        'data-disabled:border-zinc-950/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/2.5 dark:data-hover:data-disabled:border-white/15',
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                        {selected.length === 0 ? (
                            <span className="text-zinc-500">{placeholder}</span>
                        ) : (
                            selected.map((option) => (
                                <span
                                    key={option.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-sm"
                                >
                                    {option.name}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemove(option, e)}
                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg
                            className="size-5 stroke-zinc-500 sm:size-4 dark:stroke-zinc-400"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            fill="none"
                        >
                            <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </Headless.ListboxButton>
                <Headless.ListboxOptions
                    transition
                    anchor="bottom"
                    className={clsx(
                        // Anchor positioning
                        '[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(4)]',
                        // Base styles
                        'isolate scroll-py-1 rounded-xl p-1 select-none',
                        // Invisible border that is only visible in `forced-colors` mode
                        'outline outline-transparent focus:outline-hidden',
                        // Handle scrolling when menu won't fit in viewport
                        'overflow-y-scroll overscroll-contain max-h-60',
                        // Popover background
                        'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
                        // Shadows
                        'shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset',
                        // Transitions
                        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none',
                        // Ensure dropdown renders above modals/dialogs
                        'z-50 w-1/5'
                    )}
                >
                    {options.map((option) => (
                        <Headless.ListboxOption key={option.id} value={option} as={Fragment}>
                            {({ selected: isSelected }) => (
                                <div
                                    className={clsx(
                                        // Basic layout
                                        'group/option grid cursor-default grid-cols-[1fr_--spacing(5)] items-baseline gap-x-2 rounded-lg py-2.5 pr-2 pl-3.5 sm:grid-cols-[1fr_--spacing(4)] sm:py-1.5 sm:pr-2 sm:pl-3',
                                        // Typography
                                        'text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white',
                                        // Focus
                                        'outline-hidden data-focus:bg-blue-500 data-focus:text-white',
                                        // Disabled
                                        'data-disabled:opacity-50'
                                    )}
                                >
                                    <span>{option.name}</span>
                                    {isSelected && (
                                        <CheckIcon className="relative col-start-2 size-5 self-center stroke-current sm:size-4" />
                                    )}
                                </div>
                            )}
                        </Headless.ListboxOption>
                    ))}
                </Headless.ListboxOptions>
            </div>
        </Headless.Listbox>
    )
}


