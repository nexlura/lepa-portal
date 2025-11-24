import { useContext, useEffect, useRef, useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'
import { AddModalProps } from '../SchoolClasses/AddClassModal'
import { FeedbackContext } from '@/context/feedback'
import { postModel, getModel } from '@/lib/connector'
import revalidatePage from '@/app/actions/revalidate-path'
import FormSubmitFeedback from '../FormAlert'
import { useSession } from 'next-auth/react'
import { MultiSelect, MultiSelectOption } from '@/components/UIKit/MultiSelect'
import { Listbox, ListboxOption } from '@/components/UIKit/listbox'

const SUBJECT_OPTIONS: MultiSelectOption[] = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'literature', name: 'Literature' },
    { id: 'art', name: 'Art' },
    { id: 'music', name: 'Music' },
    { id: 'physical_education', name: 'Physical Education' },
    { id: 'computer_science', name: 'Computer Science' },
]

const SEX_OPTIONS = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
    { id: 'other', name: 'Other' },
]

type BackendClass = {
    id: string
    name: string
    grade: string
}

const AddTeacherModal = ({ open, onClose }: AddModalProps) => {
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const { setFeedback } = useContext(FeedbackContext)
    const { data: session } = useSession()

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [classes, setClasses] = useState<MultiSelectOption[]>([])
    const [loadingClasses, setLoadingClasses] = useState(false)
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        sex: '',
        subjects: [] as MultiSelectOption[],
        assignedClasses: [] as MultiSelectOption[],
    })
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        password?: string;
        sex?: string;
    }>({})

    const resetForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            address: '',
            sex: '',
            subjects: [],
            assignedClasses: [],
        });
        setErrors({});
        setLocalError(null);
    };

    const handleVerificationSuccess = () => {
        revalidatePage('/teachers/1');
        onClose(false)
        setFeedback({ status: 'success', text: 'Teacher added successfully!' })
    };

    const validate = () => {
        const next: typeof errors = {};
        if (!form.firstName.trim()) {
            next.firstName = 'First name is required';
            firstNameInputRef.current?.focus();
        }
        if (!form.lastName.trim()) {
            next.lastName = 'Last name is required';
        }
        if (!form.email.trim()) {
            next.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            next.email = 'Please enter a valid email address';
        }
        if (!form.phone.trim()) {
            next.phone = 'Phone number is required';
        } else if (form.phone.length < 10 || form.phone.length > 15) {
            next.phone = 'Phone number must be between 10 and 15 characters';
        }
        if (!form.password.trim()) {
            next.password = 'Password is required';
        } else if (form.password.length < 6) {
            next.password = 'Password must be at least 6 characters';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        if (!session?.user?.tenantId) {
            setLocalError('Session error: tenant ID not found')
            return
        }

        setLocalError(null)
        setIsLoading(true)

        try {
            const postData = {
                tenant_id: session.user.tenantId,
                first_name: form.firstName.trim(),
                last_name: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                password: form.password,
                ...(form.address.trim() && { address: form.address.trim() }),
                ...(form.sex && { sex: form.sex }),
                ...(form.subjects.length > 0 && { subjects: form.subjects.map(s => s.id) }),
                ...(form.assignedClasses.length > 0 && { assigned_classes: form.assignedClasses.map(c => c.id) }),
            }

            const resp = await postModel('/teachers', postData);

            // Check if response is an error
            if (resp && typeof resp === 'object' && 'error' in resp && resp.error) {
                setLocalError(resp.message || 'Something went wrong. Please try again')
                return
            }

            // Check for success response
            if (resp && typeof resp === 'object' && 'status' in resp && resp.status >= 200 && resp.status < 300) {
                handleVerificationSuccess()
                return
            }

            // If we have data or success response, treat as success
            if (!resp || (resp && typeof resp === 'object' && !('error' in resp))) {
                handleVerificationSuccess()
                return
            }

            // Fallback error
            setLocalError('Something went wrong. Please try again')
        } catch (error) {
            console.error('Error during POST request:', error);
            setLocalError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch classes when modal opens
    useEffect(() => {
        if (open && classes.length === 0 && !loadingClasses) {
            setLoadingClasses(true)
            getModel('/classes?page=1&limit=100')
                .then((res) => {
                    if (res && res.data?.classes) {
                        const classOptions: MultiSelectOption[] = res.data.classes.map((cls: BackendClass) => ({
                            id: cls.id,
                            name: `${cls.name} (${cls.grade})`,
                        }))
                        setClasses(classOptions)
                    }
                })
                .catch((err) => {
                    console.error('Error fetching classes:', err)
                })
                .finally(() => {
                    setLoadingClasses(false)
                })
        }
    }, [open, classes.length, loadingClasses])


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
                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">First Name *</Label>
                        <Input
                            ref={firstNameInputRef}
                            placeholder="e.g., Emily"
                            value={form.firstName}
                            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                            invalid={Boolean(errors.firstName)}
                        />
                        {errors.firstName ? <ErrorMessage>{errors.firstName}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Last Name *</Label>
                        <Input
                            placeholder="e.g., Wilson"
                            value={form.lastName}
                            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                            invalid={Boolean(errors.lastName)}
                        />
                        {errors.lastName ? <ErrorMessage>{errors.lastName}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Email *</Label>
                        <Input
                            type="email"
                            placeholder="e.g., emily.wilson@lepa.edu"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            invalid={Boolean(errors.email)}
                        />
                        {errors.email ? <ErrorMessage>{errors.email}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Password *</Label>
                        <Input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            invalid={Boolean(errors.password)}
                        />
                        {errors.password ? <ErrorMessage>{errors.password}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Phone Number *</Label>
                        <Input
                            type="tel"
                            placeholder="e.g., +1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            invalid={Boolean(errors.phone)}
                        />
                        {errors.phone ? <ErrorMessage>{errors.phone}</ErrorMessage> : null}
                    </Field>

                    <Field>
                        <Label className="text-sm/6 text-gray-900 font-medium">Sex</Label>
                        <Listbox
                            value={form.sex}
                            onChange={(value) => setForm((f) => ({ ...f, sex: value }))}
                            placeholder="Select sex"
                            invalid={Boolean(errors.sex)}
                        >
                            {SEX_OPTIONS.map((option) => (
                                <ListboxOption key={option.id} value={option.id}>
                                    {option.name}
                                </ListboxOption>
                            ))}
                        </Listbox>
                        {errors.sex ? <ErrorMessage>{errors.sex}</ErrorMessage> : null}
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Address</Label>
                        <Input
                            placeholder="e.g., 123 Main St, City, State"
                            value={form.address}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        />
                    </Field>

                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Subjects</Label>
                        <MultiSelect
                            options={SUBJECT_OPTIONS}
                            selected={form.subjects}
                            onChange={(selected) => setForm((f) => ({ ...f, subjects: selected }))}
                            placeholder="Select subjects..."
                        />
                    </Field>

                    <Field className="sm:col-span-2 ">
                        <Label className="text-sm/6 text-gray-900 font-medium">Assigned Classes</Label>
                        <MultiSelect
                            options={classes}
                            selected={form.assignedClasses}
                            onChange={(selected) => setForm((f) => ({ ...f, assignedClasses: selected }))}
                            placeholder={loadingClasses ? 'Loading classes...' : 'Select classes...'}
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