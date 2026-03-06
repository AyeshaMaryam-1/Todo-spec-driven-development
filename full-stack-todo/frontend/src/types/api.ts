/**
 * API error response structure
 */
export interface ApiError {
  detail: string
  status_code: number
  timestamp: string
}

/**
 * Validation error for form fields
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Client-side error wrapper
 */
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    message?: string
  ) {
    super(message || data.detail)
    this.name = 'ApiClientError'
  }
}

/**
 * Type guard to check if error is ApiClientError
 */
export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

/**
 * Paginated response (for future use)
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  TASK_BY_ID: (id: number) => `/api/tasks/${id}`,
  TASK_TOGGLE: (id: number) => `/api/tasks/${id}/complete`,
  HEALTH: '/health',
} as const

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  TASKS: ['tasks'] as const,
  TASK: (id: number) => ['tasks', id] as const,
  SESSION: ['session'] as const,
} as const

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const
