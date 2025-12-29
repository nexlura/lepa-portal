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
import { postModel, getModel, isErrorResponse } from '@/lib/connector';

export type UserFormData = {
    userType: 'agency' | 'system' | 'tenant' | 'support';
    tenantId: string;
    phone: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
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

const UserModal = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (open: boolean) => void;
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { setFeedback } = useContext(FeedbackContext);

    const [form, setForm] = useState<UserFormData>({
        userType: 'system',
        tenantId: '',
        phone: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
    });

    const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData | 'confirmPassword', string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTenants, setIsLoadingTenants] = useState(false);

    // Fetch tenants for dropdown when user type is 'tenant' or 'agency'
    useEffect(() => {
        if (open && (form.userType === 'tenant' || form.userType === 'agency')) {
            setIsLoadingTenants(true);
            getModel<TenantsApiResponse>('/tenants?limit=100')
                .then((res) => {
                    if (res && !isErrorResponse(res) && res.data && Array.isArray(res.data)) {
                        const transformedTenants = res.data.map((tenant: BackendTenantData) => ({
                            id: tenant.id,
                            name: tenant.school_name,
                        }));
                        setTenants(transformedTenants);
                    }
                })
                .catch((error) => {
                    console.warn('Error fetching tenants:', error);
                })
                .finally(() => {
                    setIsLoadingTenants(false);
                });
        } else {
            setTenants([]);
        }
    }, [open, form.userType]);

    // Reset form when modal opens or closes
    useEffect(() => {
        if (open) {
            // Reset form when modal opens to ensure clean state
            setForm({
                userType: 'system',
                tenantId: '',
                phone: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
            });
            setConfirmPassword('');
            setErrors({});
        } else {
            // Also reset when modal closes
            setForm({
                userType: 'system',
                tenantId: '',
                phone: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
            });
            setConfirmPassword('');
            setErrors({});
        }
    }, [open]);

    // Check if form is valid for submission
    const isFormValid = () => {
        const baseValid = form.phone.trim() !== '' &&
            form.password.trim() !== '' &&
            form.email.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            form.password === confirmPassword;
        
        // Tenant and agency users require tenant_id
        if (form.userType === 'tenant' || form.userType === 'agency') {
            return baseValid && form.tenantId !== '';
        }
        return baseValid;
    };

    const validate = () => {
        const next: Partial<Record<keyof UserFormData | 'confirmPassword', string>> = {};
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) {
            next.email = 'Email is required';
        } else if (!emailRegex.test(form.email.trim())) {
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
        
        // Tenant ID validation (required if user type is 'tenant' or 'agency')
        if ((form.userType === 'tenant' || form.userType === 'agency') && !form.tenantId) {
            next.tenantId = `Tenant is required for ${form.userType} users`;
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            // Prepare request data
            const requestData: {
                user_type: string;
                tenant_id?: string;
                phone: string;
                password: string;
                email: string;
                first_name?: string;
                last_name?: string;
            } = {
                user_type: form.userType,
                phone: form.phone.trim(),
                password: form.password,
                email: form.email.trim(),
            };

            // Only include tenant_id if user type is 'tenant' or 'agency'
            if ((form.userType === 'tenant' || form.userType === 'agency') && form.tenantId) {
                requestData.tenant_id = form.tenantId;
            }

            // Only include first_name and last_name if provided
            if (form.firstName.trim()) {
                requestData.first_name = form.firstName.trim();
            }
            if (form.lastName.trim()) {
                requestData.last_name = form.lastName.trim();
            }

            const response = await postModel('/users', requestData);

            if (isErrorResponse(response)) {
                setFeedback({ 
                    status: 'error', 
                    text: response.message || 'Failed to create user' 
                });
            } else {
                setFeedback({ 
                    status: 'success', 
                    text: 'User created successfully!' 
                });
                handleClose();
                router.refresh();
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
        setForm({
            userType: 'system',
            tenantId: '',
            phone: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
        });
        setErrors({});
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
                Add a new user to the platform. Select the user type to determine their access level.
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-4">
                    {/* Row 1: User Type */}
                    <Field>
                        <Select
                            label="User Type"
                            value={form.userType}
                            onChange={(value: string) => {
                                setForm((f) => ({ 
                                    ...f, 
                                    userType: value as 'agency' | 'system' | 'tenant' | 'support',
                                    tenantId: '' // Reset tenant when type changes
                                }));
                                setErrors((e) => ({ ...e, tenantId: undefined })); // Clear tenant error
                            }}
                            options={[
                                { value: 'system', label: 'System User' },
                                { value: 'support', label: 'Support User' },
                                { value: 'agency', label: 'Agency User' },
                                { value: 'tenant', label: 'Tenant User' },
                            ]}
                            placeholder="Select user type..."
                            error={errors.userType}
                        />
                    </Field>

                    {/* Row 2: Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                            <Input
                                type="email"
                                placeholder="e.g., user@example.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                invalid={Boolean(errors.email)}
                                autoComplete="new-password"
                                name="new-user-email"
                                id="new-user-email"
                            />
                            {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                        </Field>

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
                    </div>

                    {/* Row 3: First Name and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">
                                First Name <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., John"
                                value={form.firstName}
                                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                                invalid={Boolean(errors.firstName)}
                            />
                            {errors.firstName ? <ErrorMessage>{errors.firstName}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">
                                Last Name <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., Doe"
                                value={form.lastName}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                invalid={Boolean(errors.lastName)}
                            />
                            {errors.lastName ? <ErrorMessage>{errors.lastName}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 4: Password and Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">Password</Label>
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
                            />
                            {errors.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                            <p className="mt-1 text-xs text-gray-500">
                                Password must be between 6 and 50 characters
                            </p>
                        </Field>

                        <Field>
                            <Label className="text-sm/6 text-gray-900 font-medium">Confirm Password</Label>
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
                            />
                            {errors.confirmPassword ? <ErrorMessage>{errors.confirmPassword}</ErrorMessage> : null}
                        </Field>
                    </div>

                    {/* Row 5: Tenant (only show if user type is 'tenant' or 'agency') */}
                    {(form.userType === 'tenant' || form.userType === 'agency') && (
                        <Field>
                            <Select
                                label="Tenant"
                                value={form.tenantId}
                                onChange={(value: string) => setForm((f) => ({ ...f, tenantId: value }))}
                                options={tenants.map((tenant) => ({
                                    value: tenant.id,
                                    label: tenant.name,
                                }))}
                                placeholder={isLoadingTenants ? "Loading tenants..." : "Select tenant..."}
                                error={errors.tenantId}
                                disabled={isLoadingTenants}
                            />
                            {errors.tenantId ? <ErrorMessage>{errors.tenantId}</ErrorMessage> : null}
                        </Field>
                    )}
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

