# Implementation Plan: Frontend Application & User Experience

**Branch**: `2-frontend-app` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/2-frontend-app/spec.md`

## Summary

Build a modern, responsive Next.js 16+ frontend application with Better Auth integration for user authentication and JWT-based API communication with the backend. The frontend provides signup, signin, and task management interfaces with proper route protection, loading states, error handling, and responsive design for mobile and desktop devices.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16+ (App Router)
**Primary Dependencies**: Next.js 16+, Better Auth, React 18+, TypeScript 5.x
**Storage**: Browser session storage for JWT tokens (managed by Better Auth)
**Testing**: Jest, React Testing Library, Playwright (e2e)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend only)
**Performance Goals**: First Contentful Paint <1.5s, Time to Interactive <3s, API response handling <500ms
**Constraints**: Must use App Router (not Pages Router), JWT-only auth (no session cookies), all API calls through backend
**Scale/Scope**: 3 pages (signup, signin, dashboard), ~15-20 components, responsive 320px-1920px

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Spec-First Development
- Specification complete and approved before implementation
- All features mapped to functional requirements (FR-001 to FR-024)
- User stories prioritized (P1: Auth, P2: Task Management, P3: UX)

### ✅ Security by Design
- JWT authentication required for all protected routes (FR-004, FR-005)
- Automatic logout on 401 responses (FR-017)
- User data isolation enforced by backend API
- No direct database access from frontend

### ✅ User Data Isolation
- All task operations filtered by authenticated user
- JWT token contains user_id for backend verification
- Frontend displays only user's own tasks (FR-008)

### ✅ Reproducible Development
- Deterministic builds with package-lock.json
- Environment variables for configuration
- Consistent development environment via Node.js version

### ✅ Zero Manual Coding
- Implementation through Claude Code only
- All changes traceable to specifications

### ✅ API-Centric Architecture
- Clear separation: Frontend ↔ REST API ↔ Backend
- All data operations through defined endpoints (FR-004)
- No direct database access from frontend

**Constitution Compliance**: ✅ PASSED - All gates satisfied

## Project Structure

### Documentation (this feature)

```text
specs/2-frontend-app/
├── plan.md              # This file
├── research.md          # Phase 0: Architectural decisions
├── data-model.md        # Phase 1: Frontend data structures
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/           # Phase 1: API client interfaces
│   └── api-client.ts    # TypeScript API client specification
└── tasks.md             # Phase 2: Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (protected)/       # Protected route group
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing/redirect page
│   ├── components/            # React components
│   │   ├── auth/             # Auth-related components
│   │   ├── tasks/            # Task management components
│   │   ├── ui/               # Reusable UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utilities and helpers
│   │   ├── api-client.ts     # API client with JWT
│   │   ├── auth.ts           # Better Auth configuration
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript type definitions
│   │   ├── task.ts
│   │   └── user.ts
│   └── styles/                # Global styles
│       └── globals.css
├── public/                    # Static assets
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local.example
```

**Structure Decision**: Web application structure with Next.js App Router. Uses route groups for organizing auth vs protected pages. Separates concerns with dedicated directories for components, lib utilities, and types.

## Complexity Tracking

> No constitution violations - this section is not needed.

## Implementation Phases

### Phase 0: Research & Architecture Decisions ✅

**Output**: `research.md`

Document architectural decisions for:
1. Route protection strategy (middleware vs layout-based)
2. JWT token access from Better Auth
3. API client design (abstraction vs direct fetch)
4. State management approach (local vs global)
5. Error handling strategy
6. Styling solution (Tailwind CSS recommended)
7. Form handling approach

### Phase 1: Design & Contracts ✅

**Output**: `data-model.md`, `contracts/`, `quickstart.md`

1. **Data Model** (`data-model.md`):
   - Frontend TypeScript interfaces for Task, User, Session
   - API request/response types
   - Form validation schemas

2. **API Contracts** (`contracts/api-client.ts`):
   - TypeScript API client interface
   - HTTP methods for all endpoints
   - Request/response type definitions
   - Error handling types

3. **Quickstart Guide** (`quickstart.md`):
   - Local development setup
   - Environment variable configuration
   - Running dev server
   - Testing instructions

### Phase 2: Task Breakdown

**Output**: `tasks.md` (created by `/sp.tasks` command)

Break down implementation into granular tasks following user story priorities.

## Traceability Matrix

| Functional Requirement | Implementation | Test Coverage |
|------------------------|----------------|---------------|
| FR-001: Signup page | `app/(auth)/signup/page.tsx` | Auth flow tests |
| FR-002: Signin page | `app/(auth)/signin/page.tsx` | Auth flow tests |
| FR-003: Better Auth integration | `lib/auth.ts` | Integration tests |
| FR-004: JWT in API requests | `lib/api-client.ts` | API client tests |
| FR-005: Redirect unauth users | Route middleware/layout | E2E tests |
| FR-006: Redirect auth users | Route middleware/layout | E2E tests |
| FR-007: Logout function | Auth component | Auth flow tests |
| FR-008: Task dashboard | `app/(protected)/dashboard/page.tsx` | Dashboard tests |
| FR-009: Create task | Task form component | Task CRUD tests |
| FR-010: Edit task | Task edit component | Task CRUD tests |
| FR-011: Toggle completion | Task item component | Task CRUD tests |
| FR-012: Delete task | Task item component | Task CRUD tests |
| FR-013: Loading indicators | UI components | UI state tests |
| FR-014: Empty states | Dashboard component | UI state tests |
| FR-015: Error messages | Error boundary/components | Error handling tests |
| FR-016: API error handling | API client | Error handling tests |
| FR-017: Logout on 401 | API client interceptor | Auth flow tests |
| FR-018: Responsive design | All components | Responsive tests |
| FR-019: Form validation | Form components | Validation tests |
| FR-020: Prevent duplicate requests | API client | API client tests |
| FR-021: Refresh after operations | Task components | Task CRUD tests |
| FR-022: Task ordering | Dashboard component | Dashboard tests |
| FR-023: Interactive feedback | UI components | UI state tests |
| FR-024: Session persistence | Better Auth config | Auth flow tests |

## Success Criteria Validation

| Success Criterion | Validation Method |
|-------------------|-------------------|
| SC-001: Signup <1 min | Manual testing + user feedback |
| SC-002: Signin <10s | Performance monitoring |
| SC-003: Task creation <3s | Performance monitoring |
| SC-004: No page refreshes | E2E tests verify SPA behavior |
| SC-005: 320px-1920px support | Responsive testing on multiple devices |
| SC-006: User-friendly errors | Error message review + user testing |
| SC-007: Loading indicators >500ms | UI state tests |
| SC-008: 100% route protection | E2E tests for all protected routes |
| SC-009: Session persistence | Auth flow tests with page refresh |
| SC-010: Clear validation messages | Form validation tests |

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth integration complexity | High | Follow official docs, use TypeScript for type safety |
| JWT token expiration handling | Medium | Implement automatic refresh or clear error messaging |
| State synchronization issues | Medium | Use React Query or SWR for server state management |
| Responsive design inconsistencies | Low | Use Tailwind CSS with mobile-first approach |
| API error handling edge cases | Medium | Comprehensive error boundary and retry logic |

## Post-Implementation Checklist

- [ ] All 24 functional requirements implemented
- [ ] All 3 user stories independently testable
- [ ] Route protection working for all protected pages
- [ ] JWT tokens attached to all API requests
- [ ] Error handling for all API failure scenarios
- [ ] Loading states for all async operations
- [ ] Empty states for zero-task scenario
- [ ] Responsive design tested on mobile and desktop
- [ ] Form validation working with clear messages
- [ ] Session persistence across page refreshes
- [ ] Logout functionality working correctly
- [ ] All success criteria validated
- [ ] Integration with backend API verified
- [ ] Constitution compliance verified
