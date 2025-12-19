'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import DataTable from '@/components/DataTable'
import { BackendClassesData, SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"
import SchoolClassesTableControls from "./Controls"
import ClassesTableHead from "./TableHead"
import ClassesTableBody from "./TableBody"
import { SL_LEVEL_BY_ID } from "@/data/sierraleone-grades"
import { useSession } from "next-auth/react"

interface ClassesTableProps {
    classes: SchoolClass[]
    totalPages: number
}

const SchoolClassesTable = ({ classes, totalPages }: ClassesTableProps) => {
    const searchParams = useSearchParams()
    const { data: session } = useSession();

    const [gradeFilter, setGradeFilter] = useState<string>(
        searchParams.get("grade") || 'all grades'
    )

    const [schoolLevel, setSchoolLevel] = useState<string | null>()
    // const schoolLevel = session?.user?.schoolLevel; // e.g., 'primary', 'jss', 'sss

    const getYears = (level: string) =>
        SL_LEVEL_BY_ID[level]?.years.map(y => (y.name)) ?? [];

    const levelGrades = schoolLevel === 'secondary'
        ? [
            ...getYears('jss'),
            ...getYears('sss'),
        ]
        : getYears(schoolLevel || 'primary');

    const gradeOptions = ['all grades', ...levelGrades]

    useEffect(() => {
        if (session?.user) {
            setSchoolLevel(session.user.schoolLevel)
        }

    }, [session])

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
                    currentSize: classK.current_size,
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
                searchPlaceholder: 'All Classes...',
                columnCount: 5,
                buildQueryParams: (params, search, _page) => {
                    void _page
                    params.set('search', search)
                    if (gradeFilter === 'all grades') {
                        return
                    } else {
                        params.set('grades', gradeFilter)
                    }
                },
                buildUrlParams: (params) => {
                    if (gradeFilter && gradeFilter !== 'all grades') {
                        params.set('grade', gradeFilter)
                    } else {
                        params.delete('grade')
                    }
                },
                queryDeps: [gradeFilter],
            }}
            initialData={classes}
            initialTotalPages={totalPages}
        />
    )
}

export default SchoolClassesTable