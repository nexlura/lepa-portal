'use client'

import { SetStateAction, Dispatch, useState } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { postModel } from '@/lib/connector'
import FormSubmitFeedback from '../FormAlert'

interface PhoneFormProps {
    phoneNumber: string
    setPhoneNumber: Dispatch<SetStateAction<string>>
}

const PhoneForm = ({
    phoneNumber,
    setPhoneNumber

}: PhoneFormProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [localError, setLocalError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const urlEndpoint = 'auth/verify-email'

    const handleVerifyPhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setIsLoading(true)
        try {
            const resp = await postModel<{ exists: boolean } | string>(`${urlEndpoint}`, { phoneNumber })

            if (typeof resp === 'string') {
                setLocalError(resp)
            } else if (resp?.exists) {
                setPhoneNumber(`232${phoneNumber}`)
                // setShowPassword(true)
            } else {
                setLocalError('No account found for this email.')
            }
        } catch (err) {
            setLocalError('Unable to verify email. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const switchToEmail = () => {
        const params = new URLSearchParams(searchParams);

        // Remove the 'phoneam completely
        params.delete('phone');
        // Add the new 'email' param
        params.set('email', '')

        setPhoneNumber('');

        // Update the URL (replace instead of push if you don't want history)
        router.replace(`${pathname}?${params.toString()}`);
    };



    return (
        <form className="space-y-6" onSubmit={handleVerifyPhone}>
            {localError && (
                <FormSubmitFeedback msg={localError} />
            )}
            <Field>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={phoneNumber}
                        autoFocus
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