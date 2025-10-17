'use client';

import { useTransition } from 'react';

import { logoutAction } from '@/app/actions/logout';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/UIKit/Tooltip';

const LogoutButton = (props: { collapsed: boolean | undefined }) => {
    const [isPending, startTransition] = useTransition();
    const { collapsed } = props



    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    const buttonContent = (
        <button
            className={`group flex w-full items-center ${collapsed ? 'justify-center' : ' px-3'}  py-2 text-sm font-medium text-accent-900 rounded-md hover:bg-primary-50 hover:text-gray-900 transition-colors`}
            disabled={isPending}
            onClick={handleLogout}
        >
            <ArrowRightEndOnRectangleIcon
                className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`}
            />
            {!collapsed && 'Logout'}
        </button>
    );

    return (
        <>
            {collapsed ? (
                <Tooltip content="Logout" position="right">
                    {buttonContent}
                </Tooltip>
            ) : (
                buttonContent
            )}
        </>
    );
}

export default LogoutButton
