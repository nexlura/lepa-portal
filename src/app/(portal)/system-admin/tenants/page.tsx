import TenantsView from '@/components/SystemAdmin/TenantsView';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendTenantData = {
    id: string;
    school_name: string;
    status?: string;
    is_active?: boolean;
    created_at: string;
    domain?: string;
    address?: string;
    phone?: string;
    level?: string;
    code?: string;
    agency_id?: string;
    total_students?: number;
    total_teachers?: number;
    total_classes?: number;
};

type TenantsApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendTenantData[];
    message?: string;
};

export type Tenant = {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    domain?: string;
    address?: string;
    phone?: string;
    level?: 'kindergarten' | 'nursery' | 'primary' | 'secondary';
    code?: string;
    agencyId?: string;
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
    let tenants: Tenant[] = [];
    let totalPages = 1;
    
    try {
        // Get page from searchParams
        const resolvedSearchParams = await searchParams;
        const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1;
        const pageParam = currentPage > 1 ? `&page=${currentPage}` : '';
        
        const res = await getModel<TenantsApiResponse>(`/tenants?limit=10${pageParam}`).catch(() => {
            // Silently handle errors - don't log to avoid console noise
            return null;
        });
        
        // Check if response is null or undefined
        if (!res) {
            return (
                <TenantsView tenants={tenants} totalPages={totalPages} />
            );
        }
        
        // Check if response is an error
        if (isErrorResponse(res)) {
            return (
                <TenantsView tenants={tenants} totalPages={totalPages} />
            );
        }
        
        // Check if response has data
        if (res.data && Array.isArray(res.data)) {
            const backendTenants = res.data;
            totalPages = 1; // API doesn't return pagination info in this response
            
            // Transform backend data to frontend format
            tenants = backendTenants.map((tenant: BackendTenantData) => {
                // Convert is_active boolean to status string, fallback to status string if is_active not present
                const isActive = tenant.is_active !== undefined ? tenant.is_active : (tenant.status === 'active');
                return {
                    id: tenant.id,
                    name: tenant.school_name,
                    status: isActive ? 'active' : 'inactive' as 'active' | 'inactive',
                    domain: tenant.domain,
                    address: tenant.address,
                    phone: tenant.phone,
                    level: tenant.level as 'kindergarten' | 'nursery' | 'primary' | 'secondary' | undefined,
                    code: tenant.code,
                    agencyId: tenant.agency_id,
                    studentCount: tenant.total_students || 0,
                    teacherCount: tenant.total_teachers || 0,
                    classCount: tenant.total_classes || 0,
                    createdAt: tenant.created_at,
                };
            });
        }
    } catch {
        // Handle all errors gracefully without throwing
        // Use empty array as fallback - page will show empty state
        // Don't log errors to avoid console noise and Next.js fetchData errors
    }

    return (
        <TenantsView tenants={tenants} totalPages={totalPages} />
    );
};

export default TenantsPage;

