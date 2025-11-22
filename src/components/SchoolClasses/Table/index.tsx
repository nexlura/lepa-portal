'use client'

import { useMemo, useState } from "react"

import { SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"
import SchoolClassesTableControls from "./Controls"
import TableFoot from "@/components/TableFoot"
import ClassesTableHead from "./TableHead"
import ClassesTableBody from "./TableBody"
interface ClassesTableProps {
    classes: SchoolClass[]
    totalPages: number
}

const SchoolClassesTable = ({ classes, totalPages }: ClassesTableProps) => {
    // UI state: search, filters, sorting, pagination
    const [search, setSearch] = useState('')
    const [gradeFilter, setGradeFilter] = useState<string>('All')

    // Derived data: unique grades for filter
    const gradeOptions = useMemo(() => {
        const set = new Set<string>(classes.map(c => c.className).filter(Boolean))
        return ['All', ...Array.from(set).sort()]
    }, [classes])

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 sm:py-6 sm:pb-0">
                <SchoolClassesTableControls
                    search={search}
                    setSearch={setSearch}
                    gradeFilter={gradeFilter}
                    gradeOptions={gradeOptions}
                    setGradeFilter={setGradeFilter}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <ClassesTableHead />
                        <ClassesTableBody classes={classes} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SchoolClassesTable