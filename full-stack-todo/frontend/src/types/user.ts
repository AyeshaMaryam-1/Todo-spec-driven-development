/**
 * User entity representing an authenticated user
 * Managed by Better Auth
 */
export interface User {
  id: number
  email: string
  name?: string
}

/**
 * User session data from Better Auth
 */
export interface Session {
  user: User
  token: string  // JWT token for API authorization
  expiresAt: string  // ISO 8601 timestamp
}

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && !!session.token
}
