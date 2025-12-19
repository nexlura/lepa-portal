import TenantsView from '@/components/SystemAdmin/TenantsView';

type BackendTenantData = {
    id: string;
    school_name: string;
    status: string;
    created_at: string;
    student_count?: number;
    teacher_count?: number;
    class_count?: number;
};

export type Tenant = {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    studentCount: number;
    teacherCount: number;
    classCount: number;
    createdAt: string;
};

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

const TenantsPage = async ({ searchParams }: PageProps) => {
    // TODO: Replace with API data once endpoint is ready
    // Dummy data for tenants
    const dummyTenants: BackendTenantData[] = [
        {
            id: '1',
            school_name: 'Springfield High School',
            status: 'active',
            created_at: '2024-01-15T10:00:00Z',
            student_count: 450,
            teacher_count: 35,
            class_count: 25,
        },
        {
            id: '2',
            school_name: 'Riverside Academy',
            status: 'active',
            created_at: '2024-02-10T14:30:00Z',
            student_count: 320,
            teacher_count: 28,
            class_count: 20,
        },
        {
            id: '3',
            school_name: 'Central Elementary',
            status: 'active',
            created_at: '2024-01-20T09:15:00Z',
            student_count: 285,
            teacher_count: 22,
            class_count: 18,
        },
        {
            id: '4',
            school_name: 'Westside Middle School',
            status: 'active',
            created_at: '2024-03-05T11:45:00Z',
            student_count: 240,
            teacher_count: 20,
            class_count: 16,
        },
        {
            id: '5',
            school_name: 'North High School',
            status: 'active',
            created_at: '2024-02-18T13:20:00Z',
            student_count: 215,
            teacher_count: 18,
            class_count: 14,
        },
        {
            id: '6',
            school_name: 'Eastside Primary',
            status: 'active',
            created_at: '2024-01-25T08:30:00Z',
            student_count: 180,
            teacher_count: 15,
            class_count: 12,
        },
        {
            id: '7',
            school_name: 'South Academy',
            status: 'inactive',
            created_at: '2024-01-10T10:00:00Z',
            student_count: 150,
            teacher_count: 12,
            class_count: 10,
        },
        {
            id: '8',
            school_name: 'Valley School',
            status: 'active',
            created_at: '2024-02-28T15:00:00Z',
            student_count: 195,
            teacher_count: 16,
            class_count: 13,
        },
        {
            id: '9',
            school_name: 'Mountain View Elementary',
            status: 'active',
            created_at: '2024-03-12T09:30:00Z',
            student_count: 165,
            teacher_count: 14,
            class_count: 11,
        },
        {
            id: '10',
            school_name: 'Ocean Breeze Academy',
            status: 'active',
            created_at: '2024-02-22T12:15:00Z',
            student_count: 220,
            teacher_count: 19,
            class_count: 15,
        },
    ];

    const transformedData: Tenant[] = dummyTenants.map((tenant: BackendTenantData) => {
        return {
            id: tenant.id,
            name: tenant.school_name,
            status: tenant.status === 'active' ? 'active' : 'inactive',
            studentCount: tenant.student_count || 0,
            teacherCount: tenant.teacher_count || 0,
            classCount: tenant.class_count || 0,
            createdAt: tenant.created_at,
        };
    });

    return (
        <TenantsView tenants={transformedData} totalPages={1} />
    );
};

export default TenantsPage;

