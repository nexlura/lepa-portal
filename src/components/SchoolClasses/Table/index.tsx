'use client'

import { useCallback, useEffect, useMemo, useState } from "react"

import { BackendClassesData, SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"
import SchoolClassesTableControls from "./Controls"
import TableFoot from "@/components/TableFoot"
import ClassesTableHead from "./TableHead"
import ClassesTableBody from "./TableBody"
import SearchInput from "@/components/SearchInput"
import { useRouter, useSearchParams } from "next/navigation"
import { getModel } from "@/lib/connector"
interface ClassesTableProps {
    classes: SchoolClass[]
    totalPages: number
}

const SchoolClassesTable = ({ classes: initialClasses, totalPages: initialTotalPages }: ClassesTableProps) => {
    // UI state: search, filters, sorting, pagination
    const [search, setSearch] = useState('')
    const [gradeFilter, setGradeFilter] = useState<string>('All')

    const searchParams = useSearchParams()
    const router = useRouter()

    // Local State
    const [localClasses, setLocalClasses] = useState<SchoolClass[]>(initialClasses)
    const [localTotalPages, setLocalTotalPages] = useState(initialTotalPages)

    const [currentPage, setCurrentPage] = useState<number>(
        Number(searchParams.get("page")) || 1
    )

    const [searchQry, setSearchQry] = useState<string>(searchParams.get("search") || "")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    /**
     * 🔄 Fetch data locally (search, pagination, grade)
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.set("page", currentPage.toString())
            params.set("limit", "10")

            if (searchQry) params.set("search", searchQry)
            if (gradeFilter !== "All") params.set("grade", gradeFilter)

            const url = `/classes?${params.toString()}`
            const res = await getModel(url)

            if (!res?.data) throw new Error("Error fetching students")

            const classes = res.data.students
            const totalPages = res.data.total_pages

            const transformedData: SchoolClass[] = classes.map((classK: BackendClassesData) => {

                return {
                    id: classK.id,
                    capacity: classK.capacity,
                    className: classK.name,
                    createdAt: classK.created_at,
                    currentSize: classK.current_size.toString(),
                    teachers: classK.teachers.map(t => ({
                        id: t.id,
                        name: t.full_name
                    })),
                    grade: classK.grade
                }
            });

            setLocalClasses(transformedData)
            setLocalTotalPages(totalPages)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, searchQry, gradeFilter])


    /**
     * 🧭 Update URL when search or page changes (frontend sync)
     * Does NOT modify parent data.
     */
    useEffect(() => {
        const params = new URLSearchParams()

        // params.set("page", currentPage.toString())
        if (searchQry) params.set("search", searchQry)

        router.push(`/students/${currentPage}?${params.toString()}`)
        fetchData()
    }, [currentPage, searchQry, gradeFilter, router, fetchData])


    /**
     * 💬 Handle pagination click from TableFoot locally
     */
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Derived data: unique grades for filter
    const gradeOptions = useMemo(() => {
        const set = new Set<string>(localClasses.map(c => c.className).filter(Boolean))
        return ['All', ...Array.from(set).sort()]
    }, [localClasses])

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 sm:py-6 sm:pb-0">
                <SchoolClassesTableControls
                    gradeFilter={gradeFilter}
                    gradeOptions={gradeOptions}
                    setGradeFilter={setGradeFilter}
                    searchInput={
                        <SearchInput
                            search={searchQry}
                            setSearch={setSearchQry}
                            placeholder='search by class name'
                        />
                    }
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <ClassesTableHead />
                        <ClassesTableBody classes={localClasses} />
                        {localTotalPages > 1 && (
                            <TableFoot
                                totalPages={localTotalPages}
                                onPageChange={onPageChange}
                            />
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SchoolClassesTable