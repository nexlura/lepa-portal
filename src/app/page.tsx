'use client'

import { SetStateAction, Dispatch, useState } from 'react'

import { WordmarkLogo } from '@/components/Logo'
import EmailForm from '@/components/SignIn/EmailForm'
import PhoneForm from '@/components/SignIn/PhoneForm';

export interface SignInFormProps {
  showPassword: boolean
  setAuthMethod: Dispatch<SetStateAction<"email" | "phone">>
  setShowPassword: Dispatch<SetStateAction<boolean>>
}

export default function AuthPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)


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
        <p className="mt-2 text-center text-sm text-gray-600">
          {showPassword ? 'Enter your password to continue signing in.' : 'Fast, secure, and hassle-free admissions.'}
        </p>

      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          {authMethod === 'phone' ? (
            <PhoneForm
              setAuthMethod={setAuthMethod}
              setShowPassword={setShowPassword}
              showPassword={showPassword} />
          ) : (
            <EmailForm
              setAuthMethod={setAuthMethod}
              setShowPassword={setShowPassword}
              showPassword={showPassword} />
          )}

          {/* Additional Info */}
          <div className="mt-6">

          </div>
        </div>
      </div>
    </div>
  )
}
