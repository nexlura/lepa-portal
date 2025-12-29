'use client'

import { useMemo, useState, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Label, ErrorMessage } from './Fieldset'

export interface SearchableSelectOption {
    id: string
    name: string
}

interface SearchableSelectProps {
    label?: string
    placeholder?: string
    options: SearchableSelectOption[]
    value: string | null | undefined
    loading?: boolean
    onChange: (value: string | null) => void
    emptyLabel?: string
    error?: string
    disabled?: boolean
    'aria-label'?: string
}

export default function SearchableSelect({
    label,
    placeholder = 'Search…',
    options,
    value,
    loading,
    onChange,
    emptyLabel = 'No matches found',
    error,
    disabled,
    'aria-label': ariaLabel,
}: SearchableSelectProps) {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter((option) => option.name.toLowerCase().includes(q))
    }, [options, query])

    const selectedOption = useMemo(() => {
        if (!value) return null
        return options.find((option) => option.id === value) || null
    }, [options, value])

    const handleSelect = (option: SearchableSelectOption) => {
        onChange(option.id)
        setQuery('')
        setOpen(false)
    }

    const handleClear = () => {
        onChange(null)
        setQuery('')
        setOpen(false)
    }

    // Close dropdown if clicking outside
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
            setOpen(false)
        }
    }

    return (
        <div className="w-full">
            {label && (
                <Label className="text-sm/6 text-gray-900 dark:text-white font-medium mb-2 block">
                    {label}
                </Label>
            )}
            <div ref={containerRef} onBlur={handleBlur} className="space-y-2 relative">
                <div className="relative">
                    {/* SEARCH FIELD */}
                    <div className={clsx(
                        "flex items-center gap-2 border rounded-md px-4 py-2.5 relative",
                        error 
                            ? "border-red-500" 
                            : "border-zinc-200",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}>
                        <MagnifyingGlassIcon className="size-5 text-zinc-400 flex-shrink-0" />
                        {selectedOption && !query && !open && (
                            <span className="absolute left-11 text-sm text-gray-900 pointer-events-none z-10">
                                {selectedOption.name}
                            </span>
                        )}
                        <input
                            type="text"
                            placeholder={selectedOption && !open && !query ? '' : placeholder}
                            className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed relative z-20"
                            value={query}
                            disabled={disabled}
                            onFocus={() => {
                                if (!disabled) {
                                    setOpen(true)
                                    setHighlightedIndex(0)
                                    // Clear the input when focusing to allow searching
                                    if (selectedOption) {
                                        setQuery('')
                                    }
                                }
                            }}
                            onChange={(event) => {
                                if (!disabled) {
                                    setQuery(event.target.value)
                                    setOpen(true)
                                    setHighlightedIndex(0)
                                }
                            }}
                            aria-label={ariaLabel || label}
                        />
                        {selectedOption && !disabled && !query && !open && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleClear()
                                }}
                                className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 flex-shrink-0 z-20"
                                aria-label="Clear selection"
                            >
                                <XMarkIcon className="size-4" />
                            </button>
                        )}
                        {open && (
                            <ChevronUpIcon className="size-4 text-zinc-400 flex-shrink-0 z-20" />
                        )}
                    </div>

                    {/* OPTIONS DROPDOWN */}
                    {open && !disabled && (
                        <div className="absolute top-full z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg">
                            {loading ? (
                                <p className="px-4 py-6 text-center text-sm text-gray-500">Loading options…</p>
                            ) : filteredOptions.length === 0 ? (
                                <p className="px-4 py-6 text-center text-sm text-gray-500">{emptyLabel}</p>
                            ) : (
                                <ul className="space-y-1 px-2 py-2">
                                    {filteredOptions.map((option, index) => {
                                        const isSelected = value === option.id
                                        return (
                                            <li key={option.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelect(option)}
                                                    onMouseEnter={() => setHighlightedIndex(index)}
                                                    className={clsx(
                                                        'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition',
                                                        isSelected
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : highlightedIndex === index
                                                                ? 'bg-zinc-100'
                                                                : 'hover:bg-zinc-50'
                                                    )}
                                                >
                                                    <span className="truncate">{option.name}</span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <ErrorMessage className="mt-1.5">
                    {error}
                </ErrorMessage>
            )}
        </div>
    )
}

