import { getModel } from '@/lib/connector'
import StudentsView from '@/components/Students/StudentsView'
import { PageProps } from '@/app/layout'

interface BackendStudentData {
    id: string
    tenant_id: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    gender: string,
    date_of_birth: string,
    address: string,
    enrollment_date: string,
    status: string
    sex: string
    current_class_name: string
}

export type Student = {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    fullName: string, // Computed field
    address: string,
    sex: string,
    photoURL: string,
    dateOfBirth: string,
    age: number, // Computed field
    note: string,
    currentClassName: string, // Populated from class lookup
    enrollmentDate: string,
    status: string,

}

const StudentsPage = async ({ params }: PageProps) => {
    const { pid } = await params

    const res = await getModel(`/students?page=${pid}&limit=10`);
    const students = res?.data?.students
    const totalPages = res.data?.total_pages

    const transformedData: Student[] = students?.map((student: BackendStudentData) => {

        return {
            id: student.id,
            firstName: student.first_name,
            lastName: student.last_name,
            status: student.status,
            enrollmentDate: student.enrollment_date,
            sex: student.sex,
            currentClassName: student.current_class_name,
            dateOfBirth: student.date_of_birth,
        }
    }) || [];



    return (
        <StudentsView students={transformedData} totalPages={totalPages} />
    )
}

export default StudentsPage