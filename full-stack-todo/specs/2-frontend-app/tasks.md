# Tasks: Frontend Application & User Experience

**Input**: Design documents from `/specs/2-frontend-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend structure**: `frontend/src/`, `frontend/public/`
- All paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create frontend directory structure per plan.md (frontend/src/app/, frontend/src/components/, frontend/src/lib/, frontend/src/types/, frontend/src/styles/, frontend/public/)
- [ ] T002 Initialize Next.js 16+ project with TypeScript in frontend/ directory
- [ ] T003 Create package.json with dependencies (Next.js 16+, React 18+, TypeScript 5.x, Better Auth, React Query 5.x, Tailwind CSS 3.x, React Hook Form 7.x, Zod 3.x, React Hot Toast)
- [ ] T004 [P] Create tsconfig.json with strict mode and path aliases
- [ ] T005 [P] Create next.config.js with App Router configuration
- [ ] T006 [P] Initialize Tailwind CSS with tailwind.config.js and postcss.config.js
- [ ] T007 [P] Create .env.local.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
- [ ] T008 [P] Create frontend/README.md with setup instructions
- [ ] T009 [P] Create .gitignore for Next.js project (node_modules/, .next/, .env.local, etc.)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create TypeScript type definitions in frontend/src/types/user.ts (User, Session interfaces)
- [ ] T011 Create TypeScript type definitions in frontend/src/types/task.ts (Task, TaskCreateRequest, TaskUpdateRequest interfaces)
- [ ] T012 Create TypeScript type definitions in frontend/src/types/api.ts (ApiError, ApiClientError class)
- [ ] T013 Create form validation schemas in frontend/src/types/form.ts using Zod (signupSchema, signinSchema, taskCreateSchema, taskUpdateSchema)
- [ ] T014 Create API client in frontend/src/lib/api-client.ts with JWT injection and error handling
- [ ] T015 Create Better Auth configuration in frontend/src/lib/auth.ts with JWT support
- [ ] T016 Create utility functions in frontend/src/lib/utils.ts (cn for className merging, formatDate, etc.)
- [ ] T017 Create React Query provider in frontend/src/lib/query-provider.tsx
- [ ] T018 Create global styles in frontend/src/styles/globals.css with Tailwind directives
- [ ] T019 Create root layout in frontend/src/app/layout.tsx with React Query provider and Toaster
- [ ] T020 Create landing page in frontend/src/app/page.tsx with redirect logic

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Session Management (Priority: P1) 🎯 MVP

**Goal**: Implement user signup, signin, logout, and session persistence with route protection

**Independent Test**: Create a new account (should succeed), sign in with credentials (should grant access), refresh page (session persists), logout (redirects to signin), attempt to access dashboard without auth (redirects to signin)

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create auth route group layout in frontend/src/app/(auth)/layout.tsx with redirect logic for authenticated users
- [ ] T022 [P] [US1] Create protected route group layout in frontend/src/app/(protected)/layout.tsx with auth check and redirect
- [ ] T023 [US1] Create signup page in frontend/src/app/(auth)/signup/page.tsx
- [ ] T024 [US1] Create signin page in frontend/src/app/(auth)/signin/page.tsx
- [ ] T025 [P] [US1] Create AuthForm component in frontend/src/components/auth/AuthForm.tsx with React Hook Form and Zod validation
- [ ] T026 [P] [US1] Create useAuth hook in frontend/src/lib/hooks/useAuth.ts for signup, signin, signout operations
- [ ] T027 [US1] Implement signup mutation with Better Auth in useAuth hook
- [ ] T028 [US1] Implement signin mutation with Better Auth in useAuth hook
- [ ] T029 [US1] Implement signout function with session clearing in useAuth hook
- [ ] T030 [US1] Add form validation error display in AuthForm component
- [ ] T031 [US1] Add loading states to AuthForm component during authentication
- [ ] T032 [US1] Add redirect logic after successful authentication in AuthForm
- [ ] T033 [US1] Test route protection by accessing /dashboard without authentication (should redirect to /signin)
- [ ] T034 [US1] Test session persistence by refreshing page after signin (should remain authenticated)

**Checkpoint**: At this point, authentication should be fully functional - users can signup, signin, logout, and routes are protected

---

## Phase 4: User Story 2 - Task Management Operations (Priority: P2)

**Goal**: Implement full CRUD operations for task management with proper UI feedback

**Independent Test**: Create a task (should appear in list), edit task (should reflect changes), toggle completion (should update status), delete task (should remove from list), view empty state (when no tasks)

### Implementation for User Story 2

- [ ] T035 [US2] Create dashboard page in frontend/src/app/(protected)/dashboard/page.tsx
- [ ] T036 [P] [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx
- [ ] T037 [P] [US2] Create TaskCard component in frontend/src/components/tasks/TaskCard.tsx
- [ ] T038 [P] [US2] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx with React Hook Form
- [ ] T039 [P] [US2] Create EmptyState component in frontend/src/components/tasks/EmptyState.tsx
- [ ] T040 [US2] Create useTasks hook in frontend/src/lib/hooks/useTasks.ts with React Query for fetching tasks
- [ ] T041 [US2] Create useCreateTask mutation hook in frontend/src/lib/hooks/useTasks.ts
- [ ] T042 [US2] Create useUpdateTask mutation hook in frontend/src/lib/hooks/useTasks.ts
- [ ] T043 [US2] Create useDeleteTask mutation hook in frontend/src/lib/hooks/useTasks.ts
- [ ] T044 [US2] Create useToggleTask mutation hook in frontend/src/lib/hooks/useTasks.ts with optimistic updates
- [ ] T045 [US2] Implement task list display in TaskList component with loading state
- [ ] T046 [US2] Implement task creation form in TaskForm component with validation
- [ ] T047 [US2] Implement task edit functionality in TaskCard component
- [ ] T048 [US2] Implement task delete with confirmation in TaskCard component
- [ ] T049 [US2] Implement task completion toggle in TaskCard component
- [ ] T050 [US2] Add empty state display when user has no tasks
- [ ] T051 [US2] Add loading indicators for all task operations
- [ ] T052 [US2] Add error handling and toast notifications for task operations
- [ ] T053 [US2] Implement automatic task list refresh after create/update/delete operations
- [ ] T054 [US2] Add form validation for task title (required, max 255 characters)

**Checkpoint**: At this point, all CRUD operations should work - users can create, read, update, delete, and toggle tasks with proper UI feedback

---

## Phase 5: User Story 3 - Responsive UI and User Experience (Priority: P3)

**Goal**: Ensure application works seamlessly on all screen sizes with clear visual feedback

**Independent Test**: Access application on mobile (320px), tablet (768px), and desktop (1920px) - all functionality should work and display correctly. Test all UI states (loading, empty, error) for clear feedback.

### Implementation for User Story 3

- [ ] T055 [P] [US3] Create Loading component in frontend/src/components/ui/Loading.tsx with spinner
- [ ] T056 [P] [US3] Create Button component in frontend/src/components/ui/Button.tsx with loading and disabled states
- [ ] T057 [P] [US3] Create Input component in frontend/src/components/ui/Input.tsx with error state
- [ ] T058 [P] [US3] Create Modal component in frontend/src/components/ui/Modal.tsx for task edit/delete
- [ ] T059 [P] [US3] Create ErrorBoundary component in frontend/src/components/ui/ErrorBoundary.tsx
- [ ] T060 [US3] Add responsive layout to root layout (mobile-first approach)
- [ ] T061 [US3] Add responsive styles to AuthForm component (mobile: full width, desktop: centered card)
- [ ] T062 [US3] Add responsive styles to TaskList component (mobile: single column, desktop: grid)
- [ ] T063 [US3] Add responsive styles to TaskCard component (mobile: compact, desktop: expanded)
- [ ] T064 [US3] Add hover states to all interactive elements (buttons, cards, inputs)
- [ ] T065 [US3] Add focus states for keyboard navigation
- [ ] T066 [US3] Add disabled states to buttons during loading
- [ ] T067 [US3] Implement loading skeleton for task list
- [ ] T068 [US3] Add error state display for failed API requests
- [ ] T069 [US3] Add success toast notifications for completed operations
- [ ] T070 [US3] Test responsive design on mobile (320px-767px)
- [ ] T071 [US3] Test responsive design on tablet (768px-1023px)
- [ ] T072 [US3] Test responsive design on desktop (1024px-1920px)

**Checkpoint**: All user stories should now be independently functional with responsive design and polished UI states

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T073 [P] Add page metadata (title, description) to all pages
- [ ] T074 [P] Add favicon and app icons to frontend/public/
- [ ] T075 [P] Create Header component in frontend/src/components/layout/Header.tsx with logout button
- [ ] T076 [P] Create Footer component in frontend/src/components/layout/Footer.tsx
- [ ] T077 Add Header to root layout with user info and logout
- [ ] T078 [P] Add loading.tsx files for route-level loading states
- [ ] T079 [P] Add error.tsx files for route-level error handling
- [ ] T080 [P] Optimize images with Next.js Image component
- [ ] T081 Add form input sanitization for XSS prevention
- [ ] T082 Add client-side validation for all forms
- [ ] T083 [P] Add ESLint configuration with Next.js rules
- [ ] T084 [P] Add Prettier configuration for code formatting
- [ ] T085 Verify all 24 functional requirements (FR-001 to FR-024) are implemented per plan.md traceability matrix
- [ ] T086 Run manual validation per quickstart.md (signup, signin, create task, edit, delete, toggle, logout)
- [ ] T087 Verify JWT token is attached to all API requests (check Network tab)
- [ ] T088 Verify route protection works for all protected routes
- [ ] T089 Verify session persistence across page refreshes
- [ ] T090 Performance check: verify First Contentful Paint <1.5s and Time to Interactive <3s

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Depends on User Story 1 (needs authentication to access dashboard) - Cannot start until US1 complete
  - User Story 3 (P3): Can start in parallel with US2 (UI components can be built independently) - But full testing requires US1 and US2
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: DEPENDS on User Story 1 - Needs authentication to access dashboard and make API calls
- **User Story 3 (P3)**: Can start in parallel with US2 for component creation, but full integration requires US1 and US2

### Within Each User Story

- **US1**: Route layouts → Pages → Auth components → Auth hooks → Validation → Testing
- **US2**: Dashboard page → Task components → Task hooks (React Query) → CRUD operations → Error handling
- **US3**: UI components → Responsive styles → Loading/error states → Cross-device testing

### Parallel Opportunities

- **Setup Phase**: T004, T005, T006, T007, T008, T009 can run in parallel
- **Foundational Phase**: T010, T011, T012 (type definitions) can run in parallel
- **User Story 1**: T021, T022 (layouts) can run in parallel; T025, T026 (components/hooks) can run in parallel
- **User Story 2**: T036, T037, T038, T039 (all components) can run in parallel after dashboard page
- **User Story 3**: T055, T056, T057, T058, T059 (all UI components) can run in parallel
- **Polish Phase**: T073, T074, T075, T076, T078, T079, T080, T083, T084 can run in parallel

---

## Parallel Example: User Story 2

```bash
# After dashboard page is created, launch all task components together:
Task: "Create TaskList component in frontend/src/components/tasks/TaskList.tsx"
Task: "Create TaskCard component in frontend/src/components/tasks/TaskCard.tsx"
Task: "Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx"
Task: "Create EmptyState component in frontend/src/components/tasks/EmptyState.tsx"

# After components are ready, create all React Query hooks together:
Task: "Create useTasks hook with React Query for fetching tasks"
Task: "Create useCreateTask mutation hook"
Task: "Create useUpdateTask mutation hook"
Task: "Create useDeleteTask mutation hook"
Task: "Create useToggleTask mutation hook with optimistic updates"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T020) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T021-T034)
4. **STOP and VALIDATE**: Test authentication works (signup, signin, logout, route protection, session persistence)
5. This gives you a secure foundation with working authentication

### Recommended: MVP with Basic Functionality (US1 + US2)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T020)
3. Complete Phase 3: User Story 1 (T021-T034)
4. Complete Phase 4: User Story 2 (T035-T054)
5. **STOP and VALIDATE**: Test full CRUD operations with authentication
6. Deploy/demo - this is a fully functional task management application

### Full Implementation (All User Stories)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test authentication independently
3. Add User Story 2 → Test CRUD operations independently → Deploy/Demo (MVP!)
4. Add User Story 3 → Test responsive design and UI states → Deploy/Demo
5. Add Polish phase → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T020)
2. Once Foundational is done:
   - Developer A: User Story 1 authentication (T021-T034)
3. Once US1 is done:
   - Developer A: User Story 2 dashboard and components (T035-T039)
   - Developer B: User Story 3 UI components (T055-T059) - can start in parallel
4. Once components done:
   - Developer A: User Story 2 hooks and CRUD (T040-T054)
   - Developer B: User Story 3 responsive styles (T060-T072)
5. Once all stories done:
   - Distribute Polish phase tasks across team (T073-T090)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Sequential dependencies**: US2 depends on US1 (needs auth), US3 can start in parallel with US2 but needs both for full testing
- **File paths**: All paths include exact file locations per plan.md structure
- **Validation**: Each checkpoint allows independent testing of that user story
- **Commit strategy**: Commit after each task or logical group of parallel tasks
- **Testing**: Tests not included per specification (not explicitly requested)
- **MVP scope**: Phases 1-4 (Setup + Foundational + US1 + US2) provide fully functional application
- **Production ready**: All phases including Polish provide production-grade implementation

---

## Task Count Summary

- **Total Tasks**: 90
- **Setup Phase**: 9 tasks
- **Foundational Phase**: 11 tasks (BLOCKS all user stories)
- **User Story 1 (P1)**: 14 tasks (Authentication & Session Management)
- **User Story 2 (P2)**: 20 tasks (Task Management Operations)
- **User Story 3 (P3)**: 18 tasks (Responsive UI & User Experience)
- **Polish Phase**: 18 tasks (Cross-cutting concerns)

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-4 (54 tasks) deliver fully functional authenticated task management application

**Independent Test Criteria**:
- **US1**: Authentication works (signup, signin, logout, route protection, session persistence)
- **US2**: All CRUD operations work (create, read, update, delete, toggle tasks)
- **US3**: Responsive design works (mobile, tablet, desktop) with clear UI feedback
