import { useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'

const AddClassModal = ({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean
    onClose: (open: boolean) => void
    onSubmit: (data: {
        name: string
        capacity: string
        teacher?: string
    }) => void
}) => {
    const [form, setForm] = useState({
        name: '',
        capacity: '',
        teacher: '',
    })
    const [errors, setErrors] = useState<{ name?: string; grade?: string }>({})

    const validate = () => {
        const next: { name?: string; grade?: string } = {}
        if (!form.name.trim()) next.name = 'Class name is required'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    return (
        <Dialog size="md" open={open} onClose={onClose} className="relative z-20">
            <DialogTitle>Add a Class</DialogTitle>
            <DialogDescription>Provide details for the new class.</DialogDescription>
            <DialogBody>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                        <Label className="text-sm/6 text-gray-900 font-medium">Class Name</Label>
                        <Input
                            placeholder="e.g., Class 1"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            invalid={Boolean(errors.name)}
                        />
                        {errors.name ? <ErrorMessage>{errors.name}</ErrorMessage> : null}
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
                    onClick={() => {
                        if (!validate()) return
                        onSubmit(form)
                    }}
                >
                    Save Class
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddClassModal