'use client'

import { useState } from 'react'

import EmailForm from '@/components/SignIn/EmailForm'
import PhoneForm from '@/components/SignIn/PhoneForm';
import { useQueryKeys } from '@/app/hooks';
import { useSearchParams } from 'next/navigation';

const AuthVerifyPage = () => {
    const queryKeys = useQueryKeys();

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const isEmailParams = queryKeys.includes('email')

    return (
        <div className="py-8 px-4 sm:px-10">
            {isEmailParams ? (
                <EmailForm
                    email={email}
                    setEmail={setEmail}
                />
            ) : (
                <PhoneForm
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                />
            )}

            {/* Additional Info */}
            <div className="mt-6">

            </div>
        </div>
    )
}

export default AuthVerifyPage