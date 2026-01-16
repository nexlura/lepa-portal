import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { TeacherProfile } from '../TeacherProfile'

interface BreadcrumbsProps {
    teacher: TeacherProfile
}

const Breadcrumbs = ({ teacher }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center text-sm text-primary-800" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-primary-900">Dashboard</Link>
            <ChevronRightIcon className="mx-2 h-4 w-4" />
            <Link href="/teachers/1" className="hover:text-primary-900">Teachers</Link>
            <ChevronRightIcon className="mx-2 h-4 w-4" />
            <span className="text-gray-900">{teacher.fullName}</span>
        </nav>
    )
}

export default Breadcrumbs

