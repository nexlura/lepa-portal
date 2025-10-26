import { useState } from 'react'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/UIKit/Dialog'
import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import { Button } from '../UIKit/Button'
import SelectMenu from '../UIKit/SelectMenu'

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