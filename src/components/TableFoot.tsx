import { useRouter, useSearchParams } from "next/navigation";
import TablePagination from "./TablePagination";


export interface TableFootProps {
    totalPages: number
}

const TableFoot = ({ totalPages }: TableFootProps) => {
    const searchParams = useSearchParams()
    const route = useRouter()

    return (
        <tfoot className="relative h-16">
            <tr className=" absolute left-0 right-0 top-0 bottom-0">
                <TablePagination
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        const params = new URLSearchParams(searchParams.toString());
                        route.push(`/classes/${page}?${params.toString()}`);
                    }}
                />
            </tr>
        </tfoot>
    )
}

export default TableFoot