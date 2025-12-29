'use client';

import Link from 'next/link';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { SystemUser } from '@/app/(portal)/system-admin/users/page';

interface SystemUsersTableBodyProps {
    users: SystemUser[];
}

const SystemUsersTableBody = ({ users }: SystemUsersTableBodyProps) => {
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

    if (users.length === 0) {
        return (
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role || 'N/A'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {user.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            <Link
                                href={`/system-admin/users/${user.id}`}
                                className="text-primary-600 hover:text-primary-900"
                                title="View Details"
                            >
                                <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                                href={`/system-admin/users/${user.id}/edit`}
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

export default SystemUsersTableBody;

