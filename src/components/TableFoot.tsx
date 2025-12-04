import TablePagination from "./TablePagination";


export interface TableFootProps {
    totalPages: number
    onPageChange: (page: number) => void
}

const TableFoot = ({ totalPages, onPageChange }: TableFootProps) => {
    // const searchParams = useSearchParams()
    // const route = useRouter()

    return (
        <tfoot className="relative h-16">
            <tr className=" absolute left-0 right-0 top-0 bottom-0">
                <TablePagination
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </tr>
        </tfoot>
    )
}

export default TableFoot