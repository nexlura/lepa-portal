'use client';

import { Dialog, DialogBody, DialogTitle, DialogActions } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';
import { useEffect, useState } from 'react';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendTenantDetailData = {
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

type TenantDetailApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendTenantDetailData;
    message?: string;
};

type AgenciesApiResponse = {
    data?: {
        agencies?: Agency[];
        total?: number;
        total_pages?: number;
    };
};

interface TenantDetailsModalProps {
    open: boolean;
    onClose: () => void;
    tenant: Tenant | null;
    onEdit: (tenant: Tenant) => void;
}

const TenantDetailsModal = ({ open, onClose, tenant, onEdit }: TenantDetailsModalProps) => {
    const [fullTenant, setFullTenant] = useState<Tenant | null>(null);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch full tenant details when modal opens
    useEffect(() => {
        if (tenant?.id && open) {
            setIsLoading(true);
            getModel<TenantDetailApiResponse>(`/tenants/${tenant.id}`)
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data) {
                        const tenantData = res.data;
                        // Convert is_active boolean to status string
                        const isActive = tenantData.is_active !== undefined ? tenantData.is_active : (tenantData.status === 'active');
                        const transformedTenant: Tenant = {
                            id: tenantData.id,
                            name: tenantData.school_name,
                            status: isActive ? 'active' : 'inactive',
                            domain: tenantData.domain,
                            address: tenantData.address,
                            phone: tenantData.phone,
                            level: tenantData.level as 'kindergarten' | 'nursery' | 'primary' | 'secondary' | undefined,
                            code: tenantData.code,
                            agencyId: tenantData.agency_id,
                            studentCount: tenantData.total_students || 0,
                            teacherCount: tenantData.total_teachers || 0,
                            classCount: tenantData.total_classes || 0,
                            createdAt: tenantData.created_at,
                        };
                        setFullTenant(transformedTenant);

                        // Fetch agency if agency_id exists
                        if (tenantData.agency_id) {
                            getModel<AgenciesApiResponse>(`/agencies/${tenantData.agency_id}`)
                                .then((agencyRes) => {
                                    if (agencyRes && !isErrorResponse(agencyRes) && agencyRes.data) {
                                        // Handle single agency response
                                        const agencyData = (agencyRes.data as any).agency || agencyRes.data;
                                        if (agencyData) {
                                            setAgency({
                                                id: agencyData.id,
                                                name: agencyData.name,
                                                type: agencyData.type || 'default',
                                                status: agencyData.status || 'active',
                                                domain: agencyData.domain || 'N/A',
                                                tenantCount: agencyData.managed_schools_count || 0,
                                                createdAt: agencyData.created_at || '',
                                                region: agencyData.region || 'N/A',
                                                contactEmail: agencyData.contact_email || 'N/A',
                                            });
                                        }
                                    }
                                })
                                .catch((error) => {
                                    console.warn('Error fetching agency:', error);
                                });
                        } else {
                            setAgency(null);
                        }
                    }
                })
                .catch((error) => {
                    console.warn('Error fetching tenant details:', error);
                    // Fallback to passed tenant data
                    setFullTenant(tenant);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setFullTenant(tenant);
            setAgency(null);
        }
    }, [tenant?.id, open]);

    // Use full tenant data if available, otherwise fallback to passed tenant
    const displayTenant = fullTenant || tenant;
    
    if (!displayTenant) return null;
    
    if (isLoading) {
        return (
            <Dialog size="lg" open={open} onClose={onClose} className="relative z-20">
                <DialogTitle>Tenant Details</DialogTitle>
                <DialogBody>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-gray-500">Loading tenant details...</div>
                    </div>
                </DialogBody>
            </Dialog>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelLabel = (level?: string) => {
        switch (level) {
            case 'kindergarten':
                return 'Kindergarten';
            case 'nursery':
                return 'Nursery';
            case 'primary':
                return 'Primary';
            case 'secondary':
                return 'Secondary';
            default:
                return level || 'N/A';
        }
    };

    const handleEdit = () => {
        onClose();
        // Use full tenant data if available for editing
        onEdit(fullTenant || tenant!);
    };

    return (
        <Dialog size="lg" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogBody>
                <div className="space-y-4">
                    {/* School Name */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{displayTenant.name}</h3>
                        {displayTenant.domain && (
                            <p className="mt-1 text-sm text-gray-500">{displayTenant.domain}</p>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.domain || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</dt>
                            <dd className="mt-1">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(displayTenant.status)}`}>
                                    {displayTenant.status}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Level</dt>
                            <dd className="mt-1 text-sm text-gray-900">{getLevelLabel(displayTenant.level)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Code</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.code || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.address || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.phone || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</dt>
                            <dd className="mt-1 text-sm text-gray-900">{agency?.name || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Students</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.studentCount}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.teacherCount}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</dt>
                            <dd className="mt-1 text-sm text-gray-900">{displayTenant.classCount}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(displayTenant.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant ID</dt>
                            <dd className="mt-1 text-sm text-gray-500 font-mono">{displayTenant.id}</dd>
                        </div>
                    </div>
                </div>
            </DialogBody>
            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
                <Button color="primary" onClick={handleEdit}>
                    Edit Tenant
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TenantDetailsModal;

