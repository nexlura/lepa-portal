import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TablePagination from "./TablePagination";


export interface TableFootProps {
    totalPages: number
}

const TableFoot = ({ totalPages }: TableFootProps) => {
    const searchParams = useSearchParams()
    const route = useRouter()
    const pathname = usePathname()

    return (
        <tfoot className="relative h-16">
            <tr className=" absolute left-0 right-0 top-0 bottom-0">
                <TablePagination
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        const params = new URLSearchParams(searchParams.toString());
                        // Set or update the page parameter
                        if (page > 1) {
                            params.set('page', page.toString());
                        } else {
                            params.delete('page');
                        }
                        // Use current pathname and update query params
                        const newPath = `${pathname || ''}${params.toString() ? `?${params.toString()}` : ''}`;
                        route.push(newPath);
                    }}
                />
            </tr>
        </tfoot>
    )
}

export default TableFoot