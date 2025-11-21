'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { Session } from 'next-auth'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'
import SelectMenu from '../UIKit/SelectMenu'
import { postModel } from '@/lib/connector'
import FormSubmitFeedback from '../FormAlert'
import { FeedbackContext } from '@/context/feedback'
import { getTenantDomain, useHostHeader } from '@/utils/hostHeader'
import revalidatePage from '@/app/actions/revalidate-path'

export interface AddModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
    session: Session | null;
}


const classes = [
    { id: 1, name: 'class 1' },
    { id: 2, name: 'class 2' },
    { id: 3, name: 'class 3' },
    { id: 4, name: 'class 4' },
    { id: 5, name: 'class 5' },
    { id: 6, name: 'class 6' },

]

const AddClassModal = ({ open, onClose, session }: AddModalProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { setFeedback } = useContext(FeedbackContext)
    const hostHeader = useHostHeader()
    const effectiveHost = getTenantDomain(hostHeader)

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        capacity: '',
        teacher: '',
    })
    const [errors, setErrors] = useState<{ name?: string; grade?: string }>({})
    const [selectedLevel, setSelectedLevel] = useState(classes[0])

    const postData = {
        grade: selectedLevel.name,
        capacity: Number(form.capacity),
        name: form.name,
    }

    const resetForm = () => {
        setForm({
            name: '',
            capacity: '',
            teacher: '',
        });
        setErrors({});
        setLocalError(null);
        setSelectedLevel(classes[0]); // reset dropdown to default
    };

    const handleVerificationSuccess = () => {
        revalidatePage('/classes/1');
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
                '/classes',
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
            <DialogTitle>Add a Class</DialogTitle>
            <DialogDescription>Provide details for the new class.</DialogDescription>
            <DialogBody>
                <form className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    {localError && (
                        <div className='col-span-2'>
                            <FormSubmitFeedback msg={localError} />
                        </div>
                    )}
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Name</Label>
                        <Input
                            ref={nameInputRef}
                            placeholder="e.g., Class 1 Blue"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="block text-sm/6 font-medium text-gray-900 ">Grade</Label>
                        <SelectMenu options={classes} selected={selectedLevel} setSelected={setSelectedLevel} />
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Capacity</Label>
                        <Input
                            placeholder="e.g., 40"
                            value={form.capacity}
                            onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                        />
                    </Field>
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}

                >
                    {isLoading ? 'Saving' : 'Save Class'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddClassModal