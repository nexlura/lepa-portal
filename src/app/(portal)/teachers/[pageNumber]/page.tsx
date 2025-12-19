import TeachersView from '@/components/Teachers/TeachersView'
import { PageProps } from '../../classes/[pageNumber]/page'
import { getModel, isErrorResponse } from '@/lib/connector'
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

    // Fetch teachers data with error handling
    let teachers: BackendTeachersData[] = [];
    let totalPages = 0;
    let totalTeachers = 0;
    
    try {
        const res = await getModel(`/teachers?page=${pageNumber}&limit=10`);
        if (res && !isErrorResponse(res) && res.data) {
            teachers = res.data.teachers || [];
            totalPages = res.data.total_pages || 0;
            totalTeachers = res.data.total || teachers.length || 0;
        }
    } catch (error) {
        console.warn('Error fetching teachers:', error);
        // Use empty arrays as fallback
    }

    // Fetch analytics data with error handling
    let analytics: TeachersAnalyticsResponse['data'] = {};
    try {
        const analyticsRes = await getModel<TeachersAnalyticsResponse>('/analytics/tenant/teachers');
        if (analyticsRes && !isErrorResponse(analyticsRes) && analyticsRes.data) {
            analytics = analyticsRes.data;
        } else if (isErrorResponse(analyticsRes) && analyticsRes.status === 404) {
            // Endpoint doesn't exist yet, silently use defaults
        }
    } catch (error) {
        // Silently handle errors - endpoint may not exist yet
        // Use empty object as fallback
    }

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