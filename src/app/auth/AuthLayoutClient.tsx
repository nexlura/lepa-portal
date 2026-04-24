'use client';

import { WordmarkLogo } from '@/components/Logo';
import { useQueryKeys } from '@/hooks';
import { formatPhoneNumber } from '@/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AuthLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryKeys = useQueryKeys();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const isEmailParams = queryKeys.includes('email');

    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phone');

    const isVerifyRoute = pathname === '/auth/verify';
    const authMethod = isEmailParams ? 'email' : 'phone number';

    return (
        <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="absolute top-6 sm:top-8 left-5 sm:left-16">
                    <div className=" flex items-center">
                        <WordmarkLogo />
                    </div>
                </div>

                <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
                    {isEmailParams ? 'Sign in with email ' : 'Sign in with phone'}
                </h2>
                {!isVerifyRoute ? (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter password for{' '}
                        <span className="font-semibold text-primary-600">
                            {email && email}
                            {phoneNumber && formatPhoneNumber(phoneNumber)}
                        </span>{' '}
                        to sign in.
                    </p>
                ) : (
                    <p className="mt-2 text-center text-sm text-gray-600">Fast, secure, and hassle-free admissions.</p>
                )}
            </div>

            <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
            {!isVerifyRoute && (
                <div className="">
                    <p className="text-center text-sm/6 text-gray-500">
                        {`Entered the wrong ${authMethod == 'phone number' ? 'number' : authMethod}? `}
                        <a
                            href="#"
                            onClick={() => router.back()}
                            className="font-semibold text-primary-600 hover:text-primary-500"
                        >
                            {`Re-enter ${authMethod}`}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
