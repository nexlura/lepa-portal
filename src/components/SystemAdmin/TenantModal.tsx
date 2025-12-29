'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Input } from '@/components/UIKit/Input';
import { Button } from '@/components/UIKit/Button';
import { Select } from '@/components/UIKit/Select';
import { FeedbackContext } from '@/context/feedback';
import { postModel, patchModel, getModel, isErrorResponse } from '@/lib/connector';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

export type TenantFormData = {
    domain: string;
    schoolName: string;
    address: string;
    phone: string;
    level: 'kindergarten' | 'nursery' | 'primary' | 'secondary';
    code: string;
    agencyId: string;
    status: 'active' | 'inactive';
}

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
        agencies?: BackendAgencyData[];
        total?: number;
        total_pages?: number;
    };
};

const TenantModal = ({
    open,
    onClose,
    tenant,
}: {
    open: boolean;
    onClose: (open: boolean) => void;
    tenant?: Tenant | null;
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { setFeedback } = useContext(FeedbackContext);

    const isEditMode = !!tenant;

    const [form, setForm] = useState<TenantFormData>({
        domain: '',
        schoolName: '',
        address: '',
        phone: '',
        level: 'primary',
        code: '',
        agencyId: '',
        status: 'active',
    });

    const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
    const [isLoadingTenant, setIsLoadingTenant] = useState(false);

    // Fetch agencies for dropdown
    useEffect(() => {
        if (open) {
            setIsLoadingAgencies(true);
            getModel<AgenciesApiResponse>('/agencies?limit=100')
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data?.agencies) {
                        const transformedAgencies = res.data.agencies.map((agency: BackendAgencyData) => ({
                            id: agency.id,
                            name: agency.name,
                        }));
                        setAgencies(transformedAgencies);
                    }
                })
                .catch((error) => {
                    console.warn('Error fetching agencies:', error);
                })
                .finally(() => {
                    setIsLoadingAgencies(false);
                });
        }
    }, [open]);

    // Fetch full tenant details when editing
    useEffect(() => {
        if (tenant?.id && open && isEditMode) {
            setIsLoadingTenant(true);
            getModel<TenantDetailApiResponse>(`/tenants/${tenant.id}`)
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data) {
                        const tenantData = res.data;
                        // Convert is_active boolean to status string
                        const isActive = tenantData.is_active !== undefined ? tenantData.is_active : (tenantData.status === 'active');
                        setForm({
                            domain: tenantData.domain || '',
                            schoolName: tenantData.school_name,
                            address: tenantData.address || '',
                            phone: tenantData.phone || '',
                            level: (tenantData.level as 'kindergarten' | 'nursery' | 'primary' | 'secondary') || 'primary',
                            code: tenantData.code || '',
                            agencyId: tenantData.agency_id || '',
                            status: isActive ? 'active' : 'inactive',
                        });
                        setErrors({});
                    }
                })
                .catch((error) => {
                    console.warn('Error fetching tenant details:', error);
                    // Fallback to passed tenant data
                    if (tenant) {
                        setForm({
                            domain: tenant.domain || '',
                            schoolName: tenant.name,
                            address: tenant.address || '',
                            phone: tenant.phone || '',
                            level: tenant.level || 'primary',
                            code: tenant.code || '',
                            agencyId: tenant.agencyId || '',
                            status: tenant.status || 'active',
                        });
                    }
                })
                .finally(() => {
                    setIsLoadingTenant(false);
                });
        } else if (!tenant) {
            // Reset form for create mode
            setForm({
                domain: '',
                schoolName: '',
                address: '',
                phone: '',
                level: 'primary',
                code: '',
                agencyId: '',
                status: 'active',
            });
            setErrors({});
        }
    }, [tenant?.id, open, isEditMode]);

    // Check if form is valid for submission
    const isFormValid = () => {
        return (
            form.domain.trim() !== '' &&
            form.schoolName.trim() !== '' &&
            form.address.trim() !== '' &&
            form.phone.trim() !== '' &&
            form.level !== '' &&
            form.agencyId !== ''
        );
    };

    const validate = () => {
        const next: Partial<Record<keyof TenantFormData, string>> = {};
        
        // Domain validation - supports subdomains (e.g., school.lepa.cc)
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        
        if (!form.domain.trim()) {
            next.domain = 'Domain is required';
        } else if (form.domain.trim().length < 3 || form.domain.trim().length > 100) {
            next.domain = 'Domain must be between 3 and 100 characters';
        } else if (!domainRegex.test(form.domain.trim())) {
            next.domain = 'Enter a valid domain (e.g., school.lepa.cc)';
        }
        
        // School name validation
        if (!form.schoolName.trim()) {
            next.schoolName = 'School name is required';
        } else if (form.schoolName.trim().length < 2 || form.schoolName.trim().length > 100) {
            next.schoolName = 'School name must be between 2 and 100 characters';
        }
        
        // Address validation
        if (!form.address.trim()) {
            next.address = 'Address is required';
        } else if (form.address.trim().length < 5 || form.address.trim().length > 200) {
            next.address = 'Address must be between 5 and 200 characters';
        }
        
        // Phone validation
        if (!form.phone.trim()) {
            next.phone = 'Phone is required';
        } else if (form.phone.trim().length < 10 || form.phone.trim().length > 20) {
            next.phone = 'Phone must be between 10 and 20 characters';
        }
        
        // Level validation
        if (!form.level) {
            next.level = 'Level is required';
        }
        
        // Code validation (optional)
        if (form.code.trim() && (form.code.trim().length < 2 || form.code.trim().length > 50)) {
            next.code = 'Code must be between 2 and 50 characters if provided';
        }
        
        // Agency validation
        if (!form.agencyId) {
            next.agencyId = 'Agency is required';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        if (isEditMode && !tenant) return;

        setIsLoading(true);

        try {
            if (isEditMode && tenant) {
                // Edit mode: PATCH request with only changed fields
                const updateData: Partial<{
                    domain: string;
                    school_name: string;
                    address: string;
                    phone: string;
                    level: string;
                    code?: string;
                    agency_id: string;
                    is_active: boolean;
                }> = {};

                // Get current tenant data for comparison (use form data as source of truth since we fetched it)
                const currentTenant = tenant;
                
                // Only include fields if they're different from current
                if (form.domain.trim() !== (currentTenant.domain || '')) {
                    updateData.domain = form.domain.trim();
                }
                if (form.schoolName.trim() !== currentTenant.name) {
                    updateData.school_name = form.schoolName.trim();
                }
                if (form.address.trim() !== (currentTenant.address || '')) {
                    updateData.address = form.address.trim();
                }
                if (form.phone.trim() !== (currentTenant.phone || '')) {
                    updateData.phone = form.phone.trim();
                }
                if (form.level !== (currentTenant.level || 'primary')) {
                    updateData.level = form.level;
                }
                if (form.code.trim() !== (currentTenant.code || '')) {
                    updateData.code = form.code.trim() || undefined;
                }
                if (form.agencyId !== (currentTenant.agencyId || '')) {
                    updateData.agency_id = form.agencyId;
                }
                // Convert status string to boolean for is_active
                const currentIsActive = (currentTenant.status || 'active') === 'active';
                const newIsActive = form.status === 'active';
                if (newIsActive !== currentIsActive) {
                    updateData.is_active = newIsActive;
                }

                // Only send request if there are changes
                if (Object.keys(updateData).length === 0) {
                    setFeedback({ 
                        status: 'success', 
                        text: 'No changes to save' 
                    });
                    handleClose();
                    return;
                }

                const response = await patchModel(`/tenants/${tenant.id}`, updateData);

                if (isErrorResponse(response)) {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to update tenant' 
                    });
                } else {
                    setFeedback({ 
                        status: 'success', 
                        text: 'Tenant updated successfully!' 
                    });
                    handleClose();
                    router.refresh();
                }
            } else {
                // Create mode: POST request
                const response = await postModel('/tenants', {
                    domain: form.domain.trim(),
                    school_name: form.schoolName.trim(),
                    address: form.address.trim(),
                    phone: form.phone.trim(),
                    level: form.level,
                    code: form.code.trim() || undefined,
                    agency_id: form.agencyId,
                    is_active: form.status === 'active',
                });

                if (isErrorResponse(response)) {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to create tenant' 
                    });
                } else {
                    setFeedback({ 
                        status: 'success', 
                        text: 'Tenant created successfully!' 
                    });
                    handleClose();
                    router.refresh();
                }
            }
        } catch (error: any) {
            setFeedback({ 
                status: 'error', 
                text: error?.message || 'An unexpected error occurred' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose(false);
        if (isEditMode && tenant) {
            setForm({
                domain: tenant.domain || '',
                schoolName: tenant.name,
                address: tenant.address || '',
                phone: tenant.phone || '',
                level: tenant.level || 'primary',
                code: tenant.code || '',
                agencyId: tenant.agencyId || '',
                status: tenant.status || 'active',
            });
        } else {
            setForm({
                domain: '',
                schoolName: '',
                address: '',
                phone: '',
                level: 'primary',
                code: '',
                agencyId: '',
                status: 'active',
            });
        }
        setErrors({});
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>{isEditMode ? 'Edit Tenant' : 'Create New Tenant'}</DialogTitle>
            <DialogDescription>
                {isEditMode 
                    ? 'Update tenant information. Only changed fields will be updated.'
                    : 'Add a new school tenant to the system.'
                }
            </DialogDescription>
            <DialogBody>
                {isLoadingTenant ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-gray-500">Loading tenant details...</div>
                    </div>
                ) : (
                <div className="mt-4 space-y-4">
                    {/* Row 1: Domain and School Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">Domain</Label>
                            <Input
                                type="text"
                                placeholder="e.g., school.lepa.cc"
                                value={form.domain}
                                onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                                invalid={Boolean(errors.domain)}
                            />
                            {errors.domain ? <ErrorMessage>{errors.domain}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">School Name</Label>
                            <Input
                                type="text"
                                placeholder="e.g., Springfield High School"
                                value={form.schoolName}
                                onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
                                invalid={Boolean(errors.schoolName)}
                            />
                            {errors.schoolName ? <ErrorMessage>{errors.schoolName}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 2: Level and Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Select
                                label="Level"
                                value={form.level}
                                onChange={(value: string) => setForm((f) => ({ ...f, level: value as 'kindergarten' | 'nursery' | 'primary' | 'secondary' }))}
                                options={[
                                    { value: 'kindergarten', label: 'Kindergarten' },
                                    { value: 'nursery', label: 'Nursery' },
                                    { value: 'primary', label: 'Primary' },
                                    { value: 'secondary', label: 'Secondary' },
                                ]}
                                placeholder="Select level..."
                                error={errors.level}
                            />
                        </Field>

                        <Field>
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={(value: string) => setForm((f) => ({ ...f, status: value as 'active' | 'inactive' }))}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]}
                                placeholder="Select status..."
                                error={errors.status}
                            />
                        </Field>
                    </div>

                    {/* Row 3: Agency */}
                    <Field>
                        <Select
                            label="Agency"
                            value={form.agencyId}
                            onChange={(value: string) => setForm((f) => ({ ...f, agencyId: value }))}
                            options={agencies.map((agency) => ({
                                value: agency.id,
                                label: agency.name,
                            }))}
                            placeholder={isLoadingAgencies ? "Loading agencies..." : "Select agency..."}
                            error={errors.agencyId}
                            disabled={isLoadingAgencies}
                        />
                        {errors.agencyId ? <ErrorMessage>{errors.agencyId}</ErrorMessage> : null}
                    </Field>

                    {/* Row 4: Address */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Address</Label>
                        <Input
                            type="text"
                            placeholder="e.g., 123 Main Street, City, State"
                            value={form.address}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                            invalid={Boolean(errors.address)}
                        />
                        {errors.address ? <ErrorMessage>{errors.address}</ErrorMessage> : null}
                    </Field>

                    {/* Row 5: Phone and Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">Phone</Label>
                            <Input
                                type="tel"
                                placeholder="e.g., +1234567890"
                                value={form.phone}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                invalid={Boolean(errors.phone)}
                            />
                            {errors.phone ? <ErrorMessage>{errors.phone}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">
                                Code <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., SCH001"
                                value={form.code}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                                invalid={Boolean(errors.code)}
                            />
                            {errors.code ? <ErrorMessage>{errors.code}</ErrorMessage> : null}
                        </Field>
                    </div>
                </div>
                )}
            </DialogBody>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading || isLoadingTenant || !isFormValid()}
                >
                    {isLoading 
                        ? (isEditMode ? 'Updating...' : 'Creating...') 
                        : (isEditMode ? 'Update Tenant' : 'Create Tenant')
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TenantModal;

