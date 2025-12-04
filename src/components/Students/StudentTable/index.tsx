'use client'

import DataTable from '@/components/DataTable'
import StudentTableControls from './TableControls'
import StudentsTableBody from './TableBody'
import StudentsTableHead from './TableHead'
import { BackendStudentData, Student } from '@/app/(portal)/students/[pid]/page'

interface StudentsTableProps {
    students: Student[]
    totalPages: number
}

const StudentsTable = ({ students, totalPages }: StudentsTableProps) => {
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
                    return <StudentTableControls searchInput={searchInput} />
                },
                searchPlaceholder: 'search students by name',
                columnCount: 6,
            }}
            initialData={students}
            initialTotalPages={totalPages}
        />
    )
}

export default StudentsTable
