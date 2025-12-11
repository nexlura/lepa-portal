'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import DataTable from '@/components/DataTable'
import StudentTableControls from './TableControls'
import StudentsTableBody from './TableBody'
import StudentsTableHead from './TableHead'
import { BackendStudentData, Student } from '@/app/(portal)/students/[pid]/page'

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

    return (
        <DataTable<Student, BackendStudentData>
            config={{
                endpoint: '/students',
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
                        setGenderFilter={setGenderFilter}
                    />
                },
                searchPlaceholder: 'All Students...',
                columnCount: 6,
                buildQueryParams: (params, search, _page) => {
                    void _page
                    params.set('search', search)
                    if (genderFilter === 'all genders') {
                        return
                    } else {
                        params.set('sex', genderFilter)
                    }
                },
                buildUrlParams: (params) => {
                    if (genderFilter && genderFilter !== 'all genders') {
                        params.set('gender', genderFilter)
                    } else {
                        params.delete('gender')
                    }
                },
                queryDeps: [genderFilter],
            }}
            initialData={students}
            initialTotalPages={totalPages}
        />
    )
}

export default StudentsTable
