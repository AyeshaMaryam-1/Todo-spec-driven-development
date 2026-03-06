import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskCreateSchema, taskUpdateSchema, TaskCreateFormData, TaskUpdateFormData } from '@/types'
import { cn } from '@/lib/utils'

type TaskFormProps =
  | {
      mode: 'create'
      initialData?: never
      onSubmit: (data: TaskCreateFormData) => void | Promise<void>
      onCancel: () => void
      isLoading: boolean
    }
  | {
      mode: 'edit'
      initialData?: TaskUpdateFormData
      onSubmit: (data: TaskUpdateFormData) => void | Promise<void>
      onCancel: () => void
      isLoading: boolean
    }

/**
 * TaskForm Component
 * Modern form for creating or editing tasks with improved styling
 */
export function TaskForm(props: TaskFormProps) {
  if (props.mode === 'create') {
    return <CreateTaskForm onSubmit={props.onSubmit} onCancel={props.onCancel} isLoading={props.isLoading} />
  }
  return <EditTaskForm initialData={props.initialData} onSubmit={props.onSubmit} onCancel={props.onCancel} isLoading={props.isLoading} />
}

function CreateTaskForm({
  onSubmit,
  onCancel,
  isLoading
}: {
  onSubmit: (data: TaskCreateFormData) => void | Promise<void>
  onCancel: () => void
  isLoading: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateFormData>({
    resolver: zodResolver(taskCreateSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          id="title"
          type="text"
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200',
            errors.title && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200 resize-none',
            errors.description && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'btn-primary',
            isLoading && 'cursor-not-allowed opacity-75'
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function EditTaskForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}: {
  initialData?: TaskUpdateFormData
  onSubmit: (data: TaskUpdateFormData) => void | Promise<void>
  onCancel: () => void
  isLoading: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskUpdateFormData>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          id="title"
          type="text"
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200',
            errors.title && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200 resize-none',
            errors.description && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'btn-primary',
            isLoading && 'cursor-not-allowed opacity-75'
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}
