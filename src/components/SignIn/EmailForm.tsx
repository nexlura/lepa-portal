'use client'

import { PhoneIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { useState } from 'react'
import { postModel } from '@/app/lib/connector'
import PasswordForm from './PasswordForm'
import { SignInFormProps } from '@/app/page'


const EmailForm = ({ setAuthMethod, setShowPassword, showPassword }: SignInFormProps) => {

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')


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

    const switchToPhone = () => {
        setAuthMethod('phone')
        setEmail('')
    }

    if (showPassword) {
        return (
            <PasswordForm credential={email} />
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
                    disabled={isLoading}
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