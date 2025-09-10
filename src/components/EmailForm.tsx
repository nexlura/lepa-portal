'use client'

import { PhoneIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { Dispatch, SetStateAction, useState } from 'react'
import { postModel } from '@/app/lib/supabase/connector'
import { useSearchParams } from 'next/navigation';


interface EmailFormProps {
    errorMessage?: string
    email: string
    setEmail: Dispatch<SetStateAction<string>>
    switchToPhone: () => void
    formAction?: (payload: FormData) => void | Promise<void>
    isPending: boolean
}

const EmailForm = ({ email, setEmail, switchToPhone, formAction, errorMessage, isPending }: EmailFormProps) => {
    const searchParams = useSearchParams()

    const [showPassword, setShowPassword] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const urlEndpoint = 'auth/verify-email'

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setIsLoading(true)
        try {
            const resp = await postModel<{ exists: boolean } | string>(`${urlEndpoint}`, { email })

            if (typeof resp === 'string') {
                setLocalError(resp)
            } else if (resp?.exists) {
                setShowPassword(true)
            } else {
                setLocalError('No account found for this email.')
            }
        } catch (err) {
            setLocalError('Unable to verify email. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    if (showPassword) {
        return (
            <form className="space-y-6" action={formAction}>
                <input type="hidden" name="email" value={email} />
                <Field>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-2 grid grid-cols-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoFocus
                            required
                            className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                        />
                    </div>
                </Field>

                {errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                )}

                <div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />

                    <Button
                        type="submit"
                        color="primary"
                        className="w-full h-12 items-center"
                        disabled={isPending}
                    >
                        {isPending ? 'Signing in' : 'Sign in'}
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <form className="space-y-6" onSubmit={handleVerifyEmail}>
            <Field>
                <Label htmlFor="email">Email Address</Label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                    />
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
                    disabled={isLoading || !email}
                >
                    {isLoading ? 'Submitting' : 'Continue'}
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
                        onClick={switchToPhone}
                    >
                        <PhoneIcon className="h-4 w-4" />
                        Continue with Phone
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default EmailForm