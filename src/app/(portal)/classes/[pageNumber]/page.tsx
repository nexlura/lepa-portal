import { auth } from '@/auth';
import ClassesView from '@/components/SchoolClasses/ClassView';
import { MultiSelectOption } from '@/components/UIKit/MultiSelect';
import { getModel } from '@/lib/connector';

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

    const res = await getModel(`/classes?page=${pageNumber}&limit=10`);
    const totalPages = res.data?.total_pages
    const classes = res.data?.classes
    const totalClasses = res.data?.total || classes?.length || 0;

    // Fetch analytics data
    const analyticsRes = await getModel<ClassesAnalyticsResponse>('/analytics/tenant/classes');
    const analytics = analyticsRes?.data || {};

    const transformedData: SchoolClass[] = classes.map((classK: BackendClassesData) => {

        return {
            id: classK.id,
            capacity: classK.capacity,
            className: classK.name,
            createdAt: classK.created_at,
            currentSize: classK.current_size.toString(),
            teachers: classK.teachers.map(t => ({
                id: t.id,
                name: t.full_name
            })),
            grade: classK.grade
        }
    });

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