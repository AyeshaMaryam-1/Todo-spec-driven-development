'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/lib/hooks/useAuth'

/**
 * Signin Page
 * Allows existing users to sign in
 */
export default function SigninPage() {
  const { signin, isLoading, error } = useAuth()

  return (
    <AuthForm
      mode="signin"
      onSubmit={signin}
      isLoading={isLoading}
      error={error}
    />
  )
}
