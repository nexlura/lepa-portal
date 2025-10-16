'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import EmailForm from '@/components/SignIn/EmailForm'
import PhoneForm from '@/components/SignIn/PhoneForm'
import { useQueryKeys } from '@/hooks'

const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 9)}`
}

const AuthVerifyPage = () => {
    const searchParams = useSearchParams()
    const queryKeys = useQueryKeys()

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const isEmailParams = queryKeys.includes('email')

    useEffect(() => {
        const emailParam = searchParams.get('email')
        const phoneParam = searchParams.get('phone')

        if (emailParam) {
            setEmail(emailParam)
        }

        if (phoneParam) {
            // Format the phone param if it's present in URL
            const formatted = formatPhoneNumber(phoneParam)
            setPhoneNumber(formatted)
        }
    }, [searchParams])

    return (
        <div className="py-8 px-4 sm:px-10">
            {isEmailParams ? (
                <EmailForm email={email} setEmail={setEmail} />
            ) : (
                <PhoneForm phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
            )}
        </div>
    )
}

export default AuthVerifyPage
