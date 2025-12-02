import { SchoolClass } from "@/app/(portal)/classes/[pageNumber]/page"

interface ClassesTableBodyProps {
    classes: SchoolClass[]
}

const ClassesTableBody = ({ classes }: ClassesTableBodyProps) => {
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((klass) => (
                <tr key={klass.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">{klass.className}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.grade ?? '-'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.capacity ?? '-'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{klass.currentSize || '-'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                            {klass.teachers && klass.teachers.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {(() => {
                                        const names = klass.teachers.map((t) => t.name);
                                        const first = names[0];
                                        const count = names.length - 1;

                                        return (
                                            <span className="capitalize inline-flex py-1 text-xs font-medium">
                                                {first}
                                                {count > 0 && (
                                                    <span className="text-gray-500 ml-1">+{count} more</span>
                                                )}
                                            </span>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default ClassesTableBody