import TeachersView from '@/components/Teachers/TeachersView'
import { PageProps } from '../../classes/[pageNumber]/page'
import { auth } from '@/auth'
import { getModel } from '@/lib/connector'
import { Teacher } from '@/components/Teachers/TeachersView'

interface BackendTeachersData {
    id: number
    first_name?: string
    last_name?: string
    name?: string
    email?: string
    phone?: string
    subjects?: string[]
    assigned_classes?: Array<{ id: string; name: string; grade?: string }>
    status?: string
    created_at?: string
    join_date?: string
    sex?: string
}

const TeachersPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params

    const session = await auth();

    const res = await getModel(`/teachers?page=${pageNumber}&limit=10`);

    const transformedData: Teacher[] = res?.data?.teachers?.map((teacher: BackendTeachersData) => {
        // Format name from first_name and last_name or use name field
        const fullName = teacher.first_name && teacher.last_name
            ? `${teacher.first_name} ${teacher.last_name}`
            : teacher.name || 'Unknown'

        // Format subjects array
        const subjects = teacher.subjects || []

        // Format classes array from assigned_classes
        const classes = teacher.assigned_classes?.map(cls =>
            cls.grade ? `${cls.name} (${cls.grade})` : cls.name
        ) || []

        return {
            id: teacher.id,
            name: fullName,
            email: teacher.email || '',
            subjects: subjects.length > 0 ? subjects : undefined,
            classes: classes.length > 0 ? classes : undefined,
            status: teacher.status || 'Active',
            joinDate: teacher.join_date || teacher.created_at || '',
            phone: teacher.phone,
            sex: teacher.sex
        }
    }) || [];



    return (
        <TeachersView teachers={transformedData} session={session} />
    )
}

export default TeachersPage