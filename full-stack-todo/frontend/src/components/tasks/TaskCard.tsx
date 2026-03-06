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
        'card p-5 group',
        task.completed && 'opacity-75'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <div
            className={cn(
              'h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              task.completed
                ? 'border-emerald-500 bg-emerald-500 shadow-md'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
            )}
          >
            {task.completed && (
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'text-base font-semibold transition-all duration-200',
                  task.completed 
                    ? 'text-gray-500 dark:text-gray-500 line-through' 
                    : 'text-gray-900 dark:text-gray-100'
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  'mt-1.5 text-sm leading-relaxed',
                  task.completed 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : 'text-gray-600 dark:text-gray-400'
                )}>
                  {task.description}
                </p>
              )}
            </div>
            
            {/* Status Badge */}
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
              task.completed
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            )}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created {formatRelativeTime(task.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit task"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete task"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
