# Research: Todo Full-Stack Web Application

**Feature**: 1-todo-full-stack
**Date**: 2026-02-05
**Research completed for**: Implementation Plan Phase 0

## Research Topics & Findings

### 1. JWT-based Auth vs Session-based Auth Tradeoffs

**Decision**: JWT-based authentication selected
**Rationale**:
- Stateless authentication scales better for microservices
- No server-side session storage needed
- Cross-domain compatibility
- Self-contained tokens with user info
- Better for mobile and API-heavy applications
- Aligns with Better Auth's JWT capabilities
- Matches security requirement of no session-based authentication

**Alternatives considered**:
- Session-based: Requires server-side storage, less scalable, not allowed per constitution
- OAuth tokens: Overly complex for this use case, Better Auth preferred

### 2. Better Auth Integration Pattern with FastAPI

**Decision**: Use Better Auth for JWT issuance with custom middleware for validation
**Rationale**:
- Better Auth handles signup/login flows and JWT issuance
- Can integrate with FastAPI via custom middleware
- Maintains clear separation between auth and application logic
- Well-documented integration patterns exist
- Supports required JWT format and claims

**Implementation approach**:
- Use Better Auth API for authentication endpoints
- Create FastAPI middleware to verify JWT tokens
- Extract user info from JWT for request context

### 3. Middleware-based JWT Verification vs Per-Route Validation

**Decision**: Middleware-based JWT verification
**Rationale**:
- Centralized security logic reduces duplication
- Ensures consistent validation across all endpoints
- Easier to maintain and update security policies
- Better performance (validation happens once per request)
- Cleaner route handlers focusing on business logic
- Aligns with FastAPI best practices

**Alternatives considered**: Decorators, manual validation in each route (rejected due to duplication)

### 4. SQLModel vs Alternative ORMs

**Decision**: SQLModel selected as required by constitution
**Rationale**:
- Required by project constitution and constraints
- Pydantic-compatible for API validation
- SQLAlchemy-based for mature SQL support
- Good integration with FastAPI
- Type safety benefits

**Alternatives considered**: SQLAlchemy Core, Tortoise ORM, Peewee (rejected as not constitutionally compliant)

### 5. User ID Source of Truth (JWT Payload vs Request Params)

**Decision**: User ID from JWT payload as source of truth
**Rationale**:
- Prevents privilege escalation attacks
- Ensures user can only access their own data
- Maintains consistency between authentication and authorization
- Verifies that JWT user matches requested resource owner
- Required by security requirements in constitution

**Implementation**: Extract user_id from JWT and compare with request parameters for authorization

### 6. Task Ownership Enforcement Strategy

**Decision**: Query-level filtering with user ID verification
**Rationale**:
- Filter all database queries by user_id from JWT
- Verify resource ownership in service layer
- Return 404 for resources owned by other users (not 403)
- Enforce at database level to prevent unauthorized access
- Maintain user data isolation as required

**Implementation**: Include user_id in all task queries and verify ownership before updates/deletes

### 7. Frontend API Client Abstraction Approach

**Decision**: Centralized API client with JWT injection
**Rationale**:
- Consistent authentication header handling
- Centralized error handling
- Reusable across components
- Easy to maintain authentication state
- Handles token refresh scenarios
- Aligns with Next.js best practices

**Implementation**: Create API client wrapper that injects JWT and handles 401 responses