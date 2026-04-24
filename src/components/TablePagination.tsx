import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface PaginationProps {
    totalPages: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

const generatePagesCounter = (totalPages: number, currentPage: number = 1) => {
    const pages: Array<{ page: string; type: 'page' | 'ellipsis' }> = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push({ page: i.toString(), type: 'page' });
        }
        return pages;
    }

    pages.push({ page: '1', type: 'page' });

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
    }

    if (startPage > 2) {
        pages.push({ page: '...', type: 'ellipsis' });
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push({ page: i.toString(), type: 'page' });
    }

    if (endPage < totalPages - 1) {
        pages.push({ page: '...', type: 'ellipsis' });
    }

    if (totalPages > 1) {
        pages.push({ page: totalPages.toString(), type: 'page' });
    }

    return pages;
}

const TablePagination = ({ totalPages, currentPage: controlledPage, onPageChange }: PaginationProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryPage = Number(searchParams.get('page')) || 1;
    const currentPage = controlledPage || queryPage;

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            const parts = pathname.split("/").filter(Boolean);
            const basePath = parts.length > 2 ? `/${parts.slice(0, -1).join("/")}` : pathname;
            router.push(`${basePath}/${page}`);
        }
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing
                        <span className="text-primary-800 font-medium">
                            {` ${currentPage} `}
                        </span> of <span className="text-primary-800 font-medium">
                            {` ${totalPages} `}</span>
                        pages
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <span className="sr-only">previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {generatePagesCounter(totalPages, currentPage).map((counter, index) => (
                            counter.type === 'ellipsis' ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                                >
                                    {counter.page}
                                </span>
                            ) : (
                                <button
                                    key={counter.page}
                                    onClick={() => handlePageChange(Number(counter.page))}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer ${currentPage === Number(counter.page)
                                        ? "z-10 bg-primary-600 text-white focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        }`}
                                >
                                    {counter.page}
                                </button>
                            )
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <span className="sr-only">next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TablePagination;
