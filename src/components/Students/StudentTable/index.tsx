'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import DataTable from '@/components/DataTable'
import StudentTableControls from './TableControls'
import StudentsTableBody from './TableBody'
import StudentsTableHead from './TableHead'
import { BackendStudentData, Student } from '@/app/(portal)/students/[pid]/page'
import { useSession } from 'next-auth/react'
import { SL_LEVEL_BY_ID } from '@/data/sierraleone-grades'

interface StudentsTableProps {
    students: Student[]
    totalPages: number
}
   
export const genderOptions = [
    "all genders",
    "male",
    "female",
];

const StudentsTable = ({ students, totalPages }: StudentsTableProps) => {
    const searchParams = useSearchParams()
    const [genderFilter, setGenderFilter] = useState<string>(
        searchParams.get("gender") || 'all genders'
    )

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
        <DataTable<Student, BackendStudentData>
            config={{
                dataKey: 'students',
                transformData: (s: BackendStudentData): Student => ({
                    id: s.id,
                    firstName: s.first_name,
                    lastName: s.last_name,
                    status: s.status,
                    enrollmentDate: s.enrollment_date,
                    sex: s.sex,
                    currentClassName: s.current_class_name,
                    dateOfBirth: s.date_of_birth,
                    middleName: '',
                    fullName: '',
                    address: '',
                    photoURL: '',
                    age: 0,
                    note: ''
                }),
                title: 'All Students',
                tableHead: <StudentsTableHead />,
                tableBody: (students) => {
                    return <StudentsTableBody students={students} />
                },
                controls: ({ searchInput }) => {
                    return <StudentTableControls
                        searchInput={searchInput}
                        genderFilter={genderFilter}
                        genderOptions={genderOptions}
                        gradeFilter={gradeFilter}
                        gradeOptions={gradeOptions}
                        setGenderFilter={setGenderFilter}
                        setGradeFilter={setGradeFilter}
                    />
                },
                searchPlaceholder: 'All Students...',
                columnCount: 6,
                buildQueryParams: (params, search, _page) => {
                    void _page
                    params.set('search', search)
                    
                    if (genderFilter && genderFilter !== 'all genders') {
                        params.set('sex', genderFilter)
                    }
                    
                    if (gradeFilter && gradeFilter !== 'all grades') {
                        params.set('grade', gradeFilter)
                    }
                },
                buildUrlParams: (params) => {
                    if (genderFilter && genderFilter !== 'all genders') {
                        params.set('gender', genderFilter)
                    } else {
                        params.delete('gender')
                    }

                    if (gradeFilter && gradeFilter !== 'all grades') {
                        params.set('grade', gradeFilter)
                    } else {
                        params.delete('grade')
                    }

                },
                queryDeps: [genderFilter, gradeFilter],
            }}
            initialData={students}
            initialTotalPages={totalPages}
        />
    )
}

export default StudentsTable
