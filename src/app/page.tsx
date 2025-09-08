'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/UIKit/Button'
import { Input } from '@/components/UIKit/Input'
import { Field, Label } from '@/components/UIKit/Fieldset'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function AuthPage() {
  const router = useRouter()
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Phone authentication:', phoneNumber)
      setIsLoading(false)
      // Redirect to dashboard or next step
      router.push('/admin')
    }, 1000)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Email authentication:', email)
      setIsLoading(false)
      // Redirect to dashboard or next step
      router.push('/admin')
    }, 1000)
  }

  const switchToEmail = () => {
    setAuthMethod('email')
    setPhoneNumber('')
  }

  const switchToPhone = () => {
    setAuthMethod('phone')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lepa</h1>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          {authMethod === 'phone' ? (
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
          ) : (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <Field>
                <Label htmlFor="email">Email Address</Label>
                <div className="mt-2 grid grid-cols-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoFocus
                    className="col-start-1 row-start-1 block w-full rounded-md py-3 pr-3 pl-4 text-base text-gray-900 outline-1 -outline-offset-1 outline-zinc-950/20 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-800 sm:text-sm/6"
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
                    onClick={switchToPhone}
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Continue with Phone
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Additional Info */}
          <div className="mt-6">

          </div>
        </div>
      </div>
    </div>
  )
}
