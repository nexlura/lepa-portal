import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TablePagination from "./TablePagination";

export interface TableFootProps {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
}

const TableFoot = ({ totalPages, currentPage, onPageChange }: Partial<TableFootProps> & { totalPages: number }) => {
    const searchParams = useSearchParams()
    const route = useRouter()
    const pathname = usePathname()

    return (
        <tfoot>
            <tr>
                <td colSpan={1000} className="px-0">
                    <TablePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={(page) => {
                            if (onPageChange) {
                                onPageChange(page)
                                return
                            }
                            const params = new URLSearchParams(searchParams.toString());
                            if (page > 1) {
                                params.set('page', page.toString());
                            } else {
                                params.delete('page');
                            }
                            const newPath = `${pathname || ''}${params.toString() ? `?${params.toString()}` : ''}`;
                            route.push(newPath);
                        }}
                    />
                </td>
            </tr>
        </tfoot>
    )
}

export default TableFoot
