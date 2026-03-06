'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Signup Page
 * Allows new users to create an account
 */
export default function SignupPage() {
  const { signup, isLoading, error } = useAuth()

  return (
    <AuthForm
      mode="signup"
      onSubmit={signup}
      isLoading={isLoading}
      error={error}
    />
  )
}
