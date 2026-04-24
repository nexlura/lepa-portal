'use client';

import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Agency } from '@/app/(portal)/system-admin/agencies/page';

interface AgenciesTableBodyProps {
    agencies: Agency[];
    onEdit: (agency: Agency) => void;
    onView: (agency: Agency) => void;
}

const AgenciesTableBody = ({ agencies, onEdit, onView }: AgenciesTableBodyProps) => {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    if (agencies.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No agencies found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {agencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                        <div className="text-sm text-gray-500">{agency.domain}</div>
                        <div className="text-sm text-gray-500">{agency.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {agency.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agency.tenantCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                agency.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : agency.status === 'suspended'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {agency.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(agency.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            <button
                                onClick={() => onView(agency)}
                                className="text-primary-600 hover:text-primary-900"
                                title="View Details"
                            >
                                <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => onEdit(agency)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default AgenciesTableBody;

