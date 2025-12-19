import TeachersView from '@/components/Teachers/TeachersView'
import { PageProps } from '../../classes/[pageNumber]/page'
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
    is_active?: boolean
    created_at?: string
    join_date?: string
    sex?: string
}

type TeachersAnalyticsResponse = {
    success?: boolean;
    code?: number;
    data?: {
        total_teachers?: number;
        active_teachers?: number;
        teachers_with_classes?: number;
        teachers_without_classes?: number;
        average_students_per_teacher?: number;
        total_subjects_taught?: number;
        inactive_teachers?: number;
    };
    message?: string;
};

const TeachersPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params

    const res = await getModel(`/teachers?page=${pageNumber}&limit=10`);
    
    // Check if response is valid
    if (!res || !res.data) {
        return (
            <TeachersView teachers={[]} totalPages={0} analytics={{
                totalTeachers: 0,
                activeTeachers: 0,
                teachersWithClasses: 0,
                teachersWithoutClasses: 0,
                averageStudentsPerTeacher: 0,
                totalSubjectsTaught: 0,
            }} />
        );
    }
    
    const teachers = res.data.teachers;
    const totalPages = res.data.total_pages;
    const totalTeachers = res.data.total || teachers?.length || 0;

    // Fetch analytics data
    const analyticsRes = await getModel<TeachersAnalyticsResponse>('/analytics/tenant/teachers');
    const analytics = analyticsRes?.data || {};

    const transformedData: Teacher[] = teachers?.map((teacher: BackendTeachersData) => {
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
            status: teacher.is_active ? 'active' : 'inactive',
            joinDate: teacher.join_date || teacher.created_at || '',
            phone: teacher.phone,
            sex: teacher.sex
        }
    }) || [];

    return (
        <TeachersView 
            teachers={transformedData} 
            totalPages={totalPages}
            analytics={{
                totalTeachers: analytics.total_teachers || totalTeachers,
                activeTeachers: analytics.active_teachers || 0,
                teachersWithClasses: analytics.teachers_with_classes || 0,
                teachersWithoutClasses: analytics.teachers_without_classes || 0,
                averageStudentsPerTeacher: analytics.average_students_per_teacher || 0,
                totalSubjectsTaught: analytics.total_subjects_taught || 0,
            }}
        />
    )
}

export default TeachersPage