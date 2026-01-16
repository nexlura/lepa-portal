import { SetStateAction, Dispatch, useState } from "react"
import clsx from 'clsx'

import { MultiSelectOption } from "../../UIKit/MultiSelect"
import type { AddTeacherForm } from "@/components/Teachers/AddTeacher/types"
import SearchableAssignSelect from "./SearchableAssignSelect"

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

const ASSIGNMENT_TABS = [
    { id: 'classes', label: 'Assigned Classes', description: 'Link to classes' },
    { id: 'subjects', label: 'Assigned Subjects', description: 'Link to subjects' },
] as const

type AssignmentTab = (typeof ASSIGNMENT_TABS)[number]['id']


interface AssignedTabsProps {
    form: AddTeacherForm
    setForm: Dispatch<SetStateAction<AddTeacherForm>>
    classes: MultiSelectOption[]
    loadingClasses: boolean
}

const AssignedTabs = ({ form, setForm, classes, loadingClasses }: AssignedTabsProps) => {

    const [activeTab, setActiveTab] = useState<AssignmentTab>('classes')

    return (
        <section className=" border-t border-zinc-200 mt-5 px-6">
            <div className="flex flex-col gap-2 mb-4 border-b border-zinc-100">

                <div className="mt-4 flex gap-4">
                    {ASSIGNMENT_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                'border-b-2 pb-2 text-sm font-medium transition-all',
                                activeTab === tab.id
                                    ? 'border-zinc-950 text-zinc-950'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="rounded-md bg-white ">
                {ASSIGNMENT_TABS.map((tab) => {
                    const isSubjects = tab.id === 'subjects'
                    const isActive = activeTab === tab.id
                    if (!isActive) {
                        return null
                    }
                    return (
                        <SearchableAssignSelect
                            key={tab.id}
                            description={tab.description}
                            placeholder={isSubjects ? 'Search subjects…' : 'Search classes…'}
                            options={isSubjects ? SUBJECT_OPTIONS : classes}
                            selected={isSubjects ? form.subjects : form.assignedClasses}
                            loading={!isSubjects && loadingClasses}
                            emptyLabel={
                                !isSubjects && !loadingClasses && classes.length === 0
                                    ? 'No classes available'
                                    : 'No matches found'
                            }
                            onChange={(selected) =>
                                setForm((f) => ({
                                    ...f,
                                    subjects: isSubjects ? selected : f.subjects,
                                    assignedClasses: isSubjects ? f.assignedClasses : selected,
                                }))
                            }
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default AssignedTabs