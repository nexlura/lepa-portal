'use client'

import { SetStateAction, Dispatch, useState } from 'react'

import { WordmarkLogo } from '@/components/Logo'
import EmailForm from '@/components/SignIn/EmailForm'
import PhoneForm from '@/components/SignIn/PhoneForm';
import { formatPhoneNumber } from '@/utils';
import FormAlert from '@/components/FormAlert';

export interface SignInFormProps {
  showPassword: boolean
  setAuthMethod: Dispatch<SetStateAction<"email" | "phone">>
  setShowPassword: Dispatch<SetStateAction<boolean>>
}

export default function AuthPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="absolute top-6 sm:top-8 left-5 sm:left-16">
          <div className=" flex items-center">
            <WordmarkLogo />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
          {authMethod === 'phone' ? 'Sign in with phone' : 'Sign in with email'}
        </h2>
        {showPassword ? (
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter password for <span className='text-primary-700'>
              {email || formatPhoneNumber(phoneNumber)}
            </span> to sign in.
          </p>
        ) : (
          <p className="mt-2 text-center text-sm text-gray-600">
            Fast, secure, and hassle-free admissions.
          </p>
        )}
      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          {authMethod === 'phone' ? (
            <PhoneForm
              showPassword={showPassword}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              setAuthMethod={setAuthMethod}
              setShowPassword={setShowPassword}
            />
          ) : (
            <EmailForm
              email={email}
              showPassword={showPassword}
              setEmail={setEmail}
              setAuthMethod={setAuthMethod}
              setShowPassword={setShowPassword}
            />
          )}

          {/* Additional Info */}
          <div className="mt-6">

          </div>
        </div>
      </div>
    </div>
  )
}
