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
