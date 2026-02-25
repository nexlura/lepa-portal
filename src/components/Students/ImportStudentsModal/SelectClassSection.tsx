import {  useEffect, useState, useCallback, useRef, Dispatch, SetStateAction } from "react"

import { MultiSelectOption } from "../../UIKit/MultiSelect"
import { getModel } from "@/lib/connector"
import { BackendClassData } from "@/app/(portal)/classes/[pageNumber]/page"
import SearchableAssignSelect from "../AddStudent/SearchableAssignSelect"
interface SelectClassSectionProps {
    selectedClass: MultiSelectOption | null
    setSelectedClass: Dispatch<SetStateAction<MultiSelectOption | null>>
    error?: string
}


const SelectClassSection = ({selectedClass, setSelectedClass, error}: SelectClassSectionProps) => {
    const fetchedRef = useRef(false)


    const [classes, setClasses] = useState<MultiSelectOption[]>([])
    const [loadingClasses, setLoadingClasses] = useState(false)
      // // Fetch classes once
      const fetchClasses = useCallback(async () => {
        setLoadingClasses(true)
    
        try {
            const res = await getModel<{ data?: { classes?: BackendClassData[] } }>(
                '/classes?page=1&limit=100'
            )
    
            const serverClasses = res?.data?.classes
    
            if (Array.isArray(serverClasses)) {
                const classOptions: MultiSelectOption[] = serverClasses.map((cls) => ({
                    id: cls.id,
                    name: `${cls.name} (${cls.grade})`,
                }))
    
                setClasses(classOptions)
            }
        } catch (err) {
            console.error('Error fetching classes:', err)
        } finally {
            setLoadingClasses(false)
        }
    }, []) // setters are stable, so no dependencies needed

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchClasses()
}, [fetchClasses])


    return (
        <section className="mb-5">
            <div className="flex flex-col gap-2 mb-4">
                <div className="mt-4">
                    <h3 className="text-sm/6 text-gray-900 font-medium">Select Class</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Select the class this students will be assigned to
                    </p>
                </div>
            </div>
            <div className="rounded-md bg-white">
                <SearchableAssignSelect
                    placeholder="Search classes…"
                    options={classes}
                    selected={selectedClass? [selectedClass] : []}
                    loading={loadingClasses}
                    emptyLabel={
                        !loadingClasses && classes.length === 0
                            ? 'No classes available'
                            : 'No matches found'
                    }
                    error={error}
                    onChange={(selected) =>
                        setSelectedClass(selected.length > 0 ? selected[0] : null)
                    }
                />
                {error && (
                    <p className="mt-1 text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </section>
    )
}

export default SelectClassSection

