import { getModel, isErrorResponse } from '@/lib/connector'
import StudentsView from '@/components/Students/StudentsView'
import { PageProps } from '@/app/layout'

export type BackendStudentData = {
    id: string
    tenant_id: string
    first_name: string
    last_name: string
    middle_name: string
    gender: string
    date_of_birth: string
    address: string
    enrollment_date: string
    status: string
    sex: string
    current_class_name: string
    note: string
    photo_url: string
}

export type Student = {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    fullName: string, // Computed field
    address: string,
    sex: string,
    photoURL: string,
    dateOfBirth: string,
    age: number, // Computed field
    note: string,
    currentClassName: string, // Populated from class lookup
    enrollmentDate: string,
    status: string,

}

type StudentsAnalyticsResponse = {
    success?: boolean;
    code?: number;
    data?: {
        total_students?: number;
        active_students?: number;
        enrolled_students?: number;
        average_age?: number;
        male_students?: number;
        female_students?: number;
        new_enrollments_this_month?: number;
    };
    message?: string;
};

const StudentsPage = async ({ params }: PageProps) => {
    const { pid } = await params

    // Fetch students data with error handling
    let students: BackendStudentData[] = [];
    let totalPages = 0;
    let totalStudents = 0;
    
    try {
    const res = await getModel(`/students?page=${pid}&limit=10`);
        if (res && !isErrorResponse(res) && res.data) {
            students = Array.isArray(res.data.students) ? res.data.students : [];
            totalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 0;
            totalStudents = typeof res.data.total === 'number' ? res.data.total : students.length || 0;
        } else if (isErrorResponse(res)) {
            // Handle error response - use defaults
            console.warn('Error response from students API:', res.status, res.message);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Handle JSON parse errors and other exceptions
        console.warn('Error fetching students:', error?.message || error);
        // Use empty arrays as fallback
    }

    // Fetch analytics data with error handling
    let analytics: StudentsAnalyticsResponse['data'] = {};
    try {
        const analyticsRes = await getModel<StudentsAnalyticsResponse>('/analytics/tenant/students');
        if (analyticsRes && !isErrorResponse(analyticsRes) && analyticsRes.data) {
            analytics = analyticsRes.data;
        } else if (isErrorResponse(analyticsRes)) {
            // Only log non-404 errors
            if (analyticsRes.status !== 404) {
                console.warn('Error response from students analytics API:', analyticsRes.status, analyticsRes.message);
            }
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Silently handle errors - endpoint may not exist yet or return invalid JSON
        // Use empty object as fallback
        if (error?.message && !error.message.includes('JSON.parse')) {
            console.warn('Error fetching students analytics:', error.message);
        }
    }

    const transformedData: Student[] = students?.map((student: BackendStudentData) => {
        return {
            id: student.id,
            firstName: student.first_name,
            middleName: student.middle_name || '',
            lastName: student.last_name,
            fullName: `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim(),
            address: student.address || '',
            sex: student.sex,
            photoURL: student.photo_url || '',
            dateOfBirth: student.date_of_birth,
            age: 0, // Will be computed if needed
            note: student.note || '',
            currentClassName: student.current_class_name,
            enrollmentDate: student.enrollment_date,
            status: student.status,
        }
    }) || [];

    return (
        <StudentsView 
            students={transformedData} 
            totalPages={totalPages}
            analytics={{
                totalStudents: analytics.total_students || totalStudents,
                enrolledStudents: analytics.enrolled_students || 0,
                studentsByGender: {
                    male: analytics.male_students || 0,
                    female: analytics.female_students || 0,
                    other: 0, // Not provided in API response
                },
            }}
        />
    )
}

export default StudentsPage