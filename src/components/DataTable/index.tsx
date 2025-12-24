'use client'

import { useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import TableFoot from '@/components/TableFoot'
import SearchInput from '@/components/SearchInput'
import { getModel } from '@/lib/connector'

export interface DataTableConfig<TData, TBackendData> {
    // API Configuration
    endpoint?: string // Optional: defaults to dataKey if not provided
    dataKey: string // Key in response.data (e.g., 'students', 'teachers', 'classes')
    totalPagesKey?: string // Key for total pages (default: 'total_pages')

    // Data Transformation
    transformData: (backendData: TBackendData) => TData

    // UI Components
    title: string
    tableHead: ReactNode
    tableBody: (data: TData[]) => ReactNode
    controls?: (props: {
        searchInput: ReactNode
    }) => ReactNode

    // UI Configuration
    searchPlaceholder?: string
    columnCount: number // For loading/empty state colspan

    // Additional query params builder
    buildQueryParams?: (params: URLSearchParams, search: string, page: number) => void
    // Extra dependencies that should trigger a refetch (e.g. filters)
    queryDeps?: unknown[]
    // Optional URL builder for router replace (defaults to search + page)
    buildUrlParams?: (params: URLSearchParams, search: string, page: number) => void
}

interface DataTableProps<TData, TBackendData> {
    config: DataTableConfig<TData, TBackendData>
    initialData: TData[]
    initialTotalPages: number
}

function DataTable<TData, TBackendData>({
    config,
    initialData,
    initialTotalPages,
}: DataTableProps<TData, TBackendData>) {
    const {
        endpoint,
        dataKey,
        totalPagesKey = 'total_pages',
        transformData,
        title,
        tableHead,
        tableBody,
        controls,
        searchPlaceholder = 'search records',
        columnCount,
        buildQueryParams,
        queryDeps = [],
        buildUrlParams,
    } = config

    // Use endpoint if provided, otherwise use dataKey
    const apiEndpoint = endpoint || `/${dataKey}`

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get("search") || ""
    
    // Read page number from pathname (e.g., /students/1) or fall back to query params
    const pathParts = pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    const pageFromPath = lastPart && !isNaN(Number(lastPart)) ? Number(lastPart) : null
    const initialPage = pageFromPath || Number(searchParams.get("page")) || 1

    const [localData, setLocalData] = useState<TData[]>(() => {
        return initialSearch ? [] : initialData
    })
    const [localTotalPages, setLocalTotalPages] = useState(initialTotalPages)

    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [searchQry, setSearchQry] = useState<string>(initialSearch)
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

    // Refs to track previous values and prevent unnecessary updates
    const prevDebouncedSearchRef = useRef(initialSearch)
    const prevCurrentPageRef = useRef(initialPage)
    const prevQueryDepsKeyRef = useRef(JSON.stringify(queryDeps))
    const isInitialMountRef = useRef(true)
    const initialDataRef = useRef(initialData)
    const initialTotalPagesRef = useRef(initialTotalPages)
    const initialSearchRef = useRef(initialSearch)
    const initialPageRef = useRef(initialPage)
    const filterChangeRef = useRef(false)

    const queryDepsKey = useMemo(() => JSON.stringify(queryDeps), [queryDeps])
    const hasActiveFilters = useMemo(
        () =>
            queryDeps.some(dep => {
                if (typeof dep === 'string') return dep.trim() !== ''
                return dep !== undefined && dep !== null && dep !== false
            }),
        [queryDeps]
    )

    // Update refs when props change (but don't trigger re-fetch)
    useEffect(() => {
        initialDataRef.current = initialData
        initialTotalPagesRef.current = initialTotalPages
    }, [initialData, initialTotalPages])

    /** 🔄 Debounce Effect */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQry)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQry])

    /** 🔄 Fetch Data */
    const fetchData = useCallback(
        async (page: number, search: string, options?: { useInitialFallback?: boolean }) => {
            const useInitialFallback = options?.useInitialFallback ?? true

            // If no search, no active filters, and allowed, use initial data from refs
            if (!search.trim() && useInitialFallback && !hasActiveFilters) {
                setLocalData(initialDataRef.current)
                setLocalTotalPages(initialTotalPagesRef.current)
                return
            }

            try {
                const params = new URLSearchParams()
                params.set("page", page.toString())
                params.set("limit", "10")

                // Allow custom query params (e.g. filters, search)
                if (buildQueryParams) {
                    buildQueryParams(params, search, page)
                }

                const res = await getModel(`${apiEndpoint}?${params.toString()}`)
                if (!res?.data) throw new Error(`Error fetching ${dataKey}`)

                const backendData = res.data[dataKey] || []
                const totalPages = res.data[totalPagesKey] || 1

                const transformed = backendData.map(transformData)

                setLocalData(transformed)
                setLocalTotalPages(totalPages)
            } catch (err) {
                console.error(`Error fetching ${dataKey}:`, err)
                setLocalData([])
                setLocalTotalPages(1)
            }
        },
        [apiEndpoint, dataKey, totalPagesKey, transformData, buildQueryParams, hasActiveFilters]
    )

    // Reset page + mark filter change when external deps change
    useEffect(() => {
        if (isInitialMountRef.current) {
            return
        }

        if (prevQueryDepsKeyRef.current !== queryDepsKey) {
            filterChangeRef.current = true
            setCurrentPage(1)
        }
    }, [queryDepsKey])

    /** 🔁 Reset page when search changes (but not on initial mount) */
    useEffect(() => {
        // Skip on initial mount
        if (isInitialMountRef.current) {
            return
        }

        // Only reset page if search actually changed
        if (prevDebouncedSearchRef.current !== debouncedSearch) {
            setCurrentPage(1)
        }
    }, [debouncedSearch])

    /** 🔁 Sync URL + Fetch when page, search, or filters change */
    useEffect(() => {
        // Skip on initial mount
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false
            // If there's an initial search, fetch data on mount
            if (initialSearchRef.current.trim()) {
                fetchData(initialPageRef.current, initialSearchRef.current, { useInitialFallback: true })
            } else if (hasActiveFilters) {
                fetchData(initialPageRef.current, initialSearchRef.current, { useInitialFallback: false })
            }
            return
        }

        // Check if we actually need to update
        const searchChanged = prevDebouncedSearchRef.current !== debouncedSearch
        const pageChanged = prevCurrentPageRef.current !== currentPage
        const depsChanged = prevQueryDepsKeyRef.current !== queryDepsKey

        if (!searchChanged && !pageChanged && !depsChanged) {
            return
        }

        // Update refs
        prevDebouncedSearchRef.current = debouncedSearch
        prevCurrentPageRef.current = currentPage
        prevQueryDepsKeyRef.current = queryDepsKey

        // Build URL path - handle path-based page routing (e.g., /students/1 -> /students/2)
        let newPathname = pathname
        const pathParts = pathname.split('/').filter(Boolean)
        const lastPart = pathParts[pathParts.length - 1]
        
        // Check if last part is a number (page number)
        if (lastPart && !isNaN(Number(lastPart))) {
            // Replace the page number in the path
            pathParts[pathParts.length - 1] = currentPage.toString()
            newPathname = `/${pathParts.join('/')}`
        } else {
            // Append page number if path doesn't end with a number
            newPathname = `${pathname}/${currentPage}`
        }

        // Build query params
        const params = new URLSearchParams()
        if (debouncedSearch.trim()) {
            params.set("search", debouncedSearch.trim())
        }
        if (buildUrlParams) {
            buildUrlParams(params, debouncedSearch, currentPage)
        }

        const newUrl = `${newPathname}${params.toString() ? `?${params.toString()}` : ''}`

        // Update URL
        router.replace(newUrl)

        // Fetch data - always fetch when page changes or filters change, use initial fallback only for search changes
        const useInitialFallback = (filterChangeRef.current || pageChanged) ? false : true
        fetchData(currentPage, debouncedSearch, { useInitialFallback })
        if (filterChangeRef.current) {
            filterChangeRef.current = false
        }
    }, [currentPage, debouncedSearch, fetchData, router, pathname, buildUrlParams, queryDepsKey, hasActiveFilters])

    /** 🧠 Decide which data to show */
    const hasSearch = debouncedSearch.trim() !== ""
    const shouldUseLocalData = hasSearch || hasActiveFilters
    const tableData = shouldUseLocalData ? localData : initialData
    const displayTotalPages = shouldUseLocalData ? localTotalPages : initialTotalPages

    const searchInput = (
        <SearchInput
            search={searchQry}
            setSearch={setSearchQry}
            placeholder={searchPlaceholder}
        />
    )

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Controls */}
                {controls ? (
                    controls({ searchInput })
                ) : (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        {searchInput}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {tableHead}
                        { hasSearch && tableData.length === 0 ? (
                            // No Results Found (only when searching)
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="text-center py-8 text-gray-500 italic"
                                    >
                                        No results found for &quot;{debouncedSearch}&quot;
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <>{tableBody(tableData)}</>
                        )}

                        {/* Pagination */}
                        {displayTotalPages > 1  && (
                            <TableFoot
                                totalPages={displayTotalPages}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DataTable

