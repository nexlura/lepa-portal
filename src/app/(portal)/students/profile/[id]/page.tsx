import { getModel } from '@/lib/connector'
import { BackendStudentData, Student } from '../../[pid]/page'
import StudentProfileView from '@/components/Students/StudentProfile'

const StudentProfilePage = async ({ params }: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params

    const response = await getModel(`/students/${id}`)
    const studentData: BackendStudentData = response.data


    const studentProfile: Student = {
        id: studentData.id,
        address: studentData.address || '',
        sex: studentData.sex,
        status: studentData.status,
        currentClassName: studentData.current_class_name,
        dateOfBirth: studentData.date_of_birth,
        enrollmentDate: studentData.enrollment_date,
        firstName: studentData.first_name,
        lastName: studentData.last_name,
        fullName: `${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`,
        middleName: studentData.middle_name,
        note: studentData.note,
        photoURL: studentData.photo_url,
        age: 0
    }
    
    return <StudentProfileView student={studentProfile} />
}

export default StudentProfilePage

