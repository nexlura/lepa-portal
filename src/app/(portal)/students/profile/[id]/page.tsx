import { getModel } from '@/lib/connector'
import { BackendStudentData, Student } from '../../[pid]/page'
import StudentProfileView from '@/components/Students/StudentProfile'
import type { Doc } from '@/components/DocumentsList'

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

    // Fetch student attachments
    let attachments: Doc[] = []
    try {
        const attachmentsResponse = await getModel<{ 
            data?: { 
                attachments?: Array<{
                    id: string | number
                    file_name: string
                    file_type?: string
                    file_url?: string
                    preview_url?: string
                    uploaded_at?: string
                    file_size?: number
                }>
            } | Array<{
                id: string | number
                file_name: string
                file_type?: string
                file_url?: string
                preview_url?: string
                uploaded_at?: string
                file_size?: number
            }>
        }>(`/students/${id}/attachments`)
        
        // Handle different response structures
        let attachmentList: Array<{
            id: string | number
            file_name: string
            file_type?: string
            file_url?: string
            preview_url?: string
            uploaded_at?: string
            file_size?: number
        }> = []
        
        if (attachmentsResponse?.data) {
            if (Array.isArray(attachmentsResponse.data)) {
                attachmentList = attachmentsResponse.data
            } else if ('attachments' in attachmentsResponse.data && Array.isArray(attachmentsResponse.data.attachments)) {
                attachmentList = attachmentsResponse.data.attachments
            }
        }
        
        attachments = attachmentList.map((att) => ({
            id: att.id,
            name: att.file_name,
            url: att.file_url,
            previewUrl: att.preview_url || att.file_url,
            fileType: att.file_type,
            uploadedAt: att.uploaded_at,
            fileSize: att.file_size,
        }))
    } catch (error) {
        console.error('Error fetching student attachments:', error)
        // Continue with empty attachments array
    }
    
    return <StudentProfileView student={studentProfile} attachments={attachments} />
}

export default StudentProfilePage

