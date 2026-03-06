# Implementation Plan: Backend API & Data Persistence

**Branch**: `1-backend-api-persistence` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-backend-api-persistence/spec.md`

## Summary

This plan implements a secure RESTful API backend for task management with strict user data isolation. The backend authenticates all requests via JWT tokens, enforces task ownership at the database query level, and persists data to a relational database. The implementation prioritizes security (P1), followed by complete CRUD operations (P2), and data persistence guarantees (P3).

**Technical Approach**: FastAPI application with JWT middleware for authentication, SQLModel ORM for database operations, and Neon PostgreSQL for data persistence. All endpoints filter data by authenticated user ID to enforce isolation.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.104+, SQLModel 0.0.14+, PyJWT 2.8+, psycopg2-binary 2.9+, python-dotenv 1.0+
**Storage**: Neon Serverless PostgreSQL (connection via DATABASE_URL environment variable)
**Testing**: pytest 7.4+, pytest-asyncio 0.21+, httpx 0.25+ (for FastAPI test client)
**Target Platform**: Linux/Windows server (containerizable)
**Project Type**: Web (backend API only)
**Performance Goals**: <200ms p95 latency for API requests, support 100+ concurrent authenticated requests
**Constraints**: JWT-only authentication (no sessions), user ID must match between token and request path, all database queries filtered by user ID
**Scale/Scope**: Multi-user system with strict data isolation, 6 REST endpoints, 2 data models (Task, User reference)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Review

✅ **Spec-First Development**: Implementation follows approved spec.md with all features, APIs, and interfaces detailed
✅ **Security by Design**: JWT authentication enforced at middleware level, authorization checked on every request
✅ **User Data Isolation**: All database queries filtered by authenticated user ID, no cross-user access possible
✅ **Reproducible Development**: Deterministic builds via requirements.txt, environment variables for configuration
✅ **Zero Manual Coding**: Implementation via Claude Code automation only
✅ **API-Centric Architecture**: RESTful API with clear separation from frontend
✅ **Security Requirements**: JWT verification in FastAPI middleware, user ID matching enforced, 401/403 status codes
✅ **Architecture Rules**: Python FastAPI backend, SQLModel ORM, Neon PostgreSQL, Better Auth JWT integration
✅ **Development Workflow**: Spec → Plan → Tasks → Implementation workflow followed

**Gate Status**: ✅ PASSED - No violations, all principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/1-backend-api-persistence/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── openapi.yaml     # OpenAPI 3.0 specification
│   └── endpoints.md     # Detailed endpoint documentation
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                    # FastAPI application entry point
│   ├── config.py                  # Environment configuration
│   ├── database/
│   │   ├── __init__.py
│   │   └── connection.py          # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py                # Task SQLModel schema
│   │   └── user.py                # User reference model
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── jwt_auth.py            # JWT authentication middleware
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py        # Task business logic with user filtering
│   └── api/
│       ├── __init__.py
│       └── task_router.py         # Task REST endpoints
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Pytest fixtures
│   ├── unit/
│   │   ├── test_task_service.py
│   │   └── test_jwt_middleware.py
│   ├── integration/
│   │   └── test_task_api.py
│   └── contract/
│       └── test_openapi_compliance.py
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variable template
└── README.md                      # Backend setup instructions
```

**Structure Decision**: Web application structure selected (Option 2 from template). Backend-only implementation with clear separation of concerns: database layer (connection, models), middleware layer (authentication), service layer (business logic with user filtering), and API layer (REST endpoints). Frontend exists separately and communicates via defined REST API.

## Complexity Tracking

> No constitution violations - this section is empty.

## Phase 0: Research & Decisions

### Research Tasks Completed

See [research.md](./research.md) for detailed findings. Key decisions:

1. **JWT Verification Strategy**: Global FastAPI middleware vs per-route dependency injection
2. **User Identity Source**: JWT payload (sub/user_id claim) vs URL parameter matching
3. **Task Ownership Enforcement**: Database query filtering vs service layer checks
4. **SQLModel Session Management**: Dependency injection pattern with context managers
5. **Error Handling Strategy**: FastAPI exception handlers with consistent error response format
6. **HTTP Status Code Conventions**: RESTful semantics (200, 201, 400, 401, 403, 404)
7. **API Route Structure**: `/api/tasks` (user ID from JWT) vs `/api/users/{user_id}/tasks`

### Key Architectural Decisions

**Decision 1: JWT Verification via Dependency Injection**
- **Chosen**: FastAPI dependency injection for JWT verification on protected routes
- **Rationale**: More flexible than global middleware, allows public endpoints if needed, better testability
- **Alternative Rejected**: Global middleware would apply to all routes including health checks

**Decision 2: User Identity from JWT Payload**
- **Chosen**: Extract user_id from JWT token payload (sub or user_id claim)
- **Rationale**: Single source of truth, prevents URL parameter tampering, aligns with JWT standard
- **Alternative Rejected**: URL parameter matching would require redundant validation

**Decision 3: Query-Level Ownership Enforcement**
- **Chosen**: Filter all database queries by authenticated user_id at service layer
- **Rationale**: Defense in depth, impossible to bypass, consistent across all operations
- **Alternative Rejected**: Route-level checks could be bypassed if service called directly

**Decision 4: Dependency Injection for Database Sessions**
- **Chosen**: FastAPI dependency with yield pattern for session lifecycle
- **Rationale**: Automatic cleanup, transaction management, follows FastAPI best practices
- **Alternative Rejected**: Manual session management error-prone and verbose

**Decision 5: Structured Error Responses**
- **Chosen**: Consistent JSON error format with detail, status_code, and timestamp
- **Rationale**: Client-friendly, debuggable, follows REST API conventions
- **Alternative Rejected**: Plain text errors harder to parse programmatically

**Decision 6: RESTful Route Structure**
- **Chosen**: `/api/tasks` with user context from JWT (no user_id in URL)
- **Rationale**: Cleaner URLs, user context implicit from authentication, RESTful design
- **Alternative Rejected**: `/api/users/{user_id}/tasks` redundant with JWT user_id

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](./data-model.md) for complete schema definitions.

**Entities**:
- **Task**: id (int, PK), title (str, max 255), description (str, optional), completed (bool), user_id (int, FK), created_at (datetime), updated_at (datetime)
- **User**: Referenced by user_id in Task model, managed by separate authentication system

**Relationships**:
- Task.user_id → User.id (many-to-one, enforced at query level)

**Validation Rules**:
- Task.title: required, non-empty, max 255 characters
- Task.description: optional, no length limit
- Task.completed: boolean, defaults to False
- Task.user_id: required, must match authenticated user

### API Contracts

See [contracts/](./contracts/) directory for complete specifications.

**Endpoints**:

1. **GET /api/tasks** - List all tasks for authenticated user
   - Auth: Required (JWT)
   - Response: 200 OK with array of tasks
   - Filters: Returns only tasks where user_id matches JWT

2. **POST /api/tasks** - Create new task
   - Auth: Required (JWT)
   - Body: {title: string, description?: string}
   - Response: 201 Created with task object
   - Validation: Title required, max 255 chars

3. **GET /api/tasks/{id}** - Get specific task
   - Auth: Required (JWT)
   - Response: 200 OK with task object, 404 if not found, 403 if not owned
   - Ownership: Verified via user_id match

4. **PUT /api/tasks/{id}** - Update task
   - Auth: Required (JWT)
   - Body: {title?: string, description?: string, completed?: boolean}
   - Response: 200 OK with updated task, 404 if not found, 403 if not owned
   - Validation: Title max 255 chars if provided

5. **DELETE /api/tasks/{id}** - Delete task
   - Auth: Required (JWT)
   - Response: 204 No Content, 404 if not found, 403 if not owned
   - Effect: Hard delete from database

6. **PATCH /api/tasks/{id}/complete** - Toggle completion status
   - Auth: Required (JWT)
   - Response: 200 OK with updated task, 404 if not found, 403 if not owned
   - Effect: Flips completed boolean

**Common Error Responses**:
- 401 Unauthorized: Missing, invalid, or expired JWT
- 403 Forbidden: Valid JWT but task belongs to different user
- 404 Not Found: Task ID doesn't exist
- 400 Bad Request: Validation failure (empty title, too long, etc.)

### Implementation Phases

**Phase 1: Backend Architecture Setup**
- Initialize FastAPI application structure
- Configure environment variables (DATABASE_URL, JWT_SECRET)
- Set up dependency injection for database sessions
- Create health check endpoint

**Phase 2: Authentication Enforcement**
- Implement JWT extraction from Authorization header
- Create JWT verification dependency
- Validate token signature using shared secret (BETTER_AUTH_SECRET)
- Extract user_id from token payload
- Return 401 for missing/invalid tokens

**Phase 3: Data Modeling**
- Define Task SQLModel with all fields
- Define User reference model (minimal, for FK only)
- Add validation constraints (title length, required fields)
- Configure timestamps (created_at, updated_at auto-management)

**Phase 4: Database Integration**
- Configure Neon PostgreSQL connection
- Implement session dependency with yield pattern
- Create database initialization script
- Add connection error handling

**Phase 5: REST API Implementation**
- Implement GET /api/tasks (list with user filtering)
- Implement POST /api/tasks (create with user_id injection)
- Implement GET /api/tasks/{id} (retrieve with ownership check)
- Implement PUT /api/tasks/{id} (update with ownership check)
- Implement DELETE /api/tasks/{id} (delete with ownership check)
- Implement PATCH /api/tasks/{id}/complete (toggle with ownership check)
- Ensure consistent response formats

**Phase 6: Validation & Error Handling**
- Add input validation (Pydantic models)
- Implement resource existence checks
- Add ownership verification logic
- Create custom exception handlers
- Return appropriate HTTP status codes
- Add error logging

**Phase 7: Verification & Review**
- Verify all endpoints against spec acceptance scenarios
- Test authentication enforcement (401 for no token)
- Test authorization enforcement (403 for wrong user)
- Test data persistence across restarts
- Validate spec traceability (all FRs implemented)
- Security audit (user isolation, query filtering)

### Testing Strategy

**Authentication Tests**:
- Requests without JWT return 401
- Invalid JWT signature returns 401
- Expired JWT returns 401
- Malformed JWT returns 401
- Valid JWT allows access

**Authorization Tests**:
- User A cannot access User B's tasks (403)
- User A can only see their own tasks in list
- User A cannot update/delete User B's tasks (403)

**CRUD Operation Tests**:
- Create task with valid data returns 201
- Create task with empty title returns 400
- Create task with title >255 chars returns 400
- List tasks returns only authenticated user's tasks
- Get task by ID returns task if owned, 403 if not, 404 if doesn't exist
- Update task modifies data and returns 200
- Delete task removes from database and returns 204
- Toggle completion flips boolean and returns 200

**Data Persistence Tests**:
- Tasks survive application restart
- Multiple users' data remains isolated
- Timestamps are correctly maintained

**Edge Case Tests**:
- Concurrent modifications to same task
- Database connection failure handling
- Invalid task ID format
- Missing required fields

### Quickstart Guide

See [quickstart.md](./quickstart.md) for complete setup instructions.

**Quick Setup**:
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Configure environment: Copy `.env.example` to `.env`, set DATABASE_URL and JWT_SECRET
3. Initialize database: `python -m backend.src.database.init_db`
4. Run server: `uvicorn backend.src.main:app --reload`
5. Test endpoint: `curl http://localhost:8000/health`

**Development Workflow**:
1. Obtain JWT token from authentication system
2. Include token in Authorization header: `Bearer <token>`
3. Make API requests to `/api/tasks` endpoints
4. Verify responses and data persistence

## Traceability Matrix

| Requirement | Implementation | Test Coverage |
|-------------|----------------|---------------|
| FR-001: Authenticate all requests | JWT dependency on all routes | test_auth_required |
| FR-002: Verify user ID match | Extract from JWT payload | test_user_id_extraction |
| FR-003: Filter queries by user | WHERE user_id = {auth_user} | test_query_filtering |
| FR-004: Create tasks | POST /api/tasks | test_create_task |
| FR-005: List tasks | GET /api/tasks | test_list_tasks |
| FR-006: Get task by ID | GET /api/tasks/{id} | test_get_task |
| FR-007: Update tasks | PUT /api/tasks/{id} | test_update_task |
| FR-008: Delete tasks | DELETE /api/tasks/{id} | test_delete_task |
| FR-009: Toggle completion | PATCH /api/tasks/{id}/complete | test_toggle_complete |
| FR-010: Validate title | Pydantic validation | test_title_validation |
| FR-011: HTTP status codes | FastAPI response models | test_status_codes |
| FR-012: Error messages | Exception handlers | test_error_messages |
| FR-013: Persist data | SQLModel + PostgreSQL | test_persistence |
| FR-014: Prevent cross-user access | Query filtering + 403 | test_authorization |
| FR-015: Unique identifiers | Auto-increment PK | test_task_id_generation |
| FR-016: Track timestamps | SQLModel auto fields | test_timestamps |
| FR-017: Validate JWT | PyJWT verification | test_jwt_validation |
| FR-018: Reject invalid tokens | JWT dependency | test_invalid_tokens |

## Success Criteria Validation

| Success Criterion | Validation Method |
|-------------------|-------------------|
| SC-001: 100% auth required | All endpoints have JWT dependency, test suite verifies |
| SC-002: 0% cross-user access | Query filtering enforced, authorization tests verify |
| SC-003: Data persists | Restart tests, database persistence verified |
| SC-004: <1s error responses | Performance tests, FastAPI async handling |
| SC-005: All CRUD operations | 6 endpoints implemented, integration tests verify |
| SC-006: 100+ concurrent requests | Load testing with concurrent clients |
| SC-007: Auth failures logged | Logging middleware, log verification tests |
| SC-008: Data integrity | Validation tests, constraint enforcement |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| JWT secret compromise | Low | Critical | Use strong secret, rotate regularly, environment variable only |
| Database connection failure | Medium | High | Connection pooling, retry logic, health checks |
| Cross-user data leakage | Low | Critical | Query-level filtering, comprehensive authorization tests |
| Token expiration handling | Medium | Medium | Clear 401 responses, client-side token refresh |
| Concurrent modification conflicts | Medium | Low | Database transactions, optimistic locking if needed |
| SQL injection | Low | Critical | SQLModel parameterized queries, input validation |

## Dependencies & Prerequisites

**External Dependencies**:
- Neon PostgreSQL database provisioned and accessible
- Better Auth system issuing JWT tokens with user_id claim
- BETTER_AUTH_SECRET shared between auth system and backend
- DATABASE_URL connection string configured

**Development Dependencies**:
- Python 3.11+ installed
- pip package manager
- Virtual environment (venv or conda)
- PostgreSQL client tools (optional, for debugging)

**Environment Variables Required**:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Shared secret for JWT verification (same as BETTER_AUTH_SECRET)
- `JWT_ALGORITHM`: Algorithm for JWT (default: HS256)
- `ENVIRONMENT`: dev/staging/prod (optional)

## Post-Implementation Checklist

- [ ] All 6 REST endpoints implemented and tested
- [ ] JWT authentication enforced on all endpoints
- [ ] User data isolation verified (no cross-user access)
- [ ] Data persists across application restarts
- [ ] All functional requirements (FR-001 to FR-018) implemented
- [ ] All success criteria (SC-001 to SC-008) validated
- [ ] Edge cases handled (empty title, invalid ID, etc.)
- [ ] Error responses follow HTTP conventions
- [ ] Logging implemented for authentication failures
- [ ] Database schema matches data model specification
- [ ] API contracts match OpenAPI specification
- [ ] Integration tests pass with 100% coverage
- [ ] Security audit completed (no vulnerabilities)
- [ ] Documentation updated (README, quickstart)
- [ ] Code follows Python/FastAPI best practices
- [ ] Constitution compliance verified

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown from this plan
2. Execute tasks in dependency order (setup → auth → models → API)
3. Verify each phase against acceptance criteria
4. Run comprehensive test suite after implementation
5. Conduct security review before deployment
6. Update documentation with any implementation learnings
