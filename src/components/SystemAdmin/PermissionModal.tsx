'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Input } from '@/components/UIKit/Input';
import { Button } from '@/components/UIKit/Button';
import { FeedbackContext } from '@/context/feedback';
import { postModel, patchModel, isErrorResponse } from '@/lib/connector';
import type { Permission } from '@/lib/rbac';

export type PermissionFormData = {
    name: string;
    code?: string;
    description?: string;
    resource?: string;
    action?: string;
};

const PermissionModal = ({
    open,
    onClose,
    permission,
}: {
    open: boolean;
    onClose: (open: boolean) => void;
    permission?: Permission | null;
}) => {
    const router = useRouter();
    const { setFeedback } = useContext(FeedbackContext);

    const [form, setForm] = useState<PermissionFormData>({
        name: '',
        code: '',
        description: '',
        resource: '',
        action: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PermissionFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens or closes
    useEffect(() => {
        if (open) {
            if (permission) {
                // Edit mode - populate form with permission data
                setForm({
                    name: permission.name || '',
                    code: permission.code || '',
                    description: permission.description || '',
                    resource: permission.resource || '',
                    action: permission.action || '',
                });
            } else {
                // Create mode - reset form
                setForm({
                    name: '',
                    code: '',
                    description: '',
                    resource: '',
                    action: '',
                });
            }
            setErrors({});
        }
    }, [open, permission]);

    const validate = () => {
        const next: Partial<Record<keyof PermissionFormData, string>> = {};
        
        if (!form.name.trim()) {
            next.name = 'Name is required';
        }
        
        if (!form.code?.trim()) {
            next.code = 'Code is required';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            const requestData: {
                name: string;
                code?: string;
                description?: string;
                resource?: string;
                action?: string;
            } = {
                name: form.name.trim(),
            };

            if (form.code?.trim()) {
                requestData.code = form.code.trim();
            }
            if (form.description?.trim()) {
                requestData.description = form.description.trim();
            }
            if (form.resource?.trim()) {
                requestData.resource = form.resource.trim();
            }
            if (form.action?.trim()) {
                requestData.action = form.action.trim();
            }

            const response = permission
                ? await patchModel(`/rbac/permissions/${permission.id}`, requestData)
                : await postModel('/rbac/permissions', requestData);

            if (isErrorResponse(response)) {
                const errorMessage = response.message || response.error?.message || 'Failed to create permission';
                setFeedback({ 
                    status: 'error', 
                    text: errorMessage 
                });
            } else {
                if (response.success || response.code === 200 || response.code === 201) {
                    const responseData = response.data || response;
                    setFeedback({ 
                        status: 'success', 
                        text: responseData.message || response.message || (permission ? 'Permission updated successfully!' : 'Permission created successfully!')
                    });
                    handleClose();
                    router.refresh();
                } else {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to create permission' 
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
            name: '',
            code: '',
            description: '',
            resource: '',
            action: '',
        });
        setErrors({});
    };

    return (
        <Dialog size="xl" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>{permission ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
            <DialogDescription>
                {permission 
                    ? 'Update the permission details in the RBAC system.'
                    : 'Add a new permission to the RBAC system. Permissions define what actions users can perform.'
                }
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-6">
                    {/* Row 1: Name and Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                                Name
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., Manage Users"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                invalid={Boolean(errors.name)}
                                className="w-full min-w-0"
                            />
                            {errors.name ? <ErrorMessage className="mt-2">{errors.name}</ErrorMessage> : null}
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                                Code
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., manage_users"
                                value={form.code || ''}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                                invalid={Boolean(errors.code)}
                                className="w-full min-w-0"
                            />
                            {errors.code ? <ErrorMessage className="mt-2">{errors.code}</ErrorMessage> : null}
                            <p className="mt-2 text-xs text-gray-500">
                                Unique identifier for the permission (e.g., manage_users)
                            </p>
                        </Field>
                    </div>

                    {/* Row 2: Description */}
                    <Field>
                        <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                            Description <span className="text-gray-400 font-normal">(Optional)</span>
                        </Label>
                        <textarea
                            rows={3}
                            placeholder="e.g., Allows users to create, update, and delete user accounts"
                            value={form.description || ''}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </Field>

                    {/* Row 3: Resource and Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                                Resource <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., users"
                                value={form.resource || ''}
                                onChange={(e) => setForm((f) => ({ ...f, resource: e.target.value }))}
                                className="w-full min-w-0"
                            />
                        </Field>

                        <Field>
                            <Label className="text-sm font-medium text-gray-900 mb-2 block break-words">
                                Action <span className="text-gray-400 font-normal">(Optional)</span>
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., manage"
                                value={form.action || ''}
                                onChange={(e) => setForm((f) => ({ ...f, action: e.target.value }))}
                                className="w-full min-w-0"
                            />
                        </Field>
                    </div>
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
                    disabled={isLoading || !form.name.trim() || !form.code?.trim()}
                >
                    {isLoading ? (permission ? 'Updating...' : 'Creating...') : (permission ? 'Update Permission' : 'Create Permission')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionModal;

