import AgenciesView from '@/components/SystemAdmin/AgenciesView';

type BackendAgencyData = {
    id: string;
    name: string;
    type: string;
    status: string;
    tenant_count?: number;
    created_at: string;
    region?: string;
    contact_email?: string;
};

export type Agency = {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'suspended';
    tenantCount: number;
    createdAt: string;
    region: string;
    contactEmail: string;
};

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

const AgenciesPage = async ({ searchParams }: PageProps) => {
    // TODO: Replace with API data once endpoint is ready
    // Dummy data for agencies
    const dummyAgencies: BackendAgencyData[] = [
        {
            id: '1',
            name: 'Ministry of Education',
            type: 'Ministry',
            status: 'active',
            created_at: '2024-01-01T10:00:00Z',
            tenant_count: 8,
            region: 'National',
            contact_email: 'contact@moe.gov',
        },
        {
            id: '2',
            name: 'District Education Office - North',
            type: 'District Office',
            status: 'active',
            created_at: '2024-01-15T14:30:00Z',
            tenant_count: 3,
            region: 'Northern District',
            contact_email: 'north@deo.gov',
        },
        {
            id: '3',
            name: 'State Education Board - Central',
            type: 'State/County Board',
            status: 'active',
            created_at: '2024-02-01T09:15:00Z',
            tenant_count: 5,
            region: 'Central State',
            contact_email: 'central@seb.gov',
        },
        {
            id: '4',
            name: 'District Education Office - South',
            type: 'District Office',
            status: 'active',
            created_at: '2024-02-10T11:45:00Z',
            tenant_count: 4,
            region: 'Southern District',
            contact_email: 'south@deo.gov',
        },
        {
            id: '5',
            name: 'County Education Board - West',
            type: 'State/County Board',
            status: 'suspended',
            created_at: '2024-01-20T08:30:00Z',
            tenant_count: 2,
            region: 'Western County',
            contact_email: 'west@ceb.gov',
        },
        {
            id: '6',
            name: 'Ministry of Education - Regional Branch',
            type: 'Ministry',
            status: 'active',
            created_at: '2024-03-01T13:20:00Z',
            tenant_count: 6,
            region: 'Eastern Region',
            contact_email: 'east@moe.gov',
        },
    ];

    const transformedData: Agency[] = dummyAgencies.map((agency: BackendAgencyData) => {
        return {
            id: agency.id,
            name: agency.name,
            type: agency.type,
            status: (agency.status === 'active' ? 'active' : agency.status === 'suspended' ? 'suspended' : 'inactive') as 'active' | 'inactive' | 'suspended',
            tenantCount: agency.tenant_count || 0,
            createdAt: agency.created_at,
            region: agency.region || 'N/A',
            contactEmail: agency.contact_email || 'N/A',
        };
    });

    return (
        <AgenciesView agencies={transformedData} totalPages={1} />
    );
};

export default AgenciesPage;

