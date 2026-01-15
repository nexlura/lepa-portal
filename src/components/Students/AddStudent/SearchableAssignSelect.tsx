'use client'

import { useMemo, useState, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChevronUpIcon, ChevronDownIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

import { MultiSelectOption } from '@/components/UIKit/MultiSelect'

interface SearchableAssignSelectProps {
    placeholder?: string
    options: MultiSelectOption[]
    selected: MultiSelectOption[]
    loading?: boolean
    onChange: (next: MultiSelectOption[]) => void
    emptyLabel?: string
}

export default function SearchableAssignSelect({
    placeholder = 'Search…',
    options,
    selected,
    loading,
    onChange,
    emptyLabel = 'No matches found',
}: SearchableAssignSelectProps) {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter((option) => option.name.toLowerCase().includes(q))
    }, [options, query])

    const toggleOption = (option: MultiSelectOption) => {
        const exists = selected.some((item) => item.id === option.id)
        if (exists) {
            onChange(selected.filter((item) => item.id !== option.id))
        } else {
            // For single selection, replace the array with just this option
            onChange([option])
        }
        setQuery('')
        setOpen(false)
    }

    const removeSelection = (optionId: string) => {
        onChange(selected.filter((item) => item.id !== optionId))
    }

    // Close dropdown if clicking outside
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
            setOpen(false)
        }
    }

    return (
        <div ref={containerRef} onBlur={handleBlur} className="space-y-4 relative">
            <div className="relative">
                {/* SEARCH FIELD */}
                {selected.length < 1 && (
                <label className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 rounded-md border">
                    <MagnifyingGlassIcon className="size-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-zinc-400 focus:outline-none"
                        value={query}
                        onFocus={() => {
                            setOpen(true)
                            setHighlightedIndex(0)
                        }}
                        onChange={(event) => {
                            setQuery(event.target.value)
                            setOpen(true)
                            setHighlightedIndex(0)
                        }}
                    />
                    {open ? <ChevronUpIcon className="size-4 text-zinc-400" /> : <ChevronDownIcon className="size-4 text-zinc-400" />}
                </label>
                )}

                {/* OPTIONS DROPDOWN */}
                {open && (
                    <div className="absolute top-10 z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-sm">
                        {loading ? (
                            <p className="px-2 py-6 text-center text-sm text-gray-500">Loading options…</p>
                        ) : filteredOptions.length === 0 ? (
                            <p className="px-2 py-6 text-center text-sm text-gray-500">{emptyLabel}</p>
                        ) : (
                            <ul className="space-y-1 px-2 py-2">
                                {filteredOptions.slice(0, 5).map((option, index) => {
                                    const isSelected = selected.some((item) => item.id === option.id)
                                    return (
                                        <li key={option.id}>
                                            <button
                                                type="button"
                                                onClick={() => toggleOption(option)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                className={clsx(
                                                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                                                    isSelected
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : highlightedIndex === index
                                                            ? 'bg-zinc-200'
                                                            : 'hover:bg-zinc-100'
                                                )}
                                            >
                                                <span>{option.name}</span>
                                                {isSelected && (
                                                    <span className="text-xs font-medium text-blue-600">Selected</span>
                                                )}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                )}

                {/* SELECTED TAGS */}
                <div className="mt-3 w-full">
                    {selected.length > 0 && (
                        <ul className="mt-3 gap-2 border border-zinc-200 rounded-md divide-y divide-zinc-200">
                            {selected.map((option) => (
                                <li key={option.id} className="flex items-center justify-between py-1 px-3">
                                    <span className='capitalize'>{option.name}</span>
                                    <button
                                        type="button"
                                        aria-label={`Remove ${option.name}`}
                                        onClick={() => removeSelection(option.id)}
                                        className="rounded-md p-2 text-zinc-800 hover:bg-zinc-100"
                                    >
                                        <MinusCircleIcon className="size-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

