import RolesView from '@/components/SystemAdmin/RolesView';

type BackendRoleData = {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    user_count?: number;
    created_at: string;
};

export type Role = {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userCount: number;
    createdAt: string;
};

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

const RolesPage = async ({ searchParams }: PageProps) => {
    // TODO: Replace with API data once endpoint is ready
    // Dummy data for roles
    const dummyRoles: BackendRoleData[] = [
        {
            id: '1',
            name: 'System Administrator',
            description: 'Full system access with all permissions',
            permissions: [
                'manage_tenants',
                'manage_system_users',
                'manage_roles',
                'view_all_analytics',
                'manage_permissions',
                'system_configuration',
            ],
            user_count: 2,
            created_at: '2024-01-01T10:00:00Z',
        },
        {
            id: '2',
            name: 'System Support',
            description: 'Support staff with limited administrative access',
            permissions: [
                'view_tenants',
                'view_system_users',
                'view_analytics',
                'manage_support_tickets',
            ],
            user_count: 3,
            created_at: '2024-01-05T14:30:00Z',
        },
        {
            id: '3',
            name: 'Government Monitor',
            description: 'Government officials with read-only access to all data',
            permissions: [
                'view_tenants',
                'view_analytics',
                'view_reports',
                'export_data',
            ],
            user_count: 2,
            created_at: '2024-01-10T09:15:00Z',
        },
        {
            id: '4',
            name: 'Government Auditor',
            description: 'Auditors with access to financial and compliance data',
            permissions: [
                'view_tenants',
                'view_analytics',
                'view_financial_data',
                'view_compliance_reports',
                'export_data',
            ],
            user_count: 1,
            created_at: '2024-01-15T11:45:00Z',
        },
        {
            id: '5',
            name: 'Tenant Administrator',
            description: 'School administrators managing their own tenant',
            permissions: [
                'manage_own_tenant',
                'manage_students',
                'manage_teachers',
                'manage_classes',
                'view_tenant_analytics',
            ],
            user_count: 12,
            created_at: '2024-01-20T08:30:00Z',
        },
        {
            id: '6',
            name: 'Teacher',
            description: 'Teachers with access to their assigned classes and students',
            permissions: [
                'view_assigned_classes',
                'view_assigned_students',
                'manage_grades',
                'view_class_analytics',
            ],
            user_count: 280,
            created_at: '2024-02-01T10:00:00Z',
        },
    ];

    const transformedData: Role[] = dummyRoles.map((role: BackendRoleData) => {
        return {
            id: role.id,
            name: role.name,
            description: role.description || 'No description',
            permissions: role.permissions || [],
            userCount: role.user_count || 0,
            createdAt: role.created_at,
        };
    });

    return (
        <RolesView roles={transformedData} totalPages={1} />
    );
};

export default RolesPage;

