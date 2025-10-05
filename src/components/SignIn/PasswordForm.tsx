import { HTMLInputTypeAttribute, useActionState, useState } from 'react';

import { authenticate } from '@/lib/actions';
import { Button } from '@/components/UIKit/Button'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const PasswordForm = (props: { credential: string }) => {
    const searchParams = useSearchParams()
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    const [inputType, setInputType] = useState<HTMLInputTypeAttribute | undefined>('password')


    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';


    return (
        <form className="space-y-6" action={formAction}>
            <input type="hidden" name="email" value={props.credential} />
            <Field>
                <Label htmlFor="password">Password</Label>
                <div className="mt-2 grid grid-cols-1">
                    <input
                        id="password"
                        name="password"
                        type={inputType}
                        autoFocus
                        required
                        className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
                    />
                    {inputType === 'password' ? (
                        <button
                            type='button'
                            onClick={() => setInputType('text')}
                            className='cursor-pointer self-center justify-self-end col-start-1 row-start-1 mr-3'>
                            <EyeSlashIcon
                                aria-hidden="true"
                                className=" size-5  text-gray-400 sm:size-4"
                            />
                        </button>
                    ) : (
                        <button
                            type='button'
                            onClick={() => setInputType('password')}
                            className='cursor-pointer self-center justify-self-end col-start-1 row-start-1 mr-3'>
                            <EyeIcon
                                aria-hidden="true"
                                className=" size-5  text-gray-400 sm:size-4"
                            />
                        </button>
                    )}

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

export default PasswordForm