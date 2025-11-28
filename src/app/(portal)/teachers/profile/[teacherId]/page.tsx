import TeacherProfileView, { TeacherProfile } from '@/components/Teachers/TeacherProfileView'
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

    return <TeacherProfileView teacher={teacherProfile} />
}

export default TeacherProfilePage

