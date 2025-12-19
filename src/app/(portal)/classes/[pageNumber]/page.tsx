import { auth } from '@/auth';
import ClassesView from '@/components/SchoolClasses/ClassView';
import { MultiSelectOption } from '@/components/UIKit/MultiSelect';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendClassesData = {
    id: string,
    tenant_id: string,
    name: string,
    grade: string,
    capacity: number,
    current_size: number,
    is_active: boolean,
    room_number: string,
    created_at: string
    teachers: { id: string, full_name: string }[]
}

export type SchoolClass = {
    id: string
    className: string
    capacity: number
    teachers?: MultiSelectOption[]
    createdAt?: string
    currentSize?: number
    grade: string
}

export type PageProps = {
    params: Promise<{ pageNumber: string }>;
};

type ClassesAnalyticsResponse = {
    success?: boolean;
    code?: number;
    data?: {
        total_capacity?: number;
        total_students?: number;
        average_class_size?: number;
        classes_at_full_capacity?: number;
        average_utilization?: number;
    };
    message?: string;
};

const ClassesPage = async ({ params }: PageProps) => {
    const { pageNumber } = await params
    const session = await auth();

    // Fetch classes data with error handling
    let classes: BackendClassesData[] = [];
    let totalPages = 0;
    let totalClasses = 0;
    
    try {
    const res = await getModel(`/classes?page=${pageNumber}&limit=10`);
        if (res && !isErrorResponse(res) && res.data) {
            classes = Array.isArray(res.data.classes) ? res.data.classes : [];
            totalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 0;
            totalClasses = typeof res.data.total === 'number' ? res.data.total : classes.length || 0;
        } else if (isErrorResponse(res)) {
            // Handle error response - use defaults
            console.warn('Error response from classes API:', res.status, res.message);
        }
    } catch (error: any) {
        // Handle JSON parse errors and other exceptions
        console.warn('Error fetching classes:', error?.message || error);
        // Use empty arrays as fallback
    }

    // Fetch analytics data with error handling
    let analytics: ClassesAnalyticsResponse['data'] = {};
    try {
        const analyticsRes = await getModel<ClassesAnalyticsResponse>('/analytics/tenant/classes');
        if (analyticsRes && !isErrorResponse(analyticsRes) && analyticsRes.data) {
            analytics = analyticsRes.data;
        } else if (isErrorResponse(analyticsRes)) {
            // Only log non-404 errors
            if (analyticsRes.status !== 404) {
                console.warn('Error response from classes analytics API:', analyticsRes.status, analyticsRes.message);
            }
        }
    } catch (error: any) {
        // Silently handle errors - endpoint may not exist yet or return invalid JSON
        // Use empty object as fallback
        if (error?.message && !error.message.includes('JSON.parse')) {
            console.warn('Error fetching classes analytics:', error.message);
        }
    }

    const transformedData: SchoolClass[] = classes?.map((classK: BackendClassesData) => {
        return {
            id: classK.id,
            capacity: classK.capacity,
            className: classK.name,
            createdAt: classK.created_at,
            currentSize: classK.current_size.toString(),
            teachers: classK.teachers?.map(t => ({
                id: t.id,
                name: t.full_name
            })) || [],
            grade: classK.grade
        }
    }) || [];

    return (
        <ClassesView
            classes={transformedData}
            session={session}
            totalPages={totalPages}
            analytics={{
                totalClasses,
                totalCapacity: analytics.total_capacity || 0,
                totalStudents: analytics.total_students || 0,
                averageClassSize: analytics.average_class_size || 0,
                classesAtFullCapacity: analytics.classes_at_full_capacity || 0,
                averageUtilizationRate: analytics.average_utilization || 0,
            }}
        />
    );
};

export default ClassesPage