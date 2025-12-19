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
import { postModel, patchModel, isErrorResponse } from '@/lib/connector';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

export type AgencyFormData = {
    domain: string;
    name: string;
    type: 'Government' | 'NGO';
    status: 'active' | 'suspended' | 'inactive';
}

const AgencyModal = ({
    open,
    onClose,
    agency,
}: {
    open: boolean;
    onClose: (open: boolean) => void;
    agency?: Agency | null;
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { setFeedback } = useContext(FeedbackContext);

    const isEditMode = !!agency;

    const [form, setForm] = useState<AgencyFormData>({
        domain: '',
        name: '',
        type: 'Government',
        status: 'active',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AgencyFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Normalize agency type from backend format to form format
    const normalizeType = (type: string): 'Government' | 'NGO' => {
        if (type === 'Ministry' || type === 'District Office' || type === 'State/County Board') {
            return 'Government';
        }
        return type as 'Government' | 'NGO';
    };

    // Populate form when agency data is provided (edit mode)
    useEffect(() => {
        if (agency) {
            setForm({
                domain: '', // Domain is not in Agency response, user can enter if they want to update it
                name: agency.name,
                type: normalizeType(agency.type),
                status: agency.status,
            });
            setErrors({});
        } else {
            // Reset form for create mode
            setForm({
                domain: '',
                name: '',
                type: 'Government',
                status: 'active',
            });
            setErrors({});
        }
    }, [agency]);

    const validate = () => {
        const next: Partial<Record<keyof AgencyFormData, string>> = {};
        
        // Domain validation
        if (isEditMode) {
            // In edit mode, domain is optional (only validate if provided)
            if (form.domain.trim()) {
                const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
                if (!domainRegex.test(form.domain.trim())) {
                    next.domain = 'Enter a valid domain (e.g., example.com)';
                }
            }
        } else {
            // In create mode, domain is required
            if (!form.domain.trim()) {
                next.domain = 'Domain is required';
            } else {
                const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
                if (!domainRegex.test(form.domain.trim())) {
                    next.domain = 'Enter a valid domain (e.g., agency.lepa.com)';
                }
            }
        }
        
        // Name is always required
        if (!form.name.trim()) {
            next.name = 'Name is required';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        if (isEditMode && !agency) return;

        setIsLoading(true);

        try {
            if (isEditMode && agency) {
                // Edit mode: PATCH request with only changed fields
                const updateData: Partial<{
                    domain: string;
                    name: string;
                    type: string;
                    status: string;
                }> = {};

                // Only include domain if it's provided
                if (form.domain.trim()) {
                    updateData.domain = form.domain.trim();
                }

                // Only include name if it's different from current
                if (form.name.trim() !== agency.name) {
                    updateData.name = form.name.trim();
                }

                // Only include type if it's different from current
                const currentType = normalizeType(agency.type);
                if (form.type !== currentType) {
                    updateData.type = form.type;
                }

                // Only include status if it's different from current
                if (form.status !== agency.status) {
                    updateData.status = form.status;
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

                const response = await patchModel(`/agencies/${agency.id}`, updateData);

                if (isErrorResponse(response)) {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to update agency' 
                    });
                } else {
                    setFeedback({ 
                        status: 'success', 
                        text: 'Agency updated successfully!' 
                    });
                    handleClose();
                    router.refresh();
                }
            } else {
                // Create mode: POST request
                const response = await postModel('/agencies', {
                    domain: form.domain.trim(),
                    name: form.name.trim(),
                    type: form.type,
                    status: form.status,
                });

                if (isErrorResponse(response)) {
                    setFeedback({ 
                        status: 'error', 
                        text: response.message || 'Failed to create agency' 
                    });
                } else {
                    setFeedback({ 
                        status: 'success', 
                        text: 'Agency created successfully!' 
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
        if (isEditMode && agency) {
            setForm({
                domain: '',
                name: agency.name,
                type: normalizeType(agency.type),
                status: agency.status,
            });
        } else {
            setForm({
                domain: '',
                name: '',
                type: 'Government',
                status: 'active',
            });
        }
        setErrors({});
    };

    return (
        <Dialog size="lg" open={open} onClose={handleClose} className="relative z-20">
            <DialogTitle>{isEditMode ? 'Edit Agency' : 'Create New Agency'}</DialogTitle>
            <DialogDescription>
                {isEditMode 
                    ? 'Update agency information. Only changed fields will be updated.'
                    : 'Add a new government agency or NGO to manage schools.'
                }
            </DialogDescription>
            <DialogBody>
                <div className="mt-4 space-y-5">
                    {/* Domain */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Domain</Label>
                        <Input
                            type="text"
                            placeholder="e.g., example.com"
                            value={form.domain}
                            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                            invalid={Boolean(errors.domain)}
                        />
                        {errors.domain ? <ErrorMessage>{errors.domain}</ErrorMessage> : null}
                        {isEditMode && (
                            <p className="mt-1 text-sm text-gray-500">
                                Leave empty to keep current domain unchanged
                            </p>
                        )}
                    </Field>

                    {/* Name */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Agency Name</Label>
                        <Input
                            type="text"
                            placeholder="e.g., Ministry of Education"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                    </Field>

                    {/* Type */}
                    <Field>
                        <Select
                            label="Type"
                            value={form.type}
                            onChange={(value: string) => setForm((f) => ({ ...f, type: value as 'Government' | 'NGO' }))}
                            options={[
                                { value: 'Government', label: 'Government' },
                                { value: 'NGO', label: 'NGO' },
                            ]}
                            placeholder="Select type..."
                            error={errors.type}
                        />
                    </Field>

                    {/* Status */}
                    <Field>
                        <Select
                            label="Status"
                            value={form.status}
                            onChange={(value: string) => setForm((f) => ({ ...f, status: value as 'active' | 'suspended' | 'inactive' }))}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'suspended', label: 'Suspended' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                            placeholder="Select status..."
                            error={errors.status}
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
                    disabled={isLoading}
                >
                    {isLoading 
                        ? (isEditMode ? 'Updating...' : 'Creating...') 
                        : (isEditMode ? 'Update Agency' : 'Create Agency')
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgencyModal;

