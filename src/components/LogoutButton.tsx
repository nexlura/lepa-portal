'use client';

import { useTransition } from 'react';

import { logoutAction } from '@/app/actions/logout';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <button
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-accent-900 rounded-md hover:bg-primary-50 hover:text-gray-900 transition-colors"
            disabled={isPending}
            onClick={handleLogout}
        >
            <ArrowRightEndOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
        </button>
    );
}
