import AgenciesView from '@/components/SystemAdmin/AgenciesView';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendAgencyData = {
    id: string;
    name: string;
    type: string;
    status: string;
    domain?: string;
    managed_schools_count?: number;
    tenant_count?: number;
    created_at: string;
    region?: string;
    contact_email?: string;
};

type AgenciesApiResponse = {
    data?: {
        agencies?: BackendAgencyData[];
        total?: number;
        total_pages?: number;
    };
};

export type Agency = {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'suspended';
    domain: string;
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
    let agencies: Agency[] = [];
    let totalPages = 1;
    
    try {
        const res = await getModel<AgenciesApiResponse>('/agencies?limit=10');
        
        if (res && !isErrorResponse(res) && res.data) {
            const backendAgencies = Array.isArray(res.data.agencies) ? res.data.agencies : [];
            totalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 1;
            
            // Transform backend data to frontend format
            agencies = backendAgencies.map((agency: BackendAgencyData) => {
        return {
            id: agency.id,
            name: agency.name,
            type: agency.type,
            status: (agency.status === 'active' ? 'active' : agency.status === 'suspended' ? 'suspended' : 'inactive') as 'active' | 'inactive' | 'suspended',
            domain: agency.domain || 'N/A',
            tenantCount: agency.managed_schools_count ?? agency.tenant_count ?? 0,
            createdAt: agency.created_at,
            region: agency.region || 'N/A',
            contactEmail: agency.contact_email || 'N/A',
        };
    });
        } else if (isErrorResponse(res)) {
            console.warn('Error response from agencies API:', res.status, res.message);
        }
    } catch (error: any) {
        console.warn('Error fetching agencies:', error?.message || error);
        // Use empty array as fallback
    }

    return (
        <AgenciesView agencies={agencies} totalPages={totalPages} />
    );
};

export default AgenciesPage;

