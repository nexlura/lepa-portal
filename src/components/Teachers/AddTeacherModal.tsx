import { useContext, useEffect, useRef, useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'
import { AddModalProps } from '../SchoolClasses/AddClassModal'
import { getTenantDomain, useHostHeader } from '@/utils/hostHeader'
import { FeedbackContext } from '@/context/feedback'
import { postModel } from '@/lib/connector'
import revalidatePage from '@/app/actions/revalidate-path'
import FormSubmitFeedback from '../FormAlert'

const AddTeacherModal = ({ open, onClose, session }: AddModalProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { setFeedback } = useContext(FeedbackContext)
    const hostHeader = useHostHeader()
    const effectiveHost = getTenantDomain(hostHeader)

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
        name: '',
        subject: '',
        phone: '',
        department: ''
    })
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        subject?: string
    }>({})

    const postData = {
        name: form.name,
    }

    const resetForm = () => {
        setForm({
            name: '',
            email: '',
            subject: '',
            phone: '',
            department: ''
        });
        setErrors({});
        setLocalError(null);
    };

    const handleVerificationSuccess = () => {
        revalidatePage('/teachers/1');
        onClose(false)
        setFeedback({ status: 'success', text: 'Class added successfully!' })

        return
    };

    const validate = () => {
        const next: { name?: string } = {};
        if (!form.name.trim()) {
            next.name = 'Class name is required';
            nameInputRef.current?.focus();
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return; // ✅ fix: call the function

        setLocalError(null)
        setIsLoading(true)

        try {
            const resp = await postModel(
                '/teachers',
                postData,
                {
                    headers: {
                        'X-Lepa-Host-Header': effectiveHost,
                        'Authorization': `Bearer ${session?.user.accessToken}`
                    },
                }
            );

            if (resp.status >= 200 && resp.status < 300) {
                handleVerificationSuccess()
            }

            //request failed
            if (resp.error.message) {
                setLocalError(resp.error.message)
            } else {
                setLocalError('Something went wrong. Please try again')
            }
        } catch (error) {
            console.error('Error during POST request:', error);

            throw error; // Re-throw for higher-level handling if needed
        } finally {
            setIsLoading(false);
        }

    }


    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    return (
        <Dialog size="md" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Add a Teacher</DialogTitle>
            <DialogDescription>Provide details for the new teacher.</DialogDescription>
            <DialogBody>
                <form className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    {localError && (
                        <div className='col-span-2'>
                            <FormSubmitFeedback msg={localError} />
                        </div>
                    )}
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Full Name</Label>
                        <Input
                            placeholder="e.g., Dr. Emily Wilson"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Email</Label>
                        <Input
                            type="email"
                            placeholder="e.g., emily.wilson@lepa.edu"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Subject</Label>
                        <Input
                            placeholder="e.g., Mathematics"
                            value={form.subject}
                            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                            invalid={Boolean(errors.subject)}
                        />
                        {errors.subject ? <ErrorMessage>{errors.subject}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Department</Label>
                        <Input
                            placeholder="e.g., STEM"
                            value={form.department}
                            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                        />
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Phone Number</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                    </Field>
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Saving' : 'Save Teacher'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTeacherModal 