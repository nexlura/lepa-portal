import { SetStateAction, Dispatch } from "react"

import { MultiSelectOption } from "../../UIKit/MultiSelect"
import { AddStudentForm } from "@/app/(portal)/students/new/page"
import SearchableAssignSelect from "./SearchableAssignSelect"

interface AssignedClassTabsProps {
    form: AddStudentForm
    setForm: Dispatch<SetStateAction<AddStudentForm>>
    classes: MultiSelectOption[]
    loadingClasses: boolean
}

const AssignedClassTabs = ({ form, setForm, classes, loadingClasses }: AssignedClassTabsProps) => {
    return (
        <section className="border-t border-zinc-200 mt-5 px-6">
            <div className="flex flex-col gap-2 mb-4 border-b border-zinc-100">
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Assigned Class</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Select the class this student will be assigned to
                    </p>
                </div>
            </div>
            <div className="rounded-md bg-white">
                <SearchableAssignSelect
                    placeholder="Search classes…"
                    options={classes}
                    selected={form.assignedClass ? [form.assignedClass] : []}
                    loading={loadingClasses}
                    emptyLabel={
                        !loadingClasses && classes.length === 0
                            ? 'No classes available'
                            : 'No matches found'
                    }
                    onChange={(selected) =>
                        setForm((f) => ({
                            ...f,
                            assignedClass: selected.length > 0 ? selected[0] : null,
                        }))
                    }
                />
            </div>
        </section>
    )
}

export default AssignedClassTabs

