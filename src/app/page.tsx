'use client'

import { useState } from 'react'
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

import { WordmarkLogo } from '@/components/Logo'
import PhoneForm from '@/components/PhoneForm'
import EmailForm from '@/components/EmailForm'

export default function AuthPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const switchToEmail = () => {
    setAuthMethod('email')
    setPhoneNumber('')
  }

  const switchToPhone = () => {
    setAuthMethod('phone')
    setEmail('')
  }

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

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
          Fast, secure, and hassle-free admissions.
        </p>

      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          {authMethod === 'phone' ? (
            <PhoneForm
              isLoading={isLoading}
              phoneNumber={phoneNumber}
              setIsLoading={setIsLoading}
              setPhoneNumber={setPhoneNumber}
              switchToEmail={switchToEmail}
            />
          ) : (
            <EmailForm
              email={email}
              isPending={isPending}
              setEmail={setEmail}
              switchToPhone={switchToPhone}
              formAction={formAction}
              errorMessage={errorMessage}
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
