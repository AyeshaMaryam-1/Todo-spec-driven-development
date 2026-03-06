'use client';

import { useAuthState } from '@/lib/hooks/useAuthState';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Navigation component that renders different items based on authentication status
 */
export function AuthAwareNav() {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 rounded-md w-20 h-8"></div>
        <div className="animate-pulse bg-gray-200 rounded-md w-20 h-8"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <Link
            href="/dashboard"
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              'text-gray-700 hover:text-blue-600 hover:bg-gray-100',
              'transition-transform duration-200 hover:scale-105'
            )}
          >
            Dashboard
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Using the existing signOut function from auth
              import('@/lib/auth').then(({ auth }) => {
                auth.signOut();
              });
            }}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              'text-gray-700 hover:text-red-600 hover:bg-gray-100',
              'transition-transform duration-200 hover:scale-105'
            )}
          >
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/signin"
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              'text-gray-700 hover:bg-gray-100',
              'transition-transform duration-200 hover:scale-105'
            )}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              'bg-blue-600 text-white hover:bg-blue-700',
              'transition-transform duration-200 hover:scale-105'
            )}
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}