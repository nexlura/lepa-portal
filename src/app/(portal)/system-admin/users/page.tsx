import SystemUsersView from '@/components/SystemAdmin/SystemUsersView';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendSystemUserData = {
    id: string;
    user_type: string;
    tenant_id?: string;
    phone: string;
    email: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    roles?: string[];
    created_at: string;
    updated_at?: string;
};

type SystemUsersApiResponse = {
    success?: boolean;
    code?: number;
    data?: {
        limit?: number;
        page?: number;
        total_items?: number;
        total_pages?: number;
        users?: BackendSystemUserData[];
    };
    message?: string;
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
    let users: SystemUser[] = [];
    let totalPages = 1;
    
    try {
        // Get page from searchParams
        const resolvedSearchParams = await searchParams;
        const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page, 10) : 1;
        const pageParam = currentPage > 1 ? `&page=${currentPage}` : '';
        
        const res = await getModel<SystemUsersApiResponse>(`/users?limit=10${pageParam}`).catch((error: any) => {
            // Catch any errors from getModel, including auth/session errors
            // Suppress JSON parse errors and ClientFetchErrors as they're handled gracefully
            const errorMessage = error?.message || String(error || '');
            if (errorMessage.includes('JSON.parse') || 
                errorMessage.includes('unexpected end of data') || 
                errorMessage.includes('ClientFetchError')) {
                // Silently handle auth/session errors - they're expected in some contexts
                return null;
            }
            // Don't log errors to avoid console noise
            return null;
        });
        
        // Check if response is null or undefined
        if (!res) {
            return (
                <SystemUsersView users={users} totalPages={totalPages} />
            );
        }
        
        // Check if response is an error
        if (isErrorResponse(res)) {
            return (
                <SystemUsersView users={users} totalPages={totalPages} />
            );
        }
        
        // Check if response has data
        if (res.data && res.data.users && Array.isArray(res.data.users)) {
            const backendUsers = res.data.users;
            totalPages = typeof res.data.total_pages === 'number' ? res.data.total_pages : 1;
            
            // Transform backend data to frontend format
            users = backendUsers.map((user: BackendSystemUserData) => {
        const fullName = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
                    : (user.email || '').split('@')[0] || 'Unknown';

                // Determine role to display: use first role from roles array, or user_type as fallback
                const displayRole = user.roles && user.roles.length > 0 
                    ? user.roles[0] 
                    : (user.user_type === 'system' ? 'System User' : 'Tenant User');

                // Convert is_active boolean to status string
                const isActive = user.is_active !== undefined ? user.is_active : true;

        return {
            id: user.id,
            name: fullName,
                    email: user.email || '',
                    role: displayRole,
                    status: isActive ? 'active' : 'inactive' as 'active' | 'inactive',
                    createdAt: user.created_at || new Date().toISOString(),
        };
    });
        }
    } catch (error: any) {
        // Handle all errors gracefully without throwing
        // Use empty array as fallback - page will show empty state
        // Don't log errors to avoid console noise and Next.js fetchData errors
    }

    return (
        <SystemUsersView users={users} totalPages={totalPages} />
    );
};

export default SystemUsersPage;

