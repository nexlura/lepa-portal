'use client';

import { Dialog, DialogBody, DialogTitle, DialogActions } from '@/components/UIKit/Dialog';
import { Button } from '@/components/UIKit/Button';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';
import { useEffect, useState } from 'react';
import { getModel, isErrorResponse } from '@/lib/connector';

type BackendUserDetailData = {
    id: string;
    user_type: string;
    tenant_id?: string;
    agency_id?: string;
    phone: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    created_at: string;
    updated_at?: string;
    roles?: Array<{ id: string; title?: string; name?: string }>;
};

type UserDetailApiResponse = {
    success?: boolean;
    code?: number;
    data?: BackendUserDetailData;
    message?: string;
};

type TenantApiResponse = {
    success?: boolean;
    data?: {
        id: string;
        school_name: string;
    };
};

type AgencyApiResponse = {
    success?: boolean;
    data?: {
        id: string;
        name: string;
    };
};

interface UserDetailsModalProps {
    open: boolean;
    onClose: () => void;
    user: SystemUser | null;
}

const UserDetailsModal = ({ open, onClose, user }: UserDetailsModalProps) => {
    const [fullUser, setFullUser] = useState<BackendUserDetailData | null>(null);
    const [tenantName, setTenantName] = useState<string | null>(null);
    const [agencyName, setAgencyName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch full user details when modal opens
    useEffect(() => {
        if (user?.id && open) {
            setIsLoading(true);
            getModel<UserDetailApiResponse>(`/users/${user.id}`)
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data) {
                        const userData = res.data;
                        setFullUser(userData);

                        // Fetch tenant name if tenant_id exists
                        if (userData.tenant_id) {
                            getModel<TenantApiResponse>(`/tenants/${userData.tenant_id}`)
                                .then((tenantRes) => {
                                    if (tenantRes && !isErrorResponse(tenantRes) && tenantRes.data) {
                                        setTenantName(tenantRes.data.school_name || 'N/A');
                                    }
                                })
                                .catch(() => {
                                    setTenantName('N/A');
                                });
                        }

                        // Fetch agency name if agency_id exists
                        if (userData.agency_id) {
                            getModel<AgencyApiResponse>(`/agencies/${userData.agency_id}`)
                                .then((agencyRes) => {
                                    if (agencyRes && !isErrorResponse(agencyRes) && agencyRes.data) {
                                        setAgencyName(agencyRes.data.name || 'N/A');
                                    }
                                })
                                .catch(() => {
                                    setAgencyName('N/A');
                                });
                        }
                    }
                })
                .catch(() => {
                    // Handle error silently
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setFullUser(null);
            setTenantName(null);
            setAgencyName(null);
        }
    }, [user?.id, open]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formatUserType = (type: string) => {
        switch (type) {
            case 'system':
                return 'System User';
            case 'tenant':
                return 'Tenant User';
            case 'agency':
                return 'Agency User';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1) + ' User';
        }
    };

    const displayUser = fullUser || user;

    if (!displayUser) return null;

    return (
        <Dialog size="xl" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>User Details</DialogTitle>
            <DialogBody className="max-h-[75vh] overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="text-sm text-gray-500">Loading user details...</div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Full Name</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {fullUser?.first_name && fullUser?.last_name
                                        ? `${fullUser.first_name} ${fullUser.last_name}`
                                        : fullUser?.first_name || fullUser?.last_name || user?.name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Email</div>
                                <div className="text-sm text-gray-900">
                                    {fullUser?.email || user?.email || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Phone</div>
                                <div className="text-sm text-gray-900">
                                    {fullUser?.phone || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">User Type</div>
                                <div className="text-sm text-gray-900">
                                    {formatUserType(fullUser?.user_type || user?.userType || 'system')}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Status</div>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        (fullUser?.is_active !== undefined
                                            ? fullUser.is_active
                                            : user?.status === 'active')
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {fullUser?.is_active !== undefined
                                        ? (fullUser.is_active ? 'Active' : 'Inactive')
                                        : user?.status || 'N/A'}
                                </span>
                            </div>
                            {fullUser?.tenant_id && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Tenant</div>
                                    <div className="text-sm text-gray-900">
                                        {tenantName || 'Loading...'}
                                    </div>
                                </div>
                            )}
                            {fullUser?.agency_id && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Agency</div>
                                    <div className="text-sm text-gray-900">
                                        {agencyName || 'Loading...'}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Created At</div>
                                <div className="text-sm text-gray-900">
                                    {formatDate(fullUser?.created_at || user?.createdAt || '')}
                                </div>
                            </div>
                            {fullUser?.updated_at && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                                    <div className="text-sm text-gray-900">
                                        {formatDate(fullUser.updated_at)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Roles Section */}
                        {fullUser?.roles && fullUser.roles.length > 0 && (
                            <div>
                                <div className="text-sm font-medium text-gray-900 mb-3">Assigned Roles</div>
                                <div className="space-y-2">
                                    {fullUser.roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="text-sm text-gray-900">
                                                {role.title || role.name || 'Unnamed Role'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogBody>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailsModal;

