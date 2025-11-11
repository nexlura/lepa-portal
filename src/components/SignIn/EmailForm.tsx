'use client'

import { PhoneIcon } from '@heroicons/react/24/outline'
import { SetStateAction, Dispatch, useState, ChangeEvent } from 'react'
import axios from 'axios'
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { invokeInternalAPIRoute } from '@/lib/connector'
import FormSubmitFeedback from '../FormAlert'
import { useAuthSwitcher, usePasswordRedirect } from '@/hooks';
interface EmailFormProps {
    email: string
    setEmail: Dispatch<SetStateAction<string>>
}

const EmailForm = ({
    email,
    setEmail
}: EmailFormProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { switchAuthMethod } = useAuthSwitcher();
    const { redirectToPassword } = usePasswordRedirect();

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const url = invokeInternalAPIRoute('auth/verify')


    const handleVerificationSuccess = () => {
        // Example: redirect based on whichever identifier you have
        redirectToPassword({ email: email });

    };

    const updateEmail = (newEmail: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('email', newEmail);

        // Update the URL without refreshing the page
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        updateEmail(e.target.value)
    }

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setIsLoading(true)
        try {
            const resp = await axios.post(
                url,
                { identifier: email }, // Axios automatically stringifies this
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // If successful (status 200–299)
            if (resp.status >= 200 && resp.status < 300) {
                handleVerificationSuccess()
            }
        } catch (error) {
            console.error('Error during POST request:', error);

            if (axios.isAxiosError(error)) {
                // If backend provided an error message
                const errorMessage =
                    error.response?.data?.message ||
                    `Request failed with status ${error.response?.status || 'Unknown'}`;
                setLocalError(errorMessage);
            } else {
                // Network or unexpected error
                setLocalError('Unable to verify email. Please try again.');
            }

            throw error; // Re-throw for higher-level handling if needed
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleVerifyEmail}>
            {localError && (
                <FormSubmitFeedback msg={localError} />
            )}
            <Field>
                <Label htmlFor="email">Email Address</Label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={handleEmailChange}
                        className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                        placeholder='Enter email address'
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
                        onClick={() => switchAuthMethod('email', 'phone', setEmail)}
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