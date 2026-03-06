/**
 * API Client Specification for Frontend Application
 *
 * This file defines the TypeScript interfaces and implementation
 * specification for the API client that communicates with the
 * Backend API & Data Persistence service.
 *
 * All API calls must include JWT authentication token in the
 * Authorization header.
 */

import { Task, TaskCreateRequest, TaskUpdateRequest } from '../types'

/**
 * Base API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

/**
 * API client interface
 *
 * Provides type-safe methods for all backend API endpoints
 */
export interface IApiClient {
  // Task operations
  getTasks(): Promise<Task[]>
  getTask(id: number): Promise<Task>
  createTask(data: TaskCreateRequest): Promise<Task>
  updateTask(id: number, data: TaskUpdateRequest): Promise<Task>
  deleteTask(id: number): Promise<void>
  toggleTaskCompletion(id: number): Promise<Task>

  // Health check
  healthCheck(): Promise<{ status: string; database: string; timestamp: string }>
}

/**
 * API Client Implementation Specification
 *
 * The implementation must:
 * 1. Automatically attach JWT token from Better Auth session
 * 2. Handle 401 responses by logging out and redirecting to signin
 * 3. Transform API errors into ApiClientError instances
 * 4. Set appropriate Content-Type headers
 * 5. Parse JSON responses
 * 6. Support request cancellation
 */

/**
 * Example implementation structure:
 *
 * ```typescript
 * export class ApiClient implements IApiClient {
 *   constructor(private config: ApiClientConfig) {}
 *
 *   private async request<T>(
 *     endpoint: string,
 *     options?: RequestInit
 *   ): Promise<T> {
 *     // Get JWT token from Better Auth session
 *     const session = await getSession()
 *     const token = session?.user?.token
 *
 *     // Build request
 *     const url = `${this.config.baseUrl}${endpoint}`
 *     const headers = {
 *       'Content-Type': 'application/json',
 *       ...(token && { Authorization: `Bearer ${token}` }),
 *       ...this.config.headers,
 *       ...options?.headers,
 *     }
 *
 *     // Make request
 *     const response = await fetch(url, {
 *       ...options,
 *       headers,
 *     })
 *
 *     // Handle 401 - Unauthorized
 *     if (response.status === 401) {
 *       await signOut()
 *       redirect('/signin')
 *       throw new ApiClientError(401, { detail: 'Unauthorized', status_code: 401, timestamp: new Date().toISOString() })
 *     }
 *
 *     // Handle other errors
 *     if (!response.ok) {
 *       const errorData = await response.json()
 *       throw new ApiClientError(response.status, errorData)
 *     }
 *
 *     // Handle 204 No Content
 *     if (response.status === 204) {
 *       return undefined as T
 *     }
 *
 *     // Parse JSON response
 *     return response.json()
 *   }
 *
 *   async getTasks(): Promise<Task[]> {
 *     return this.request<Task[]>('/api/tasks')
 *   }
 *
 *   async getTask(id: number): Promise<Task> {
 *     return this.request<Task>(`/api/tasks/${id}`)
 *   }
 *
 *   async createTask(data: TaskCreateRequest): Promise<Task> {
 *     return this.request<Task>('/api/tasks', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     })
 *   }
 *
 *   async updateTask(id: number, data: TaskUpdateRequest): Promise<Task> {
 *     return this.request<Task>(`/api/tasks/${id}`, {
 *       method: 'PUT',
 *       body: JSON.stringify(data),
 *     })
 *   }
 *
 *   async deleteTask(id: number): Promise<void> {
 *     return this.request<void>(`/api/tasks/${id}`, {
 *       method: 'DELETE',
 *     })
 *   }
 *
 *   async toggleTaskCompletion(id: number): Promise<Task> {
 *     return this.request<Task>(`/api/tasks/${id}/complete`, {
 *       method: 'PATCH',
 *     })
 *   }
 *
 *   async healthCheck(): Promise<{ status: string; database: string; timestamp: string }> {
 *     return this.request('/health')
 *   }
 * }
 * ```
 */

/**
 * React Query integration hooks
 *
 * These hooks provide a convenient way to use the API client
 * with React Query for automatic caching, loading states, and
 * error handling.
 */

/**
 * Hook for fetching all tasks
 *
 * ```typescript
 * export function useTasks() {
 *   return useQuery({
 *     queryKey: ['tasks'],
 *     queryFn: () => apiClient.getTasks(),
 *   })
 * }
 * ```
 */

/**
 * Hook for fetching a single task
 *
 * ```typescript
 * export function useTask(id: number) {
 *   return useQuery({
 *     queryKey: ['tasks', id],
 *     queryFn: () => apiClient.getTask(id),
 *     enabled: !!id,
 *   })
 * }
 * ```
 */

/**
 * Hook for creating a task
 *
 * ```typescript
 * export function useCreateTask() {
 *   const queryClient = useQueryClient()
 *
 *   return useMutation({
 *     mutationFn: (data: TaskCreateRequest) => apiClient.createTask(data),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['tasks'] })
 *       toast.success('Task created successfully')
 *     },
 *     onError: (error: ApiClientError) => {
 *       toast.error(error.message)
 *     },
 *   })
 * }
 * ```
 */

/**
 * Hook for updating a task
 *
 * ```typescript
 * export function useUpdateTask() {
 *   const queryClient = useQueryClient()
 *
 *   return useMutation({
 *     mutationFn: ({ id, data }: { id: number; data: TaskUpdateRequest }) =>
 *       apiClient.updateTask(id, data),
 *     onSuccess: (updatedTask) => {
 *       queryClient.invalidateQueries({ queryKey: ['tasks'] })
 *       queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] })
 *       toast.success('Task updated successfully')
 *     },
 *     onError: (error: ApiClientError) => {
 *       toast.error(error.message)
 *     },
 *   })
 * }
 * ```
 */

/**
 * Hook for deleting a task
 *
 * ```typescript
 * export function useDeleteTask() {
 *   const queryClient = useQueryClient()
 *
 *   return useMutation({
 *     mutationFn: (id: number) => apiClient.deleteTask(id),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['tasks'] })
 *       toast.success('Task deleted successfully')
 *     },
 *     onError: (error: ApiClientError) => {
 *       toast.error(error.message)
 *     },
 *   })
 * }
 * ```
 */

/**
 * Hook for toggling task completion
 *
 * ```typescript
 * export function useToggleTask() {
 *   const queryClient = useQueryClient()
 *
 *   return useMutation({
 *     mutationFn: (id: number) => apiClient.toggleTaskCompletion(id),
 *     onMutate: async (id) => {
 *       // Optimistic update
 *       await queryClient.cancelQueries({ queryKey: ['tasks'] })
 *       const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
 *
 *       queryClient.setQueryData<Task[]>(['tasks'], (old) =>
 *         old?.map((task) =>
 *           task.id === id ? { ...task, completed: !task.completed } : task
 *         )
 *       )
 *
 *       return { previousTasks }
 *     },
 *     onError: (error, id, context) => {
 *       // Rollback on error
 *       queryClient.setQueryData(['tasks'], context?.previousTasks)
 *       toast.error(error.message)
 *     },
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['tasks'] })
 *     },
 *   })
 * }
 * ```
 */

/**
 * Error handling specification
 *
 * The API client must handle the following error scenarios:
 *
 * 1. Network errors (no internet, timeout)
 *    - Throw ApiClientError with appropriate message
 *    - Allow retry mechanism
 *
 * 2. 400 Bad Request
 *    - Parse validation errors from response
 *    - Display field-specific error messages
 *
 * 3. 401 Unauthorized
 *    - Clear session
 *    - Redirect to signin page
 *    - Show "Session expired" message
 *
 * 4. 403 Forbidden
 *    - Show "Access denied" message
 *    - Do not redirect (user is authenticated)
 *
 * 5. 404 Not Found
 *    - Show "Resource not found" message
 *    - Allow user to go back or refresh
 *
 * 6. 500 Internal Server Error
 *    - Show "Something went wrong" message
 *    - Provide retry option
 *    - Log error for debugging
 */

/**
 * Request/Response logging (development only)
 *
 * In development mode, log all requests and responses:
 *
 * ```typescript
 * if (process.env.NODE_ENV === 'development') {
 *   console.log('[API Request]', method, url, body)
 *   console.log('[API Response]', status, data)
 * }
 * ```
 */

/**
 * Request cancellation
 *
 * Support AbortController for request cancellation:
 *
 * ```typescript
 * const controller = new AbortController()
 *
 * const request = apiClient.getTasks({ signal: controller.signal })
 *
 * // Cancel request
 * controller.abort()
 * ```
 */

/**
 * Retry logic
 *
 * React Query provides built-in retry logic:
 *
 * ```typescript
 * useQuery({
 *   queryKey: ['tasks'],
 *   queryFn: () => apiClient.getTasks(),
 *   retry: 3,
 *   retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
 * })
 * ```
 */

/**
 * Type exports
 */
export type { ApiClientConfig, IApiClient }
