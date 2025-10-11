'use client'

import PasswordForm from '@/components/SignIn/PasswordForm';
import { useSearchParams } from 'next/navigation';

const AuthPasswordPage = () => {
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    return (
        <div className="py-8 px-4 sm:px-10">
            {email && <PasswordForm credential={email} />}
            {phone && <PasswordForm credential={phone} />}
        </div>
    )
}

export default AuthPasswordPage