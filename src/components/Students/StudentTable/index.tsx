'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import StudentTableControls from './TableControls'
import StudentsTableBody from './TableBody'
import TableFoot from '@/components/TableFoot'
import StudentsTableHead from './TableHead'
import { BackendStudentData, Student } from '@/app/(portal)/students/[pid]/page'
import { getModel } from '@/lib/connector'
import SearchInput from '@/components/SearchInput'

const StudentsTable = ({ students: initialStudents, totalPages: initialTotalPages }: any) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [localStudents, setLocalStudents] = useState<Student[]>(initialStudents)
    const [localTotalPages, setLocalTotalPages] = useState(initialTotalPages)

    const [currentPage, setCurrentPage] = useState<number>(
        Number(searchParams.get("page")) || 1
    )

    const [searchQry, setSearchQry] = useState<string>(searchParams.get("search") || "")

    // 👇 NEW: debounced value
    const [debouncedSearch, setDebouncedSearch] = useState(searchQry)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * ⏳ Debounce Effect
     * Runs 300ms after user stops typing
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQry)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQry])


    /**
     * 🔄 Fetch data (using debouncedSearch)
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.set("page", currentPage.toString())
            params.set("limit", "10")

            if (debouncedSearch) params.set("search", debouncedSearch)

            const url = `/students?${params.toString()}`
            const res = await getModel(url)

            if (!res?.data) throw new Error("Error fetching students")

            const students = res.data.students
            const totalPages = res.data.total_pages

            const transformed = students.map((student: BackendStudentData): Student => ({
                id: student.id,
                firstName: student.first_name,
                lastName: student.last_name,
                status: student.status,
                enrollmentDate: student.enrollment_date,
                sex: student.sex,
                currentClassName: student.current_class_name,
                dateOfBirth: student.date_of_birth,
                middleName: '',
                fullName: '',
                address: '',
                photoURL: '',
                age: 0,
                note: ''
            }))

            setLocalStudents(transformed)
            setLocalTotalPages(totalPages)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, debouncedSearch])


    /**
     * 🧭 Sync URL + refetch when page, grade, or debounced search changes
     */
    useEffect(() => {
        const params = new URLSearchParams()

        if (debouncedSearch) params.set("search", debouncedSearch)

        router.push(`/students/${currentPage}?${params.toString()}`)
        fetchData()
    }, [currentPage, debouncedSearch, router, fetchData])


    const onPageChange = (page: number) => {
        setCurrentPage(page)
    }

    // When search text changes, reset to page 1
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQry])

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">

                {/* Controls */}
                <StudentTableControls
                    searchInput={
                        <SearchInput
                            search={searchQry}
                            setSearch={setSearchQry}
                            placeholder='search students by name'
                        />
                    }
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <StudentsTableHead />
                        <StudentsTableBody students={localStudents} />

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

export default StudentsTable
