import { Dispatch, RefObject, SetStateAction } from 'react'

import { Field, Label, ErrorMessage } from '@/components/UIKit/Fieldset'
import { Input } from '@/components/UIKit/Input'
import SelectMenu from '../UIKit/SelectMenu'
import FormSubmitFeedback from '../FormAlert'
import { ClassForm, ClassformErrors } from './AddClassModal'
import { MultiSelectOption } from '../UIKit/MultiSelect'

interface AddClassFormProps {
    localError: string | null
    nameInputRef: RefObject<HTMLInputElement | null>
    form: ClassForm
    setForm: Dispatch<SetStateAction<ClassForm>>
    errors: ClassformErrors
    gradeOptions: MultiSelectOption[]
    selectedLevel: MultiSelectOption
    setSelectedLevel: Dispatch<SetStateAction<MultiSelectOption>>
}

const AddClassForm = ({
    localError,
    nameInputRef,
    form,
    setForm,
    errors,
    gradeOptions,
    selectedLevel,
    setSelectedLevel
}: AddClassFormProps) => {
    return (
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
                <Label className="block text-sm/6 font-medium text-gray-900 ">Class</Label>
                <SelectMenu
                    options={gradeOptions}
                    selected={selectedLevel}
                    setSelected={setSelectedLevel}
                />                    </Field>
            <Field className="sm:col-span-2">
                <Label className="text-sm/6 text-gray-900 font-medium">Capacity</Label>
                <Input
                    placeholder="e.g., 40"
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                />
            </Field>
        </form>
    )
}

export default AddClassForm