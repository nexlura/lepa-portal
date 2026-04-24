'use client';

import PasswordForm from '@/components/SignIn/PasswordForm';
import { useSearchParams } from 'next/navigation';

export default function AuthPasswordClient() {
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    return (
        <div className="py-8 px-4 sm:px-10">
            {email && <PasswordForm identifier={email} callbackUrl={callbackUrl} />}
            {phone && <PasswordForm identifier={phone} callbackUrl={callbackUrl} />}
        </div>
    );
}
