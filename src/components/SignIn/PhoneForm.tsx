'use client'

import { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import axios from 'axios'

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import FormSubmitFeedback from '../FormAlert'
import { invokeInternalAPIRoute } from '@/lib/connector'
import { useAuthSwitcher, usePasswordRedirect } from '@/hooks'

interface PhoneFormProps {
    phoneNumber: string
    setPhoneNumber: Dispatch<SetStateAction<string>>
}

const COUNTRY_CODE = '+232'

export default function PhoneForm({ phoneNumber, setPhoneNumber }: PhoneFormProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { switchAuthMethod } = useAuthSwitcher()
    const { redirectToPassword } = usePasswordRedirect()

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // ✅ Correct endpoint (assuming you have one for phone)
    const verifyPhoneUrl = invokeInternalAPIRoute('auth/verify')

    const updateUrlWithPhone = (newPhone: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('phone', newPhone)
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value
        setPhoneNumber(newPhone)
        updateUrlWithPhone(newPhone)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const cleanedPhone = phoneNumber.replace(/\D/g, '') // remove all non-digit characters

            const fullNumber = `${COUNTRY_CODE}${cleanedPhone}`

            const resp = await axios.post(
                verifyPhoneUrl,
                { identifier: fullNumber },
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (resp.status >= 200 && resp.status < 300) {
                redirectToPassword({ phone: fullNumber })
            }
        } catch (error) {
            console.error('Phone verification error:', error)

            if (axios.isAxiosError(error)) {
                const msg =
                    error.response?.data?.message ||
                    `Request failed with status ${error.response?.status ?? 'Unknown'}`
                setError(msg)
            } else {
                setError('Unable to verify phone. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <FormSubmitFeedback msg={error} />}

            <Field>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-sm text-gray-900">{COUNTRY_CODE}</span>
                    </div>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={phoneNumber}
                        autoFocus
                        onChange={handlePhoneChange}
                        className="block w-full rounded-md py-3 pr-3 pl-14 text-base text-gray-900 
              outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 
              focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                        placeholder="23 456789"
                    />
                </div>
            </Field>

            <div>
                <Button
                    type="submit"
                    color="primary"
                    className="w-full h-12 items-center"
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying…' : 'Continue'}
                </Button>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-xs text-gray-900">OR</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="button"
                        outline
                        className="w-full h-12 items-center gap-x-4"
                        onClick={() => switchAuthMethod('phone', 'email', setPhoneNumber)}
                    >
                        <EnvelopeIcon className="h-4 w-4" />
                        Continue with Email
                    </Button>
                </div>
            </div>
        </form>
    )
}
