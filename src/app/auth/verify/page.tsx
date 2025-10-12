'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import EmailForm from '@/components/SignIn/EmailForm'
import PhoneForm from '@/components/SignIn/PhoneForm'
import { useQueryKeys } from '@/hooks'

const AuthVerifyPage = () => {
    const searchParams = useSearchParams()
    const queryKeys = useQueryKeys()

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const isEmailParams = queryKeys.includes('email')

    // Prefill forms when search params exist
    useEffect(() => {
        const emailParam = searchParams.get('email')
        const phoneParam = searchParams.get('phone')

        if (emailParam) {
            setEmail(emailParam)
        }

        if (phoneParam) {
            setPhoneNumber(phoneParam)
        }
    }, [searchParams])

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
        </div>
    )
}

export default AuthVerifyPage
