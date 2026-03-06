'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, signinSchema, SignupFormData, SigninFormData } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AuthFormProps {
  mode: 'signup' | 'signin'
  onSubmit: (data: SignupFormData | SigninFormData) => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * AuthForm Component
 * Modern authentication form with improved styling
 */
export function AuthForm({ mode, onSubmit, isLoading, error }: AuthFormProps) {
  if (mode === 'signup') {
    return <SignupFormContent onSubmit={onSubmit} isLoading={isLoading} error={error} />
  }
  return <SigninFormContent onSubmit={onSubmit} isLoading={isLoading} error={error} />
}

function SignupFormContent({
  onSubmit,
  isLoading,
  error
}: {
  onSubmit: (data: SignupFormData) => Promise<void>
  isLoading: boolean
  error: string | null
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
          >
            <div className="flex">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              autoComplete="name"
              className={cn(
                'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'text-gray-900 dark:text-gray-100',
                'transition-all duration-200',
                errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              required
              className={cn(
                'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'text-gray-900 dark:text-gray-100',
                'transition-all duration-200',
                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className={cn(
                'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'text-gray-900 dark:text-gray-100',
                'transition-all duration-200',
                errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="At least 8 characters"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full btn-primary justify-center',
            isLoading && 'cursor-not-allowed opacity-75'
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Sign up
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}

function SigninFormContent({
  onSubmit,
  isLoading,
  error
}: {
  onSubmit: (data: SigninFormData) => Promise<void>
  isLoading: boolean
  error: string | null
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  })

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
          >
            <div className="flex">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              required
              className={cn(
                'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'text-gray-900 dark:text-gray-100',
                'transition-all duration-200',
                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={cn(
                'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'text-gray-900 dark:text-gray-100',
                'transition-all duration-200',
                errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
              placeholder="Your password"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full btn-primary justify-center',
            isLoading && 'cursor-not-allowed opacity-75'
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
