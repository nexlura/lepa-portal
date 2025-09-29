'use client'

import { PhoneIcon } from '@heroicons/react/24/outline'
import { SetStateAction, Dispatch, useState } from 'react'

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { invokeInternalAPIRoute } from '@/app/lib/connector'
import PasswordForm from './PasswordForm'
import { SignInFormProps } from '@/app/page'

interface EmailFormProps extends SignInFormProps {
    email: string
    setEmail: Dispatch<SetStateAction<string>>
}

const EmailForm = ({
    showPassword,
    email,
    setAuthMethod,
    setShowPassword,
    setEmail
}: EmailFormProps) => {

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const url = invokeInternalAPIRoute('auth/verify-email')

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setIsLoading(true)
        try {
            // const resp = await postModel<{ exists: boolean } | string>(`${urlEndpoint}`, { email })

            const resp = await fetch(url, {
                method: 'POST', // Specify the method as POST
                headers: {
                    'Content-Type': 'application/json' // Indicate that the body is JSON
                },
                body: JSON.stringify({ email }) // Convert the JavaScript object to a JSON string
            });

            if (!resp.ok) {
                // Handle HTTP errors
                const errorData = await resp.json();
                throw new Error(`HTTP error! Status: ${resp.status}, Message: ${errorData.message || 'Unknown error'}`);
            }

            const responseData = await resp.json(); // Parse the JSON response

            if (typeof responseData === 'string') {
                setLocalError(responseData)
            } else if (responseData?.exists) {
                setShowPassword(true)
            } else {
                setLocalError('No account found for this email.')
            }
        } catch (error) {
            console.error('Error during POST request:', error);
            setLocalError('Unable to verify email. Please try again.')
            throw error; // Re-throw the error for further handling
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