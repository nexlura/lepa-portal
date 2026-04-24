import { Suspense } from 'react';

import AuthLayoutClient from './AuthLayoutClient';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense
            fallback={
                <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center text-gray-600" aria-busy="true">
                        Loading…
                    </div>
                </div>
            }
        >
            <AuthLayoutClient>{children}</AuthLayoutClient>
        </Suspense>
    );
}
