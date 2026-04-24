import AgencyUsersView from '@/components/Agency/AgencyUsersView';
import { getModel, isErrorResponse } from '@/lib/connector';
import { auth } from '@/auth';

type BackendAgencyUserData = {
    id: string;
    user_type: string;
    tenant_id?: string;
    agency_id?: string;
    phone: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    roles?: string[];
    created_at: string;
    updated_at?: string;
};

type AgencyUsersApiResponse = {
    success?: boolean;
    code?: number;
    data?: {
        limit?: number;
        page?: number;
        total_items?: number;
        total_pages?: number;
        users?: BackendAgencyUserData[];
    };
    message?: string;
};

export type AgencyUser = {
    id: string;
    name: string;
    email: string;
    userType: string;
    status: 'active' | 'inactive';
    tenantId?: string;
    createdAt: string;
};

export type PageProps = {
    params: Promise<{ pageNumber?: string }>;
    searchParams: Promise<{ page?: string }>;
};

const AgencyUsersPage = async ({ searchParams }: PageProps) => {
    let users: AgencyUser[] = [];
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
        
        // Fetch users filtered by agency_id and user_type=tenant only
        const agencyFilter = agencyId ? `&agency_id=${agencyId}` : '';
        const userTypeFilter = '&user_type=tenant';
        const res = await getModel<AgencyUsersApiResponse>(`/users?limit=10${pageParam}${agencyFilter}${userTypeFilter}`).catch(() => {
            return null;
        });

        if (res && !isErrorResponse(res) && res.data && res.data.users && Array.isArray(res.data.users)) {
            const backendUsers = res.data.users;
            totalPages = typeof res.data.total_pages === 'number' && res.data.total_pages > 0 ? res.data.total_pages : 1;
            
            // Transform backend data to frontend format
            users = backendUsers.map((user: BackendAgencyUserData) => {
                const fullName = user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : (user.email || '').split('@')[0] || 'Unknown';

                // Convert is_active boolean to status string
                const isActive = user.is_active !== undefined ? user.is_active : true;

                return {
                    id: user.id,
                    name: fullName,
                    email: user.email || '',
                    userType: 'Tenant User',
                    status: isActive ? 'active' : 'inactive' as 'active' | 'inactive',
                    tenantId: user.tenant_id,
                    createdAt: user.created_at || new Date().toISOString(),
                };
            });
        }
    } catch {
        // Handle all errors gracefully without throwing
    }

    return (
        <AgencyUsersView users={users} totalPages={totalPages} agencyId={agencyId} />
    );
};

export default AgencyUsersPage;

