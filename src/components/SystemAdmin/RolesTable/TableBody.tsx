'use client';

import Link from 'next/link';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Role } from '@/app/(portal)/system-admin/roles/page';

interface RolesTableBodyProps {
    roles: Role[];
}

const RolesTableBody = ({ roles }: RolesTableBodyProps) => {
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

    const formatPermissions = (permissions: string[]) => {
        if (permissions.length === 0) return 'No permissions';
        if (permissions.length <= 3) {
            return permissions.join(', ');
        }
        return `${permissions.slice(0, 3).join(', ')}, +${permissions.length - 3} more`;
    };

    if (roles.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No roles found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md truncate">{role.description}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md" title={role.permissions.join(', ')}>
                            {formatPermissions(role.permissions)}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {role.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(role.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={`/system-admin/roles/${role.id}`}
                                className="text-primary-600 hover:text-primary-900"
                                title="View Details"
                            >
                                <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                                href={`/system-admin/roles/${role.id}/edit`}
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

export default RolesTableBody;

