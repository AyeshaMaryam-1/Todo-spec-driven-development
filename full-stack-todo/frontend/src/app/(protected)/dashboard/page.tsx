'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask } from '@/lib/hooks/useTasks'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { Task, TaskCreateFormData, TaskUpdateFormData } from '@/types'
import { motion } from 'framer-motion'

/**
 * Dashboard Page
 * Main page for authenticated users to manage their tasks
 */
export default function DashboardPage() {
  const { signout } = useAuth()
  const { data: tasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const toggleTask = useToggleTask()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleCreateTask = async (data: TaskCreateFormData) => {
    await createTask.mutateAsync(data)
    setIsCreateModalOpen(false)
  }

  const handleEditTask = async (data: TaskUpdateFormData) => {
    if (!selectedTask) return
    await updateTask.mutateAsync({ id: selectedTask.id, data })
    setIsEditModalOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    await deleteTask.mutateAsync(selectedTask.id)
    setIsDeleteModalOpen(false)
    setSelectedTask(null)
  }

  const handleToggleTask = (taskId: number) => {
    toggleTask.mutate(taskId)
  }

  const openEditModal = (task: Task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setIsDeleteModalOpen(true)
    }
  }

  // Calculate task statistics
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = tasks.filter((t) => !t.completed).length
  const totalTasks = tasks.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                My Tasks
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage and track your daily tasks
              </p>
            </div>
            <button
              onClick={signout}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              className="card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalTasks}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingTasks}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedTasks}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task List</h2>
            {totalTasks > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {completedTasks}/{totalTasks} done
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onToggle={handleToggleTask}
          />
        </motion.div>
      </main>

      {/* Create task modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          mode="create"
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createTask.isPending}
        />
      </Modal>

      {/* Edit task modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedTask(null)
        }}
        title="Edit Task"
      >
        <TaskForm
          mode="edit"
          initialData={
            selectedTask
              ? {
                  title: selectedTask.title,
                  description: selectedTask.description || undefined,
                }
              : undefined
          }
          onSubmit={handleEditTask}
          onCancel={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          isLoading={updateTask.isPending}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTask(null)
        }}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete &quot;{selectedTask?.title}&quot;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSelectedTask(null)
              }}
              disabled={deleteTask.isPending}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTask}
              disabled={deleteTask.isPending}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
