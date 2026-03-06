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

/**
 * Omit timestamps from Task for form data
 */
export type TaskFormData = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>

/**
 * Partial task for optimistic updates
 */
export type PartialTask = Partial<Task> & Pick<Task, 'id'>

/**
 * Type guard to check if task is completed
 */
export function isTaskCompleted(task: Task): boolean {
  return task.completed === true
}
