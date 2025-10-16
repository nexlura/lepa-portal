'use client'

import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SettingsNavigation = (props: { collapsed: boolean | undefined }) => {
    const pathname = usePathname()
    const { collapsed } = props

    const isActive = pathname === '/dashboard/settings'


    return (
        <Link
            href={'/dashboard/settings'}
            className={`group flex text-gray-500 items-center ${props.collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md transition-colors ${isActive
                ? 'bg-primary-100 text-gray-900'
                : 'hover:bg-primary-50 hover:text-gray-900'
                }`}
        >
            <Cog6ToothIcon
                className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`}
            />
            {!collapsed && ' Settings'}
        </Link>
    )
}

export default SettingsNavigation