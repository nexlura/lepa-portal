'use client';

import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { FeedbackContext } from '@/context/feedback';
import FormSubmitFeedback from '@/components/FormAlert';
import { postModel, isErrorResponse } from '@/lib/connector';
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset';
import { Input } from '@/components/UIKit/Input';
import { Button } from '@/components/UIKit/Button';

export type AddAgencyForm = {
    domain: string;
    name: string;
    type: 'Government' | 'NGO';
    status: 'active' | 'suspended' | 'inactive';
}

export type AddAgencyFormErrors = Partial<Record<keyof AddAgencyForm, string>>;

const DEFAULT_FORM: AddAgencyForm = {
    domain: '',
    name: '',
    type: 'Government',
    status: 'active',
};

const NewAgencyPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { setFeedback } = useContext(FeedbackContext);
    const domainInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<AddAgencyForm>(DEFAULT_FORM);
    const [errors, setErrors] = useState<AddAgencyFormErrors>({});
    const [localError, setLocalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const next: AddAgencyFormErrors = {};
        if (!form.domain.trim()) {
            next.domain = 'Domain is required';
            domainInputRef.current?.focus();
        } else {
            // Basic domain validation
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
            if (!domainRegex.test(form.domain.trim())) {
                next.domain = 'Enter a valid domain (e.g., example.com)';
            }
        }
        if (!form.name.trim()) {
            next.name = 'Name is required';
        }
        if (!form.type) {
            next.type = 'Type is required';
        }
        if (!form.status) {
            next.status = 'Status is required';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSuccess = () => {
        setFeedback({ status: 'success', text: 'Agency created successfully!' });
        router.push('/system-admin/agencies');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;

        setLocalError(null);
        setIsLoading(true);

        try {
            const response = await postModel('/agencies', {
                domain: form.domain.trim(),
                name: form.name.trim(),
                type: form.type,
                status: form.status,
            });

            if (isErrorResponse(response)) {
                setLocalError(response.message || 'Failed to create agency');
            } else {
                handleSuccess();
            }
        } catch (error: any) {
            setLocalError(error?.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setForm(DEFAULT_FORM);
        setErrors({});
        setLocalError(null);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Agency</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Add a new government agency or NGO to manage schools.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                {localError && (
                    <div className="mb-6">
                        <FormSubmitFeedback msg={localError} />
                    </div>
                )}

                <div className="space-y-6">
                    {/* Domain */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Domain</Label>
                        <Input
                            ref={domainInputRef}
                            type="text"
                            placeholder="e.g., example.com"
                            value={form.domain}
                            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                            invalid={Boolean(errors.domain)}
                        />
                        {errors.domain ? <ErrorMessage>{errors.domain}</ErrorMessage> : null}
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the domain name for the agency (e.g., example.com)
                        </p>
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
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the full name of the agency
                        </p>
                    </Field>

                    {/* Type */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Type</Label>
                        <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={form.type}
                            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'Government' | 'NGO' }))}
                        >
                            <option value="Government">Government</option>
                            <option value="NGO">NGO</option>
                        </select>
                        {errors.type ? <ErrorMessage>{errors.type}</ErrorMessage> : null}
                        <p className="mt-1 text-sm text-gray-500">
                            Select whether this is a Government agency or NGO
                        </p>
                    </Field>

                    {/* Status */}
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Status</Label>
                        <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={form.status}
                            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'suspended' | 'inactive' }))}
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status ? <ErrorMessage>{errors.status}</ErrorMessage> : null}
                        <p className="mt-1 text-sm text-gray-500">
                            Set the initial status of the agency
                        </p>
                    </Field>
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        color="secondary"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        color="secondary"
                        onClick={handleReset}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Agency'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewAgencyPage;

