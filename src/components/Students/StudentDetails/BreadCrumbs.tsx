import Link from 'next/link'

import { StudentRecord } from "@/app/dashboard/admissions/page"
import { ChevronRightIcon } from '@heroicons/react/24/outline'

const Breadcrumbs = (props: { student: StudentRecord }) => {
    return (
        <nav className="flex items-center text-sm text-primary-800" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-primary-900">Dashboard</Link>
            <ChevronRightIcon className="mx-2 h-4 w-4" />
            <Link href="/dashboard/students" className="hover:text-primary-900">Students</Link>
            <ChevronRightIcon className="mx-2 h-4 w-4" />
            <span className="text-gray-900">{props.student.name}</span>
        </nav>
    )
}

export default Breadcrumbs