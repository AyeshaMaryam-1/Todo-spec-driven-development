import { Task } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onToggle: (taskId: number) => void
}

/**
 * TaskCard Component
 * Displays a single task with modern card design and animations
 */
export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-4',
        task.completed && 'opacity-75'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Checkbox + Task content */}
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className="mt-1 flex-shrink-0"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <div
              className={cn(
                'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                task.completed
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}
            >
              {task.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-base font-semibold',
                task.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900 dark:text-gray-100'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                'mt-1 text-sm',
                task.completed
                  ? 'text-gray-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}>
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span>Created {formatRelativeTime(task.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status Badge */}
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            task.completed
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          )}>
            {task.completed ? 'Done' : 'Pending'}
          </span>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Edit task"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
