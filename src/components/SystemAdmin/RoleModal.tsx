'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Input } from '@/components/UIKit/Input';
import { Button } from '@/components/UIKit/Button';
import SearchableSelect from '@/components/UIKit/SearchableSelect';
import { FeedbackContext } from '@/context/feedback';
import { postModel, patchModel, isErrorResponse } from '@/lib/connector';
import type { Role } from '@/types/role';

export type RoleFormData = {
    title: string;
    description: string;
    scope: 'system' | 'agency' | 'tenant';
};

interface RoleModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
    role?: Role | null;
}

const RoleModal = ({ open, onClose, role }: RoleModalProps) => {
    const router = useRouter();
    const { setFeedback } = useContext(FeedbackContext);

    const [form, setForm] = useState<RoleFormData>({
        title: '',
        description: '',
        scope: 'system',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RoleFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens or closes
    useEffect(() => {
        if (open) {
            if (role) {
                // Edit mode - populate form with role data
                setForm({
                    title: role.name || '',
                    description: role.description || '',
                    scope: 'system', // Default, could be enhanced to fetch actual scope
                });
            } else {
                // Create mode - reset form
                setForm({
                    title: '',
                    description: '',
                    scope: 'system',
                });
            }
            setErrors({});
        } else {
            // Also reset when modal closes
            setForm({
                title: '',
                description: '',
                scope: 'system',
            });
            setErrors({});
        }
    }, [open, role]);

    // Check if form is valid for submission
    const isFormValid = () => {
        return form.title.trim() !== '' &&
            form.description.trim() !== '' &&
            (form.scope === 'system' || form.scope === 'tenant' || form.scope === 'agency');
    };

    const validate = () => {
        const next: Partial<Record<keyof RoleFormData, string>> = {};
        
        // Title validation
        if (!form.title.trim()) {
            next.title = 'Title is required';
        }
        
        // Description validation
        if (!form.description.trim()) {
            next.description = 'Description is required';
        }
        
        // Scope validation
        if (!form.scope || (form.scope !== 'system' && form.scope !== 'tenant' && form.scope !== 'agency')) {
            next.scope = 'Scope must be either system, tenant, or agency';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            // Prepare request data matching backend structure
            const requestData = {
                title: form.title.trim(),
                description: form.description.trim(),
                scope: form.scope,
            };

            const response = role
                ? await patchModel(`/rbac/roles/${role.id}`, requestData)
                : await postModel('/rbac/roles', requestData);

            if (isErrorResponse(response)) {
                const errorMessage = (response as any).error?.message || (response as any).message || 'Failed to create role';
                setFeedback({ 
                    status: 'error', 
                    text: errorMessage 
                });
            } else {
                // Check if response indicates success
                if (response.success || response.code === 200 || response.code === 201) {
                    const responseData = response.data || response;
                    setFeedback({ 
                        status: 'success', 
                        text: responseData.message || response.message || (role ? 'Role updated successfully!' : 'Role created successfully!')
                    });
                    handleClose();
                    router.refresh();
                } else {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to create role' 
                    });
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
            title: '',
            description: '',
            scope: 'system',
        });
        setErrors({});
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
                {role 
                    ? 'Update the role details in the RBAC system.'
                    : 'Add a new role to the RBAC system. Define the role title, description, and scope.'
                }
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    {/* Row 1: Title */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                            Title
                        </Label>
                        <Input
                            type="text"
                            placeholder="e.g., System Administrator"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            invalid={Boolean(errors.title)}
                            className="w-full min-w-0"
                        />
                        {errors.title ? <ErrorMessage className="mt-2">{errors.title}</ErrorMessage> : null}
                    </Field>

                    {/* Row 2: Description */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                            Description
                        </Label>
                        <textarea
                            rows={4}
                            placeholder="e.g., Full system access with all permissions"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className={`
                                relative block w-full min-w-0
                                appearance-none rounded-lg
                                px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2])-1px)]
                                sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[2])-1px)]
                                text-base/6 text-zinc-950 placeholder:text-zinc-400 sm:text-sm/6
                                border border-zinc-950/10 hover:border-zinc-950/20
                                bg-transparent
                                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                ${errors.description 
                                    ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500' 
                                    : ''
                                }
                                disabled:opacity-50 disabled:border-zinc-950/20
                            `}
                        />
                        {errors.description ? <ErrorMessage className="mt-2">{errors.description}</ErrorMessage> : null}
                    </Field>

                    {/* Row 3: Scope */}
                    <Field>
                        <SearchableSelect
                            label="Scope"
                            value={form.scope}
                            onChange={(value) => {
                                const newScope = value as 'system' | 'tenant' | 'agency';
                                setForm((f) => ({ ...f, scope: newScope }));
                                setErrors((e) => ({ ...e, scope: undefined }));
                            }}
                            options={[
                                { id: 'system', name: 'System' },
                                { id: 'tenant', name: 'Tenant' },
                                { id: 'agency', name: 'Agency' },
                            ]}
                            placeholder="Search scope..."
                            emptyLabel="No scope found"
                            error={errors.scope}
                        />
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
                    {isLoading ? (role ? 'Updating...' : 'Creating...') : (role ? 'Update Role' : 'Create Role')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleModal;
