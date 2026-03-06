# Architectural Research & Decisions: Frontend Application

**Feature**: Frontend Application & User Experience
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document captures architectural decisions made during the planning phase for the Next.js 16+ frontend application with Better Auth integration and JWT-based API communication.

## Decision 1: Route Protection Strategy

**Context**: Need to protect dashboard and other authenticated routes from unauthenticated access while allowing public access to signin/signup pages.

**Options Considered**:
1. **Next.js Middleware** - Global middleware that runs before every request
2. **Layout-based guards** - Protection logic in layout components
3. **Page-level guards** - Protection logic in each page component

**Decision**: Use **Layout-based guards with route groups**

**Rationale**:
- Next.js App Router route groups `(auth)` and `(protected)` provide clear separation
- Layout components can check auth state and redirect before rendering children
- More explicit and easier to understand than middleware
- Better TypeScript support and easier to test
- Middleware in App Router has limitations with redirects and session access

**Implementation**:
- Create `app/(protected)/layout.tsx` that checks auth state
- Redirect to `/signin` if not authenticated
- Create `app/(auth)/layout.tsx` that redirects authenticated users to `/dashboard`

**Trade-offs**:
- Slightly more code duplication than middleware
- But more maintainable and testable
- Better error handling and user feedback

---

## Decision 2: JWT Token Access from Better Auth

**Context**: Need to extract JWT token from Better Auth session and attach it to API requests.

**Options Considered**:
1. **Better Auth session hook** - Use `useSession()` hook to get token
2. **Cookie-based extraction** - Read JWT from cookies directly
3. **Local storage** - Store JWT in localStorage after auth

**Decision**: Use **Better Auth session hook with server-side session access**

**Rationale**:
- Better Auth provides `auth()` function for server components and `useSession()` for client components
- Tokens are securely managed by Better Auth
- Automatic token refresh handled by Better Auth
- No manual cookie parsing or localStorage management
- Type-safe access to session data

**Implementation**:
```typescript
// Server components
import { auth } from '@/lib/auth'
const session = await auth()
const token = session?.user?.token

// Client components
import { useSession } from '@/lib/auth'
const { data: session } = useSession()
const token = session?.user?.token
```

**Trade-offs**:
- Depends on Better Auth configuration
- Requires Better Auth to include token in session
- But provides secure, managed token lifecycle

---

## Decision 3: API Client Design

**Context**: Need a consistent way to make API requests with JWT authentication and error handling.

**Options Considered**:
1. **Direct fetch calls** - Use native fetch in each component
2. **Axios wrapper** - Create axios instance with interceptors
3. **Custom fetch wrapper** - Lightweight abstraction over fetch
4. **React Query/SWR** - Data fetching library with caching

**Decision**: Use **Custom fetch wrapper + React Query for data fetching**

**Rationale**:
- Custom fetch wrapper provides:
  - Automatic JWT token injection
  - Centralized error handling
  - Request/response interceptors
  - TypeScript type safety
- React Query provides:
  - Automatic caching and revalidation
  - Loading and error states
  - Optimistic updates
  - Request deduplication
- Lightweight solution without heavy dependencies
- Better than axios for modern browsers
- React Query handles the complex state management

**Implementation**:
```typescript
// lib/api-client.ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const session = await getSession()
  const token = session?.user?.token

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (response.status === 401) {
    // Logout and redirect
    await signOut()
    redirect('/signin')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await response.json())
  }

  return response.json()
}
```

**Trade-offs**:
- Adds React Query dependency
- But significantly simplifies data fetching and state management
- Better user experience with caching and optimistic updates

---

## Decision 4: State Management Approach

**Context**: Need to manage task list state, loading states, and error states across components.

**Options Considered**:
1. **React Context** - Global context for tasks
2. **Redux/Zustand** - Global state management library
3. **React Query** - Server state management
4. **Local component state** - useState in each component

**Decision**: Use **React Query for server state + local state for UI state**

**Rationale**:
- Tasks are server state (fetched from API) - React Query handles this perfectly
- UI state (modals, forms) stays local with useState
- No need for Redux/Zustand complexity
- React Query provides:
  - Automatic background refetching
  - Cache invalidation
  - Optimistic updates
  - Loading/error states
- Simpler mental model: server state vs UI state

**Implementation**:
```typescript
// Server state with React Query
const { data: tasks, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => apiClient<Task[]>('/api/tasks'),
})

// UI state with local state
const [isModalOpen, setIsModalOpen] = useState(false)
```

**Trade-offs**:
- Requires learning React Query patterns
- But eliminates manual state synchronization
- Better performance with automatic caching

---

## Decision 5: Error Handling Strategy

**Context**: Need consistent error handling for API failures, validation errors, and network issues.

**Options Considered**:
1. **Try-catch in each component** - Manual error handling
2. **Error boundaries** - React error boundaries for component errors
3. **Centralized error handler** - Global error handling service
4. **React Query error handling** - Built-in error states

**Decision**: Use **Multi-layer error handling**:
- API client for HTTP errors
- React Query for data fetching errors
- Error boundaries for component errors
- Toast notifications for user feedback

**Rationale**:
- Different error types need different handling
- API client catches and transforms HTTP errors
- React Query provides error states for UI
- Error boundaries catch unexpected component errors
- Toast notifications provide non-intrusive user feedback

**Implementation**:
```typescript
// API client throws typed errors
class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(`API Error: ${status}`)
  }
}

// React Query handles errors
const { error } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  onError: (error) => {
    toast.error(error.message)
  },
})

// Error boundary for unexpected errors
<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>
```

**Trade-offs**:
- More complex error handling setup
- But provides better user experience
- Clear error messages at each layer

---

## Decision 6: Styling Approach

**Context**: Need a styling solution that supports responsive design, component reusability, and fast development.

**Options Considered**:
1. **CSS Modules** - Scoped CSS files
2. **Tailwind CSS** - Utility-first CSS framework
3. **Styled Components** - CSS-in-JS
4. **Plain CSS** - Global stylesheets

**Decision**: Use **Tailwind CSS**

**Rationale**:
- Utility-first approach speeds up development
- Built-in responsive design utilities
- No CSS naming conflicts
- Excellent TypeScript support
- Small bundle size with purging
- Easy to maintain consistent design system
- Mobile-first by default
- Works well with Next.js

**Implementation**:
```typescript
// Component with Tailwind classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
  Create Task
</button>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {tasks.map(task => <TaskCard key={task.id} task={task} />)}
</div>
```

**Trade-offs**:
- Learning curve for utility classes
- But faster development once learned
- Better consistency across components

---

## Decision 7: Form Handling Approach

**Context**: Need form validation, error display, and submission handling for signup, signin, and task forms.

**Options Considered**:
1. **React Hook Form** - Lightweight form library
2. **Formik** - Popular form library
3. **Manual state management** - useState for each field
4. **Native HTML5 validation** - Browser validation only

**Decision**: Use **React Hook Form + Zod validation**

**Rationale**:
- React Hook Form is lightweight and performant
- Uncontrolled inputs reduce re-renders
- Zod provides TypeScript-first schema validation
- Excellent TypeScript support
- Easy integration with React Query mutations
- Built-in error handling
- Supports async validation

**Implementation**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(taskSchema),
})
```

**Trade-offs**:
- Adds two dependencies (react-hook-form, zod)
- But significantly simplifies form handling
- Better validation and error messages

---

## Technology Stack Summary

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Framework | Next.js | 16+ | App Router, RSC, built-in optimization |
| Language | TypeScript | 5.x | Type safety, better DX |
| Auth | Better Auth | Latest | JWT support, session management |
| Data Fetching | React Query | 5.x | Server state management, caching |
| Styling | Tailwind CSS | 3.x | Utility-first, responsive, fast |
| Forms | React Hook Form | 7.x | Performance, validation |
| Validation | Zod | 3.x | TypeScript-first schemas |
| HTTP Client | Native Fetch | - | Modern, no extra dependency |
| UI Feedback | React Hot Toast | Latest | Non-intrusive notifications |

---

## Integration Points

### Backend API Integration

**Endpoint Base URL**: `http://localhost:8000` (configurable via env)

**Authentication Flow**:
1. User signs up/signs in via Better Auth
2. Better Auth creates session with JWT token
3. Frontend extracts token from session
4. Token attached to all API requests via Authorization header
5. Backend validates token and returns user-specific data

**API Endpoints** (from Backend API spec):
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/{id}` - Get task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle completion

**Error Handling**:
- 401 Unauthorized → Logout and redirect to signin
- 403 Forbidden → Show error message
- 404 Not Found → Show error message
- 500 Server Error → Show error message with retry

---

## Performance Considerations

1. **Code Splitting**: Next.js automatic code splitting per route
2. **Image Optimization**: Next.js Image component for optimized images
3. **Lazy Loading**: React.lazy for non-critical components
4. **Caching**: React Query caching for API responses
5. **Optimistic Updates**: Update UI before API confirmation
6. **Debouncing**: Debounce search/filter inputs
7. **Memoization**: useMemo/useCallback for expensive computations

---

## Security Considerations

1. **JWT Storage**: Managed by Better Auth (secure httpOnly cookies)
2. **XSS Prevention**: React escapes content by default
3. **CSRF Protection**: Not needed for JWT-based auth
4. **Input Validation**: Client-side (Zod) + server-side validation
5. **HTTPS**: Required in production
6. **Environment Variables**: Sensitive data in .env.local (not committed)

---

## Development Workflow

1. **Local Development**:
   - Run `npm run dev` for Next.js dev server
   - Backend API must be running on localhost:8000
   - Better Auth configured with local credentials

2. **Testing**:
   - Unit tests: Jest + React Testing Library
   - Integration tests: Test API client and data fetching
   - E2E tests: Playwright for full user flows

3. **Build**:
   - `npm run build` for production build
   - Static optimization where possible
   - Environment-specific configuration

---

## Open Questions & Future Considerations

1. **Offline Support**: Not in scope, but could add service workers later
2. **Real-time Updates**: Not in scope, but could add WebSocket support later
3. **Advanced Accessibility**: Basic semantic HTML provided, could enhance with ARIA
4. **Internationalization**: Not in scope, but Tailwind + i18n library could be added
5. **Analytics**: Not in scope, but could add Google Analytics or similar

---

## References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
