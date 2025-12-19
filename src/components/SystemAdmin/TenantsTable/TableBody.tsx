'use client';

import Link from 'next/link';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Tenant } from '@/app/(portal)/system-admin/tenants/page';

interface TenantsTableBodyProps {
    tenants: Tenant[];
}

const TenantsTableBody = ({ tenants }: TenantsTableBodyProps) => {
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

    if (tenants.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No tenants found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tenant.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {tenant.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tenant.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tenant.teacherCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tenant.classCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(tenant.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={`/system-admin/tenants/${tenant.id}`}
                                className="text-primary-600 hover:text-primary-900"
                                title="View Details"
                            >
                                <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                                href={`/system-admin/tenants/${tenant.id}/edit`}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TenantsTableBody;

