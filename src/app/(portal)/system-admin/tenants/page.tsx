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
        const res = await getModel<TenantsApiResponse>('/tenants?limit=10').catch((error: any) => {
            // Catch any errors from getModel, including auth/session errors
            if (error?.message?.includes('JSON.parse') || error?.message?.includes('unexpected end of data') || error?.message?.includes('ClientFetchError')) {
                console.warn('Session/auth error when fetching tenants:', error?.message);
            } else {
                console.warn('Error in getModel call:', error?.message || error);
            }
            return null;
        });
        
        // Check if response is null or undefined
        if (!res) {
            console.warn('Empty or failed response from tenants API');
            return (
                <TenantsView tenants={tenants} totalPages={totalPages} />
            );
        }
        
        // Check if response is an error
        if (isErrorResponse(res)) {
            console.warn('Error response from tenants API:', res.status, res.message);
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
        } else {
            console.warn('Invalid response structure from tenants API:', res);
        }
    } catch (error: any) {
        // Handle JSON parse errors and other exceptions
        if (error?.message?.includes('JSON.parse') || error?.message?.includes('unexpected end of data') || error?.message?.includes('ClientFetchError')) {
            console.warn('JSON parse/auth error when fetching tenants:', error?.message);
        } else {
            console.warn('Error fetching tenants:', error?.message || error);
        }
        // Use empty array as fallback
    }

    return (
        <TenantsView tenants={tenants} totalPages={totalPages} />
    );
};

export default TenantsPage;

