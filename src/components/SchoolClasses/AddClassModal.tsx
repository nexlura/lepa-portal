'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'
import SelectMenu from '../UIKit/SelectMenu'
import { postModel } from '@/lib/connector'

interface AddClassModalProps {
    open: boolean
    onClose: (open: boolean) => void
}


const classes = [
    { id: 1, name: 'class 1' },
    { id: 2, name: 'class 2' },
    { id: 3, name: 'class 3' },
    { id: 4, name: 'class 4' },
    { id: 5, name: 'class 5' },
    { id: 6, name: 'class 6' },

]

const AddClassModal = ({ open, onClose }: AddClassModalProps) => {
    const { data: session } = useSession();

    const [form, setForm] = useState({
        name: '',
        capacity: '',
        teacher: '',
    })
    const [errors, setErrors] = useState<{ name?: string; grade?: string }>({})
    const [selectedLevel, setSelectedLevel] = useState(classes[1])

    const validate = () => {
        const next: { name?: string; grade?: string } = {}
        if (!form.name.trim()) next.name = 'Class name is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const postData = {
        user_id: session?.user?.userId,
        tenant_id: session?.user?.tenantId,
        grade: selectedLevel,
        capacity: form.capacity,
        name: form.name
    }

    const handleSubmit = async () => {
        if (!validate) return

        try {
            const resp = await postModel(
                '/classes',
                postData,
                {
                    headers: {
                        // 'X-Lepa-Host-Header': host,
                    },
                }
            );

            if (
                resp &&
                resp?.data &&
                'access_token' in resp.data &&
                typeof resp.data.access_token === 'string'
            ) {
                const user = resp.data.user;
                const tenant = resp.data.tenant;
                const role = user?.roles?.[0] || 'User';
                const name =
                    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
                    undefined;

                return {
                    id: user?.email,
                    email: user?.email,
                    name,
                    role,
                    accessToken: resp.data.access_token,
                    refreshToken: resp.data.refresh_token,
                    schoolName: tenant?.school_name || '',
                };
            }
        } catch (error) {
            console.error('Authorize error:', error);
        }

    }

    useEffect(() => {
        console.log('session', session?.user);

    }, [session])


    return (
        <Dialog size="md" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Add a Class</DialogTitle>
            <DialogDescription>Provide details for the new class.</DialogDescription>
            <DialogBody>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Class Name</Label>
                        <Input
                            placeholder="e.g., Class 1 Blue"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
                    </Field>
                    <Field className="sm:col-span-2">
                        <Label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Class</Label>
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
                </div>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={() => onClose(false)}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                >
                    Save Class
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddClassModal