import AgencyTenantsView from '@/components/Agency/AgencyTenantsView';
import { getModel, isErrorResponse } from '@/lib/connector';
import { auth } from '@/auth';

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

const AgencyTenantsPage = async ({ searchParams }: PageProps) => {
    let tenants: Tenant[] = [];
    let totalPages = 1;

    // Get current user session to determine agency_id
    const session = await auth().catch(() => null);
    const userId = session?.user?.userId;

    // Fetch user data to get agency_id
    let agencyId: string | null = null;
    if (userId) {
        try {
            const userRes = await getModel<{
                success?: boolean;
                data?: {
                    id: string;
                    agency_id?: string;
                };
            }>(`/users/${userId}`).catch(() => null);

            if (userRes && !isErrorResponse(userRes) && userRes.data?.agency_id) {
                agencyId = userRes.data.agency_id;
            }
        } catch {
            // Silently handle errors
        }
    }

    try {
        // Get page from searchParams
        const resolvedSearchParams = await searchParams;
        const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1;
        const pageParam = currentPage > 1 ? `&page=${currentPage}` : '';
        
        // Fetch tenants filtered by agency_id
        const agencyFilter = agencyId ? `&agency_id=${agencyId}` : '';
        const res = await getModel<TenantsApiResponse>(`/tenants?limit=10${pageParam}${agencyFilter}`).catch(() => {
            return null;
        });

        if (res && !isErrorResponse(res) && res.data && Array.isArray(res.data)) {
            tenants = res.data.map((tenant: BackendTenantData) => {
                const isActive = tenant.is_active !== undefined ? tenant.is_active : (tenant.status === 'active');

                return {
                    id: tenant.id,
                    name: tenant.school_name || 'Unknown School',
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
                    createdAt: tenant.created_at || new Date().toISOString(),
                };
            });
        }
    } catch {
        // Handle all errors gracefully without throwing
    }

    return (
        <AgencyTenantsView tenants={tenants} totalPages={totalPages} />
    );
};

export default AgencyTenantsPage;

