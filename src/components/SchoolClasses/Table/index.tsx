'use client'

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import DataTable from '@/components/DataTable'
import { BackendClassesData, SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"
import SchoolClassesTableControls from "./Controls"
import ClassesTableHead from "./TableHead"
import ClassesTableBody from "./TableBody"

interface ClassesTableProps {
    classes: SchoolClass[]
    totalPages: number
}

const SchoolClassesTable = ({ classes, totalPages }: ClassesTableProps) => {
    const searchParams = useSearchParams()
    const [gradeFilter, setGradeFilter] = useState<string>(
        searchParams.get("grade") || 'All'
    )

    // Derived data: unique grades for filter
    const gradeOptions = useMemo(() => {
        const set = new Set<string>(classes.map(c => c.grade).filter(Boolean))
        return ['All', ...Array.from(set).sort()]
    }, [classes])

    return (
        <DataTable<SchoolClass, BackendClassesData>
            config={{
                endpoint: '/classes/search',
                dataKey: 'classes',
                transformData: (classK: BackendClassesData): SchoolClass => ({
                    id: classK.id,
                    capacity: classK.capacity,
                    className: classK.name,
                    createdAt: classK.created_at,
                    currentSize: classK.current_size.toString(),
                    teachers: classK.teachers.map(t => ({
                        id: t.id,
                        name: t.full_name
                    })),
                    grade: classK.grade
                }),
                title: 'All Classes',
                tableHead: <ClassesTableHead />,
                tableBody: (classes) => <ClassesTableBody classes={classes} />,
                controls: ({ searchInput }) => (
                    <SchoolClassesTableControls
                        gradeFilter={gradeFilter}
                        gradeOptions={gradeOptions}
                        setGradeFilter={setGradeFilter}
                        searchInput={searchInput}
                    />
                ),
                searchPlaceholder: 'search by class name',
                columnCount: 5,
                buildQueryParams: (params, search, page) => {
                    params.set('name', search)
                },
            }}
            initialData={classes}
            initialTotalPages={totalPages}
        />
    )
}

export default SchoolClassesTable