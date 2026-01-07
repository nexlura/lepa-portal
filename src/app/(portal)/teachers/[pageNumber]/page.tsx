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
        average_students_per_teacher?: number;
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
            teachers = Array.isArray(res.data.teachers) ? res.data.teachers : [];
            totalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 0;
            totalTeachers = typeof res.data.total === 'number' ? res.data.total : teachers.length || 0;
        } else if (isErrorResponse(res)) {
            // Handle error response - use defaults
            console.warn('Error response from teachers API:', res.status, res.message);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Handle JSON parse errors and other exceptions
        console.warn('Error fetching teachers:', error?.message || error);
        // Use empty arrays as fallback
    }

    // Fetch analytics data with error handling
    let analytics: TeachersAnalyticsResponse['data'] = {};
    try {
        const analyticsRes = await getModel<TeachersAnalyticsResponse>('/analytics/tenant/teachers');
        if (analyticsRes && !isErrorResponse(analyticsRes) && analyticsRes.data) {
            analytics = analyticsRes.data;
        } else if (isErrorResponse(analyticsRes)) {
            // Only log non-404 errors
            if (analyticsRes.status !== 404) {
                console.warn('Error response from teachers analytics API:', analyticsRes.status, analyticsRes.message);
            }
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Silently handle errors - endpoint may not exist yet or return invalid JSON
        // Use empty object as fallback
        if (error?.message && !error.message.includes('JSON.parse')) {
            console.warn('Error fetching teachers analytics:', error.message);
        }
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
                averageStudentsPerTeacher: analytics.average_students_per_teacher || 0,
            }}
        />
    )
}

export default TeachersPage