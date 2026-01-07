import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction } from 'react'

interface SearchInputProps {
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    placeholder?: string

}

const SearchInput = ({ search, setSearch, placeholder }: SearchInputProps) => {
    return (
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative bg-gray-100 w-full sm:w-72 rounded-md border border-gray-200">

                {/* Search Icon */}
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2 h-5 w-5 text-gray-400" />

                {/* Search Input */}
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder || 'search records'}
                    className="w-full rounded-md border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                />

                {/* Clear Icon (Only shows when search has text) */}
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchInput