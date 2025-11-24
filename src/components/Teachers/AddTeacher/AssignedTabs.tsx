import { SetStateAction, Dispatch, useState } from "react"
import clsx from 'clsx'

import { MultiSelect, MultiSelectOption } from "../../UIKit/MultiSelect"
import { AddTeacherForm } from "@/app/(portal)/teachers/new/page"

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
    { id: 'classes', label: 'Assigned Classes', description: 'Pick the classes they belong to.' },
    { id: 'subjects', label: 'Assigned Subjects', description: 'Choose all subjects this teacher can cover.' },
] as const

type AssignmentTab = (typeof ASSIGNMENT_TABS)[number]['id']


interface AssignedTabsProps {
    form: AddTeacherForm
    setForm: Dispatch<SetStateAction<AddTeacherForm>>
    classes: MultiSelectOption[]
    loadingClasses: boolean
}

const AssignedTabs = ({ form, setForm, classes, loadingClasses }: AssignedTabsProps) => {

    const [activeTab, setActiveTab] = useState<AssignmentTab>('subjects')

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
                        <div key={tab.id} className="space-y-4">
                            <p className="text-sm text-gray-500">{tab.description}</p>
                            {isSubjects ? (
                                <MultiSelect
                                    options={SUBJECT_OPTIONS}
                                    selected={form.subjects}
                                    onChange={(selected) => setForm((f) => ({ ...f, subjects: selected }))}
                                    placeholder="Select subjects..."
                                    aria-label="Assign subjects"
                                />
                            ) : (
                                <MultiSelect
                                    options={classes}
                                    selected={form.assignedClasses}
                                    onChange={(selected) => setForm((f) => ({ ...f, assignedClasses: selected }))}
                                    placeholder={loadingClasses ? 'Loading classes...' : 'Select classes...'}
                                    aria-label="Assign classes"
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default AssignedTabs