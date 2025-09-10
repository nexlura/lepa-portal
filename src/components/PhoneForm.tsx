'use client'

import { EnvelopeIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { postModel } from '@/app/lib/supabase/connector'

interface PhoneFormProps {
    isLoading: boolean
    phoneNumber: string
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setPhoneNumber: Dispatch<SetStateAction<string>>
    switchToEmail: () => void
}

const PhoneForm = ({ isLoading, phoneNumber, setIsLoading, setPhoneNumber, switchToEmail }: PhoneFormProps) => {
    const router = useRouter()
    const [localError, setLocalError] = useState<string | null>(null)
    const [verified, setVerified] = useState(false)

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setIsLoading(true)

        try {
            const resp = await postModel<{ exists: boolean } | string>('auth/verify-identifier', { phone: phoneNumber })
            if (typeof resp === 'string') {
                setLocalError(resp)
            } else if (resp?.exists) {
                setVerified(true)
                // Placeholder: navigate or prompt OTP in future
                router.push('/dashboard')
            } else {
                setLocalError('No account found for this phone number.')
            }
        } catch {
            setLocalError('Unable to verify phone. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="space-y-6" onSubmit={handlePhoneSubmit}>
            <Field>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-14 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                    />
                    <div
                        aria-hidden="true"
                        className=" flex item-senter pointer-events-none col-start-1 row-start-1 ml-3 self-center text-gray-400"
                    >
                        <span className='text-sm text-gray-900'>+232</span>
                    </div>
                </div>
            </Field>

            {localError && (
                <p className="text-sm text-red-600">{localError}</p>
            )}

            <div>
                <Button
                    type="submit"
                    color="primary"
                    className="w-full h-12 items-center"
                    disabled={isLoading}

                >
                    {isLoading ? 'Submitting' : (verified ? 'Verified' : 'Continue')}
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
                        onClick={switchToEmail}
                    >
                        <EnvelopeIcon className="h-4 w-4 " />
                        Continue with Email
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default PhoneForm