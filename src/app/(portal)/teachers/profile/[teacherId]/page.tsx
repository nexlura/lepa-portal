import { Doc } from '@/components/DocumentsList'
import TeacherProfileView, { TeacherProfile } from '@/components/Teachers/TeacherProfile'
import { getModel } from '@/lib/connector'

type PageProps = {
    params: Promise<{ teacherId: string }>
}

type BackendSubject = string | { id?: string; name?: string }

type BackendClass = {
    id?: string | number
    class_id?: string | number
    name?: string
    grade?: string
}

type BackendTeacher = {
    id: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone?: string
    address?: string
    sex?: string
    is_active?: string
    join_date?: string
    created_at?: string
    updated_at?: string
    subjects?: BackendSubject[]
    assigned_classes?: BackendClass[]
}

const normalizeSubjects = (subjects?: BackendSubject[]): string[] => {
    if (!Array.isArray(subjects)) return []
    return subjects
        .map((subject) => (typeof subject === 'string' ? subject : subject?.name || ''))
        .filter((subject): subject is string => Boolean(subject))
}

const normalizeClasses = (classes?: BackendClass[]): Array<{ id: string; label: string }> => {
    if (!Array.isArray(classes)) return []
    return classes
        .map((cls, index) => {
            const label = cls?.name ? (cls?.grade ? `${cls.name} (${cls.grade})` : cls.name) : cls?.grade || ''
            if (!label) return null
            const id = cls?.id ?? cls?.class_id ?? `${label}-${index}`
            return { id: String(id), label }
        })
        .filter((cls): cls is { id: string; label: string } => Boolean(cls))
}

const TeacherProfilePage = async ({ params }: PageProps) => {
    const { teacherId } = await params

    const response = await getModel(`/teachers/${teacherId}`)
    const teacherData: BackendTeacher = response.data

    const fullName =
        teacherData.first_name && teacherData.last_name
            ? `${teacherData.first_name} ${teacherData.last_name}`
            : teacherData.name || 'Unknown teacher'

    const teacherProfile: TeacherProfile = {
        id: teacherData.id,
        fullName,
        email: teacherData.email || '',
        phone: teacherData.phone || '',
        address: teacherData.address || '',
        sex: teacherData.sex,
        status: teacherData.is_active ? 'active' : 'inactive',
        joinDate: teacherData.join_date || teacherData.created_at || '',
        createdAt: teacherData.created_at,
        updatedAt: teacherData.updated_at,
        subjects: normalizeSubjects(teacherData.subjects),
        classes: normalizeClasses(teacherData.assigned_classes),
    }

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
        }>(`/teachers/${teacherId}/attachments`)
        
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

    return <TeacherProfileView teacher={teacherProfile} attachments={attachments} />
}

export default TeacherProfilePage

