import { SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"

interface ClassesTableBodyProps {
    classes: SchoolClass[]
}

const ClassesTableBody = ({ classes }: ClassesTableBodyProps) => {
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((klass) => (
                <tr key={klass.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">{klass.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.capacity ?? '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.currentSize || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.teacher || '-'}</div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default ClassesTableBody