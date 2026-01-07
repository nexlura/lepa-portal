'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Input } from '@/components/UIKit/Input';
import { Button } from '@/components/UIKit/Button';
import SearchableSelect, { SearchableSelectOption } from '@/components/UIKit/SearchableSelect';
import { FeedbackContext } from '@/context/feedback';
import { postModel, getModel, isErrorResponse } from '@/lib/connector';

export type UserFormData = {
    userType: 'agency' | 'system' | 'tenant';
    tenantId: string;
    agencyId: string;
    phone: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    roleIds: string[];
}

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

type BackendAgencyData = {
    id: string;
    name: string;
    type?: string;
    status?: string;
    domain?: string;
    created_at?: string;
};

type AgenciesApiResponse = {
    data?: {
        agencies?: BackendAgencyData[];
        total?: number;
        total_pages?: number;
    };
};

interface UserModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
    agencyId?: string;
    restrictToTenantUsers?: boolean; // When true, only allows creating tenant admin users
}

const UserModal = ({
    open,
    onClose,
    agencyId,
    restrictToTenantUsers = false,
}: UserModalProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { setFeedback } = useContext(FeedbackContext);

    const [form, setForm] = useState<UserFormData>({
        userType: restrictToTenantUsers ? 'tenant' : 'system',
        tenantId: '',
        agencyId: agencyId || '',
        phone: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        roleIds: [],
    });

    const [tenants, setTenants] = useState<SearchableSelectOption[]>([]);
    const [agencies, setAgencies] = useState<SearchableSelectOption[]>([]);
    const [roles, setRoles] = useState<SearchableSelectOption[]>([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData | 'confirmPassword', string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTenants, setIsLoadingTenants] = useState(false);
    const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

    // Fetch tenants for dropdown when user type is 'tenant'
    useEffect(() => {
        if (open && form.userType === 'tenant') {
            setIsLoadingTenants(true);
            // Filter by agency_id if provided
            const agencyFilter = agencyId ? `&agency_id=${agencyId}` : '';
            getModel<TenantsApiResponse>(`/tenants?limit=100${agencyFilter}`)
                .then((res) => {
                    // Removed console.log to prevent fetchData errors
                    if (res && !isErrorResponse(res)) {
                        // Handle different response structures
                        let tenantsData: BackendTenantData[] = [];
                        
                        if (Array.isArray(res.data)) {
                            // Direct array response
                            tenantsData = res.data;
                        } else if (res.data && Array.isArray((res.data as any).tenants)) {
                            // Nested tenants array
                            tenantsData = (res.data as any).tenants;
                        } else if (Array.isArray(res)) {
                            // Response is directly an array
                            tenantsData = res;
                        }
                        
                        if (tenantsData.length > 0) {
                            const transformedTenants: SearchableSelectOption[] = tenantsData.map((tenant: BackendTenantData) => ({
                                id: tenant.id,
                                name: tenant.school_name || 'Unnamed Tenant',
                            }));
                            // Removed console.log to prevent fetchData errors
                            setTenants(transformedTenants);
                        } else {
                            // Removed console.warn to prevent fetchData errors
                            setTenants([]);
                        }
                    } else if (isErrorResponse(res)) {
                        // Removed console.error to prevent fetchData errors
                        setTenants([]);
                    }
                })
                .catch((error) => {
                    // Removed console.error to prevent fetchData errors
                    setTenants([]);
                })
                .finally(() => {
                    setIsLoadingTenants(false);
                });
        } else {
            setTenants([]);
        }
    }, [open, form.userType, agencyId]);

    // Fetch agencies for dropdown when user type is 'agency'
    useEffect(() => {
        if (open && form.userType === 'agency') {
            setIsLoadingAgencies(true);
            getModel<AgenciesApiResponse>('/agencies?limit=100')
                .then((res) => {
                    // Removed console.log to prevent fetchData errors
                    if (res && !isErrorResponse(res)) {
                        // Handle different response structures
                        let agenciesData: BackendAgencyData[] = [];
                        
                        if (res.data) {
                            if (Array.isArray(res.data.agencies)) {
                                // Nested agencies array
                                agenciesData = res.data.agencies;
                            } else if (Array.isArray(res.data)) {
                                // Direct array in data
                                agenciesData = res.data;
                            }
                        } else if (Array.isArray(res)) {
                            // Response is directly an array
                            agenciesData = res;
                        } else if (Array.isArray((res as any).agencies)) {
                            // Agencies at root level
                            agenciesData = (res as any).agencies;
                        }
                        
                        if (agenciesData.length > 0) {
                            const transformedAgencies: SearchableSelectOption[] = agenciesData.map((agency: BackendAgencyData) => ({
                                id: agency.id,
                                name: agency.name || 'Unnamed Agency',
                            }));
                            // Removed console.log to prevent fetchData errors
                            setAgencies(transformedAgencies);
                        } else {
                            // Removed console.warn to prevent fetchData errors
                            setAgencies([]);
                        }
                    } else if (isErrorResponse(res)) {
                        // Removed console.error to prevent fetchData errors
                        setAgencies([]);
                    }
                })
                .catch((error) => {
                    // Removed console.error to prevent fetchData errors
                    setAgencies([]);
                })
                .finally(() => {
                    setIsLoadingAgencies(false);
                });
        } else {
            setAgencies([]);
        }
    }, [open, form.userType]);

    // Fetch roles when modal opens or session changes
    useEffect(() => {
        if (open) {
            fetchRoles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, session?.user?.role]);

    const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
            const response = await getModel<{
                success?: boolean;
                data?: {
                    roles?: Array<{ id: string; title?: string; name?: string; code?: string }>;
                } | Array<{ id: string; title?: string; name?: string; code?: string }>;
                roles?: Array<{ id: string; title?: string; name?: string; code?: string }>;
            }>('/rbac/roles?limit=100').catch(() => null);

            if (response && !isErrorResponse(response)) {
                let rolesList: Array<{ id: string; title?: string; name?: string; code?: string }> = [];
                
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        rolesList = response.data;
                    } else if (response.data.roles && Array.isArray(response.data.roles)) {
                        rolesList = response.data.roles;
                    }
                } else if (response.roles && Array.isArray(response.roles)) {
                    rolesList = response.roles;
                }

                // Get current user's role from session
                const currentUserRole = session?.user?.role?.toLowerCase() || '';
                const isAgencyAdmin = currentUserRole.includes('agency');
                const isTenantAdmin = currentUserRole.includes('tenant') && !isAgencyAdmin;

                // Helper function to check if role matches allowed roles
                const matchesRole = (roleName: string, roleCode: string, allowedRoles: string[]): boolean => {
                    const lowerName = roleName.toLowerCase();
                    const lowerCode = roleCode.toLowerCase();
                    return allowedRoles.some(allowed => {
                        const lowerAllowed = allowed.toLowerCase();
                        // Check for exact match or word boundary match
                        return lowerName === lowerAllowed || 
                               lowerCode === lowerAllowed ||
                               lowerName.includes(` ${lowerAllowed} `) ||
                               lowerName.startsWith(`${lowerAllowed} `) ||
                               lowerName.endsWith(` ${lowerAllowed}`) ||
                               lowerCode.includes(` ${lowerAllowed} `) ||
                               lowerCode.startsWith(`${lowerAllowed} `) ||
                               lowerCode.endsWith(` ${lowerAllowed}`);
                    });
                };

                // Filter roles based on current user's role
                let allowedRoles = rolesList;
                if (isAgencyAdmin) {
                    // Agency admins can only assign "admin" and "teacher" roles
                    allowedRoles = rolesList.filter(role => {
                        const roleName = role.title || role.name || '';
                        const roleCode = role.code || '';
                        return matchesRole(roleName, roleCode, ['admin', 'teacher']);
                    });
                } else if (isTenantAdmin) {
                    // Tenant admins can only assign "admin", "teacher", "student", and "parent" roles
                    allowedRoles = rolesList.filter(role => {
                        const roleName = role.title || role.name || '';
                        const roleCode = role.code || '';
                        return matchesRole(roleName, roleCode, ['admin', 'teacher', 'student', 'parent']);
                    });
                }
                // System admins can assign all roles (no filtering)

                setRoles(
                    allowedRoles.map(role => ({
                        id: role.id,
                        name: role.title || role.name || 'Unnamed Role',
                    }))
                );
            }
        } catch (error: any) {
            // Removed console.error to prevent fetchData errors
        } finally {
            setIsLoadingRoles(false);
        }
    };

    // Reset form when modal opens or closes
    useEffect(() => {
        if (open) {
            // Reset form when modal opens to ensure clean state
            setForm({
                userType: restrictToTenantUsers ? 'tenant' : 'system',
                tenantId: '',
                agencyId: agencyId || '',
                phone: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
                roleIds: [],
            });
            setConfirmPassword('');
            setErrors({});
        } else {
            // Also reset when modal closes
            setForm({
                userType: restrictToTenantUsers ? 'tenant' : 'system',
                tenantId: '',
                agencyId: agencyId || '',
                phone: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
                roleIds: [],
            });
            setConfirmPassword('');
            setErrors({});
        }
    }, [open, restrictToTenantUsers, agencyId]);

    // Check if form is valid for submission
    const isFormValid = () => {
        // Email is optional, so don't require it
        const baseValid = form.phone.trim() !== '' &&
            form.password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            form.password === confirmPassword;
        
        // Tenant users require tenant_id
        if (form.userType === 'tenant') {
            return baseValid && form.tenantId !== '';
        }
        // Agency users require agency_id
        if (form.userType === 'agency') {
            return baseValid && form.agencyId !== '';
        }
        return baseValid;
    };

    const validate = () => {
        const next: Partial<Record<keyof UserFormData | 'confirmPassword', string>> = {};
        
        // Email validation (optional but must be valid if provided)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email.trim() && !emailRegex.test(form.email.trim())) {
            next.email = 'Enter a valid email address';
        }
        
        // Phone validation
        if (!form.phone.trim()) {
            next.phone = 'Phone is required';
        } else if (form.phone.trim().length < 10 || form.phone.trim().length > 15) {
            next.phone = 'Phone must be between 10 and 15 characters';
        }
        
        // Password validation
        if (!form.password.trim()) {
            next.password = 'Password is required';
        } else if (form.password.length < 6 || form.password.length > 50) {
            next.password = 'Password must be between 6 and 50 characters';
        }
        
        // Confirm password validation
        if (!confirmPassword.trim()) {
            next.confirmPassword = 'Please confirm your password';
        } else if (form.password !== confirmPassword) {
            next.confirmPassword = 'Passwords do not match';
        }
        
        // First name validation (optional but if provided, must meet requirements)
        if (form.firstName.trim() && (form.firstName.trim().length < 2 || form.firstName.trim().length > 50)) {
            next.firstName = 'First name must be between 2 and 50 characters if provided';
        }
        
        // Last name validation (optional but if provided, must meet requirements)
        if (form.lastName.trim() && (form.lastName.trim().length < 2 || form.lastName.trim().length > 50)) {
            next.lastName = 'Last name must be between 2 and 50 characters if provided';
        }
        
        // Tenant ID validation (required if user type is 'tenant' - for tenant admin users)
        if (form.userType === 'tenant' && !form.tenantId) {
            next.tenantId = restrictToTenantUsers 
                ? 'Please select a tenant for this tenant admin user'
                : 'Tenant is required for tenant users';
        }
        
        // Agency ID validation (required if user type is 'agency')
        if (form.userType === 'agency' && !form.agencyId) {
            next.agencyId = 'Agency is required for agency users';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            // Prepare request data matching backend structure
            const requestData: {
                user_type: string;
                tenant_id?: string | null;
                agency_id?: string | null;
                phone: string;
                password: string;
                email?: string;
                first_name?: string;
                last_name?: string;
                role_ids?: string[];
            } = {
                user_type: form.userType,
                phone: form.phone.trim(),
                password: form.password,
            };

            // Include email only if provided
            if (form.email.trim()) {
                requestData.email = form.email.trim();
            }

            // Include tenant_id if user type is 'tenant' (required for tenant users)
            if (form.userType === 'tenant') {
                if (form.tenantId) {
                    requestData.tenant_id = form.tenantId;
                } else {
                    // This should be caught by validation, but set to null if somehow missing
                    requestData.tenant_id = null;
                }
            }

            // Include agency_id if user type is 'agency' (required for agency users)
            if (form.userType === 'agency') {
                if (form.agencyId) {
                    requestData.agency_id = form.agencyId;
                } else {
                    // This should be caught by validation, but set to null if somehow missing
                    requestData.agency_id = null;
                }
            }

            // Include first_name and last_name only if provided
            if (form.firstName.trim()) {
                requestData.first_name = form.firstName.trim();
            }
            if (form.lastName.trim()) {
                requestData.last_name = form.lastName.trim();
            }

            // Include role_ids if any roles are selected
            if (form.roleIds && form.roleIds.length > 0) {
                requestData.role_ids = form.roleIds;
            }

            // Removed console.log to prevent fetchData errors
            const response = await postModel('/users', requestData);

            if (!response) {
                setFeedback({ 
                    status: 'error', 
                    text: 'Failed to create user. No response from server.' 
                });
                return;
            }

            if (isErrorResponse(response)) {
                // TypeScript now knows response has error: true, status: number, message: string
                const errorMessage = response.message || 'Failed to create user';
                const statusCode = response.status;
                // Removed console.error to prevent fetchData errors
                setFeedback({ 
                    status: 'error', 
                    text: statusCode ? `Error ${statusCode}: ${errorMessage}` : errorMessage
                });
            } else {
                // Check if response indicates success
                const responseData = response as any;
                if (responseData.success === false) {
                    const errorMessage = responseData.message || 'Failed to create user';
                    setFeedback({ 
                        status: 'error', 
                        text: errorMessage
                    });
                } else {
                    setFeedback({ 
                        status: 'success', 
                        text: responseData.message || 'User created successfully!' 
                    });
                    handleClose();
                    router.refresh();
                }
            }
        } catch (error: any) {
            // Removed console.error to prevent fetchData errors
            setFeedback({ 
                status: 'error', 
                text: error?.message || 'An unexpected error occurred. Please check the console for details.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose(false);
        setForm({
            userType: 'system',
            tenantId: '',
            agencyId: '',
            phone: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            roleIds: [],
        });
        setConfirmPassword('');
        setErrors({});
    };

    const handleAddRole = (roleId: string | null) => {
        if (roleId && !form.roleIds.includes(roleId)) {
            setForm((f) => ({
                ...f,
                roleIds: [...f.roleIds, roleId],
            }));
        }
    };

    const handleRemoveRole = (roleId: string) => {
        setForm((f) => ({
            ...f,
            roleIds: f.roleIds.filter(id => id !== roleId),
        }));
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
                {restrictToTenantUsers 
                    ? 'Create a tenant admin user for a tenant that belongs to your agency. Tenant admins can manage their school\'s operations.'
                    : 'Add a new user to the platform. Select the user type to determine their access level.'
                }
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    {/* Row 1: User Type - Hidden if restricted to tenant users */}
                    {!restrictToTenantUsers && (
                        <Field>
                            <SearchableSelect
                                label="User Type"
                                value={form.userType}
                                onChange={(value) => {
                                    const newUserType = value as 'agency' | 'system' | 'tenant';
                                    setForm((f) => ({ 
                                        ...f, 
                                        userType: newUserType,
                                        tenantId: '', // Reset tenant when type changes
                                        agencyId: '' // Reset agency when type changes
                                    }));
                                    setErrors((e) => ({ ...e, tenantId: undefined, agencyId: undefined })); // Clear tenant/agency errors
                                }}
                                options={[
                                    { id: 'system', name: 'System User' },
                                    { id: 'agency', name: 'Agency User' },
                                    { id: 'tenant', name: 'Tenant User' },
                                ]}
                                placeholder="Search user type..."
                                emptyLabel="No user types found"
                                error={errors.userType}
                            />
                        </Field>
                    )}

                    {/* Row 2: Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                                Email <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="e.g., user@example.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                invalid={Boolean(errors.email)}
                                autoComplete="off"
                                name="create-user-email"
                                id="create-user-email"
                                className="w-full min-w-0"
                            />
                            {errors.email ? <ErrorMessage className="mt-2">{errors.email}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">Phone</Label>
                            <Input
                                type="tel"
                                placeholder="e.g., +1234567890"
                                value={form.phone}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                invalid={Boolean(errors.phone)}
                                className="w-full"
                            />
                            {errors.phone ? <ErrorMessage className="mt-2">{errors.phone}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 3: First Name and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                First Name <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., John"
                                value={form.firstName}
                                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                                invalid={Boolean(errors.firstName)}
                                className="w-full"
                            />
                            {errors.firstName ? <ErrorMessage className="mt-2">{errors.firstName}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                Last Name <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., Doe"
                                value={form.lastName}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                invalid={Boolean(errors.lastName)}
                                className="w-full"
                            />
                            {errors.lastName ? <ErrorMessage className="mt-2">{errors.lastName}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 4: Password and Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">Password</Label>
                            <Input
                                type="password"
                                placeholder="Enter password (6-50 characters)"
                                value={form.password}
                                onChange={(e) => {
                                    const newPassword = e.target.value;
                                    setForm((f) => ({ ...f, password: newPassword }));
                                    // Re-validate confirm password if it's already filled
                                    if (confirmPassword) {
                                        if (newPassword !== confirmPassword) {
                                            setErrors((e) => ({ ...e, confirmPassword: 'Passwords do not match' }));
                                        } else {
                                            setErrors((e) => ({ ...e, confirmPassword: undefined }));
                                        }
                                    }
                                }}
                                invalid={Boolean(errors.password)}
                                autoComplete="new-password"
                                name="create-user-password"
                                id="create-user-password"
                                className="w-full"
                            />
                            {errors.password ? <ErrorMessage className="mt-2">{errors.password}</ErrorMessage> : null}
                            <p className="mt-2 text-xs text-gray-500">
                                Password must be between 6 and 50 characters
                            </p>
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block">Confirm Password</Label>
                            <Input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    const newConfirmPassword = e.target.value;
                                    setConfirmPassword(newConfirmPassword);
                                    // Validate password match in real-time
                                    if (newConfirmPassword && form.password !== newConfirmPassword) {
                                        setErrors((e) => ({ ...e, confirmPassword: 'Passwords do not match' }));
                                    } else {
                                        setErrors((e) => ({ ...e, confirmPassword: undefined }));
                                    }
                                }}
                                invalid={Boolean(errors.confirmPassword)}
                                autoComplete="new-password"
                                name="create-user-confirm-password"
                                id="create-user-confirm-password"
                                className="w-full"
                            />
                            {errors.confirmPassword ? <ErrorMessage className="mt-2">{errors.confirmPassword}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 5: Tenant (only show if user type is 'tenant') - Required for tenant admin users */}
                    {form.userType === 'tenant' && (
                        <Field>
                            <SearchableSelect
                                label="Tenant"
                                value={form.tenantId || null}
                                onChange={(value) => {
                                    setForm((f) => ({ ...f, tenantId: value || '' }));
                                    setErrors((e) => ({ ...e, tenantId: undefined })); // Clear error when value changes
                                }}
                                options={tenants}
                                placeholder={
                                    isLoadingTenants 
                                        ? "Loading tenants..." 
                                        : tenants.length === 0 
                                        ? "No tenants available" 
                                        : "Search tenants..."
                                }
                                emptyLabel="No tenants found"
                                loading={isLoadingTenants}
                                error={errors.tenantId}
                                disabled={isLoadingTenants || tenants.length === 0}
                            />
                            {!isLoadingTenants && tenants.length === 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {restrictToTenantUsers 
                                        ? 'No tenants found for your agency. Please ensure tenants are assigned to your agency.'
                                        : 'No tenants found. Please ensure tenants exist in the system.'
                                    }
                                </p>
                            )}
                            {restrictToTenantUsers && tenants.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Select a tenant that belongs to your agency. This user will be created as a tenant admin.
                                </p>
                            )}
                        </Field>
                    )}

                    {/* Row 6: Agency (only show if user type is 'agency') */}
                    {form.userType === 'agency' && (
                        <Field>
                            <SearchableSelect
                                label="Agency"
                                value={form.agencyId || null}
                                onChange={(value) => {
                                    setForm((f) => ({ ...f, agencyId: value || '' }));
                                    setErrors((e) => ({ ...e, agencyId: undefined })); // Clear error when value changes
                                }}
                                options={agencies}
                                placeholder={
                                    isLoadingAgencies 
                                        ? "Loading agencies..." 
                                        : agencies.length === 0 
                                        ? "No agencies available" 
                                        : "Search agencies..."
                                }
                                emptyLabel="No agencies found"
                                loading={isLoadingAgencies}
                                error={errors.agencyId}
                                disabled={isLoadingAgencies || agencies.length === 0}
                            />
                            {!isLoadingAgencies && agencies.length === 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    No agencies found. Please ensure agencies exist in the system.
                                </p>
                            )}
                        </Field>
                    )}

                    {/* Row 7: Roles (Optional) */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                            Assign Roles <span className="text-gray-400 font-normal">(Optional)</span>
                        </Label>
                        <SearchableSelect
                            value={null}
                            onChange={handleAddRole}
                            options={roles.filter(role => !form.roleIds.includes(role.id))}
                            placeholder={isLoadingRoles ? "Loading roles..." : "Search and select roles to assign..."}
                            emptyLabel="No roles available"
                            loading={isLoadingRoles}
                            disabled={isLoadingRoles}
                        />
                        {form.roleIds.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <Label className="text-xs font-medium text-gray-700 block">
                                    Selected Roles ({form.roleIds.length})
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {form.roleIds.map((roleId) => {
                                        const role = roles.find(r => r.id === roleId);
                                        if (!role) return null;
                                        return (
                                            <span
                                                key={roleId}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-100 text-purple-800 rounded-lg"
                                            >
                                                {role.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRole(roleId)}
                                                    className="text-purple-600 hover:text-purple-800 focus:outline-none"
                                                    aria-label={`Remove ${role.name}`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </Field>
                </div>
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
                    disabled={isLoading || !isFormValid()}
                >
                    {isLoading ? 'Creating...' : 'Create User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserModal;

