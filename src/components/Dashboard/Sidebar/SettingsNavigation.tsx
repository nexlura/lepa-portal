'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SettingsNavigation = () => {
    const pathname = usePathname()

    return (
        <Link
            href={'/dashboard/settings'}
            className={`group flex text-gray-500 items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${'/dashboard/settings' === pathname
                ? 'bg-primary-100 text-gray-900'
                : 'hover:bg-primary-50 hover:text-gray-900'
                }`}
        >
            <Cog6ToothIcon
                className={`mr-3 h-5 w-5 flex-shrink-0 `}
            />
            Settings
        </Link>
    )
}

export default SettingsNavigation