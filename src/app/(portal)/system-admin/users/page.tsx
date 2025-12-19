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
    // Dummy data for system users with random distribution across user types
    const userTypes = [
        { role: 'System Administrator', emailDomain: 'lepa.gov', firstNames: ['John', 'Emily', 'Michael', 'Sarah'], lastNames: ['Doe', 'Davis', 'Johnson', 'Williams'] },
        { role: 'System Support', emailDomain: 'lepa.gov', firstNames: ['Jane', 'David', 'Lisa', 'Robert'], lastNames: ['Smith', 'Brown', 'Wilson', 'Miller'] },
        { role: 'Government Monitor', emailDomain: 'lepa.gov', firstNames: ['Michael', 'Robert', 'Patricia', 'James'], lastNames: ['Johnson', 'Miller', 'Anderson', 'Taylor'] },
        { role: 'Tenant Administrator', emailDomain: 'school.edu', firstNames: ['Thomas', 'Jessica', 'Christopher', 'Amanda'], lastNames: ['White', 'Harris', 'Martin', 'Clark'] },
        { role: 'Tenant User', emailDomain: 'school.edu', firstNames: ['Daniel', 'Michelle', 'Matthew', 'Ashley'], lastNames: ['Lewis', 'Walker', 'Hall', 'Allen'] },
    ];

    const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];
    
    // Generate random users with varied distribution
    const dummyUsers: BackendSystemUserData[] = [];
    const totalUsers = 25; // Total number of users to generate
    
    for (let i = 1; i <= totalUsers; i++) {
        // Randomly select user type (weighted towards tenant users)
        const randomType = Math.random();
        let selectedType;
        if (randomType < 0.35) {
            // 35% tenant users
            selectedType = userTypes[5];
        } else if (randomType < 0.50) {
            // 15% tenant administrators
            selectedType = userTypes[4];
        } else if (randomType < 0.65) {
            // 15% system support
            selectedType = userTypes[1];
        } else if (randomType < 0.80) {
            // 15% government monitor
            selectedType = userTypes[2];
        } else if (randomType < 0.90) {
            // 10% government auditor
            selectedType = userTypes[3];
        } else {
            // 10% system administrator
            selectedType = userTypes[0];
        }

        const firstName = selectedType.firstNames[Math.floor(Math.random() * selectedType.firstNames.length)];
        const lastName = selectedType.lastNames[Math.floor(Math.random() * selectedType.lastNames.length)];
        const status = statuses[Math.random() < 0.85 ? 0 : 1]; // 85% active, 15% inactive
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${selectedType.emailDomain}`;
        
        // Random creation date within last 6 months
        const monthsAgo = Math.floor(Math.random() * 6);
        const daysAgo = Math.floor(Math.random() * 30);
        const createdDate = new Date();
        createdDate.setMonth(createdDate.getMonth() - monthsAgo);
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        dummyUsers.push({
            id: String(i),
            email,
            first_name: firstName,
            last_name: lastName,
            role: selectedType.role,
            status,
            created_at: createdDate.toISOString(),
        });
    }
    
    // Shuffle the array to randomize order
    for (let i = dummyUsers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dummyUsers[i], dummyUsers[j]] = [dummyUsers[j], dummyUsers[i]];
    }

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

