# Frontend Data Model: Frontend Application & User Experience

**Feature**: Frontend Application & User Experience
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document defines the TypeScript data structures used in the Next.js frontend application. These types ensure type safety across components, API calls, and state management.

## Core Entities

### User

Represents an authenticated user in the application.

```typescript
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
```

**Fields**:
- `id`: Unique user identifier (matches backend user_id)
- `email`: User's email address (used for signin)
- `name`: Optional display name
- `token`: JWT token for API requests
- `expiresAt`: Session expiration timestamp

**Validation Rules**:
- Email must be valid RFC 5322 format
- Token must be present for authenticated sessions
- ID must match backend user_id in JWT payload

---

### Task

Represents a todo item belonging to a user.

```typescript
/**
 * Task entity representing a todo item
 */
export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  user_id: number
  created_at: string  // ISO 8601 timestamp
  updated_at: string  // ISO 8601 timestamp
}
```

**Fields**:
- `id`: Unique task identifier
- `title`: Task title (required, 1-255 characters)
- `description`: Optional task description
- `completed`: Completion status (true/false)
- `user_id`: Owner's user ID (for reference)
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp

**Validation Rules**:
- Title: Required, non-empty, max 255 characters
- Description: Optional, can be null or empty string
- Completed: Boolean, defaults to false
- Timestamps: ISO 8601 format

**State Transitions**:
- New task: `completed = false`
- Toggle completion: `completed = !completed`
- Update: `updated_at` changes to current time

---

## API Request/Response Types

### Task Operations

```typescript
/**
 * Request body for creating a new task
 */
export interface TaskCreateRequest {
  title: string
  description?: string
}

/**
 * Request body for updating an existing task
 */
export interface TaskUpdateRequest {
  title?: string
  description?: string
  completed?: boolean
}

/**
 * Response from task creation (201)
 */
export type TaskCreateResponse = Task

/**
 * Response from task update (200)
 */
export type TaskUpdateResponse = Task

/**
 * Response from task list (200)
 */
export type TaskListResponse = Task[]

/**
 * Response from get task by ID (200)
 */
export type TaskGetResponse = Task

/**
 * Response from toggle completion (200)
 */
export type TaskToggleResponse = Task

/**
 * Response from delete task (204)
 */
export type TaskDeleteResponse = void
```

---

### Authentication Operations

```typescript
/**
 * Request body for user signup
 */
export interface SignupRequest {
  email: string
  password: string
  name?: string
}

/**
 * Request body for user signin
 */
export interface SigninRequest {
  email: string
  password: string
}

/**
 * Response from successful authentication
 * Managed by Better Auth
 */
export interface AuthResponse {
  user: User
  session: Session
}
```

---

## Error Types

```typescript
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
```

**Error Status Codes**:
- `400`: Bad Request - Validation error
- `401`: Unauthorized - Missing or invalid JWT
- `403`: Forbidden - User doesn't own resource
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Backend error

---

## Form Validation Schemas

Using Zod for runtime validation:

```typescript
import { z } from 'zod'

/**
 * Signup form validation schema
 */
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Signin form validation schema
 */
export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SigninFormData = z.infer<typeof signinSchema>

/**
 * Task creation form validation schema
 */
export const taskCreateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z.string().optional(),
})

export type TaskCreateFormData = z.infer<typeof taskCreateSchema>

/**
 * Task update form validation schema
 */
export const taskUpdateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>
```

---

## UI State Types

```typescript
/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * UI state for task operations
 */
export interface TaskUIState {
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isToggling: boolean
  error: string | null
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'delete' | null
  taskId: number | null
}

/**
 * Toast notification
 */
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}
```

---

## React Query Types

```typescript
import { UseQueryResult, UseMutationResult } from '@tanstack/react-query'

/**
 * Query result for task list
 */
export type TaskListQuery = UseQueryResult<Task[], ApiClientError>

/**
 * Query result for single task
 */
export type TaskQuery = UseQueryResult<Task, ApiClientError>

/**
 * Mutation for creating task
 */
export type TaskCreateMutation = UseMutationResult<
  Task,
  ApiClientError,
  TaskCreateRequest
>

/**
 * Mutation for updating task
 */
export type TaskUpdateMutation = UseMutationResult<
  Task,
  ApiClientError,
  { id: number; data: TaskUpdateRequest }
>

/**
 * Mutation for deleting task
 */
export type TaskDeleteMutation = UseMutationResult<
  void,
  ApiClientError,
  number
>

/**
 * Mutation for toggling task completion
 */
export type TaskToggleMutation = UseMutationResult<
  Task,
  ApiClientError,
  number
>
```

---

## Component Props Types

```typescript
/**
 * Props for TaskCard component
 */
export interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onToggle: (taskId: number) => void
}

/**
 * Props for TaskForm component
 */
export interface TaskFormProps {
  mode: 'create' | 'edit'
  initialData?: TaskUpdateFormData
  onSubmit: (data: TaskCreateFormData | TaskUpdateFormData) => void
  onCancel: () => void
  isLoading: boolean
}

/**
 * Props for TaskList component
 */
export interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  error: ApiClientError | null
  onCreateTask: () => void
}

/**
 * Props for AuthForm component
 */
export interface AuthFormProps {
  mode: 'signup' | 'signin'
  onSubmit: (data: SignupFormData | SigninFormData) => void
  isLoading: boolean
  error: string | null
}
```

---

## Type Guards

```typescript
/**
 * Type guard to check if error is ApiClientError
 */
export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && !!session.token
}

/**
 * Type guard to check if task is completed
 */
export function isTaskCompleted(task: Task): boolean {
  return task.completed === true
}
```

---

## Utility Types

```typescript
/**
 * Omit timestamps from Task for form data
 */
export type TaskFormData = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>

/**
 * Partial task for optimistic updates
 */
export type PartialTask = Partial<Task> & Pick<Task, 'id'>

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
```

---

## Constants

```typescript
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
```

---

## Type Exports

All types should be exported from a central `types/index.ts` file:

```typescript
// types/index.ts
export * from './task'
export * from './user'
export * from './api'
export * from './form'
export * from './ui'
```

---

## Relationship Diagram

```
User (Better Auth)
  ↓ has many
Task (Backend API)
  ↓ displayed in
TaskList (Frontend Component)
  ↓ contains
TaskCard (Frontend Component)
  ↓ triggers
TaskForm (Frontend Component)
  ↓ submits to
API Client (with JWT)
  ↓ calls
Backend API
```

---

## Data Flow

1. **Authentication Flow**:
   ```
   User → SignupForm → Better Auth → Session (with JWT) → Dashboard
   ```

2. **Task Creation Flow**:
   ```
   User → TaskForm → Validation (Zod) → API Client (+ JWT) → Backend → Task → UI Update
   ```

3. **Task List Flow**:
   ```
   Dashboard → React Query → API Client (+ JWT) → Backend → Task[] → TaskList → TaskCard[]
   ```

4. **Error Flow**:
   ```
   API Error → ApiClientError → React Query Error → UI Error Display → Toast Notification
   ```

---

## Notes

- All timestamps use ISO 8601 format for consistency
- TypeScript strict mode enabled for maximum type safety
- Zod schemas provide runtime validation matching TypeScript types
- React Query handles all server state (tasks, session)
- Local state (useState) handles UI state (modals, forms)
- Type guards provide runtime type checking where needed
