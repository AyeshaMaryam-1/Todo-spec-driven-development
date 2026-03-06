import { Task } from './task'
import { ApiClientError } from './api'
import { SignupFormData, SigninFormData, TaskCreateFormData, TaskUpdateFormData } from './form'

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
