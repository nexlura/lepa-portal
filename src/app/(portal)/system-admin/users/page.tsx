import SystemUsersView from '@/components/SystemAdmin/SystemUsersView';

type BackendSystemUserData = {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
    status: string;
    created_at: string;
};

export type SystemUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
};

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

const SystemUsersPage = async ({ searchParams }: PageProps) => {
    // TODO: Replace with API data once endpoint is ready
    // Dummy data for system users
    const dummyUsers: BackendSystemUserData[] = [
        {
            id: '1',
            email: 'admin@lepa.gov',
            first_name: 'John',
            last_name: 'Doe',
            role: 'System Administrator',
            status: 'active',
            created_at: '2024-01-01T10:00:00Z',
        },
        {
            id: '2',
            email: 'support@lepa.gov',
            first_name: 'Jane',
            last_name: 'Smith',
            role: 'System Support',
            status: 'active',
            created_at: '2024-01-05T14:30:00Z',
        },
        {
            id: '3',
            email: 'monitor@lepa.gov',
            first_name: 'Michael',
            last_name: 'Johnson',
            role: 'Government Monitor',
            status: 'active',
            created_at: '2024-01-10T09:15:00Z',
        },
        {
            id: '4',
            email: 'auditor@lepa.gov',
            first_name: 'Sarah',
            last_name: 'Williams',
            role: 'Government Auditor',
            status: 'active',
            created_at: '2024-01-15T11:45:00Z',
        },
        {
            id: '5',
            email: 'support2@lepa.gov',
            first_name: 'David',
            last_name: 'Brown',
            role: 'System Support',
            status: 'active',
            created_at: '2024-02-01T13:20:00Z',
        },
        {
            id: '6',
            email: 'admin2@lepa.gov',
            first_name: 'Emily',
            last_name: 'Davis',
            role: 'System Administrator',
            status: 'inactive',
            created_at: '2024-02-10T08:30:00Z',
        },
        {
            id: '7',
            email: 'monitor2@lepa.gov',
            first_name: 'Robert',
            last_name: 'Miller',
            role: 'Government Monitor',
            status: 'active',
            created_at: '2024-02-15T10:00:00Z',
        },
        {
            id: '8',
            email: 'support3@lepa.gov',
            first_name: 'Lisa',
            last_name: 'Wilson',
            role: 'System Support',
            status: 'active',
            created_at: '2024-03-01T15:00:00Z',
        },
    ];

    const transformedData: SystemUser[] = dummyUsers.map((user: BackendSystemUserData) => {
        const fullName = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.email.split('@')[0];

        return {
            id: user.id,
            name: fullName,
            email: user.email,
            role: user.role,
            status: user.status === 'active' ? 'active' : 'inactive',
            createdAt: user.created_at,
        };
    });

    return (
        <SystemUsersView users={transformedData} totalPages={1} />
    );
};

export default SystemUsersPage;

