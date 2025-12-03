'use client'

import TableFoot from "@/components/TableFoot"
import { Teacher } from "../TeachersView"
import TeachersTableBody from "./TableBody"
import TeachersTableHead from "./TableHead"

interface TeachersTableProps {
    teachers: Teacher[]
    totalPages: number
}

const TeachersTable = ({ teachers, totalPages }: TeachersTableProps) => {

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    All Teachers
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <TeachersTableHead />
                        <TeachersTableBody teachers={teachers} />
                        {totalPages > 1 && (
                            <TableFoot totalPages={totalPages} />
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TeachersTable