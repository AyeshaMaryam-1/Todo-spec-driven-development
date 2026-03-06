---
description: "Task list for Backend API & Data Persistence implementation"
---

# Tasks: Backend API & Data Persistence

**Input**: Design documents from `/specs/1-backend-api-persistence/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend structure**: `backend/src/`, `backend/tests/`
- All paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend directory structure per plan.md (backend/src/, backend/tests/, backend/src/database/, backend/src/models/, backend/src/middleware/, backend/src/services/, backend/src/api/)
- [ ] T002 Create requirements.txt with dependencies (FastAPI 0.104+, SQLModel 0.0.14+, PyJWT 2.8+, psycopg2-binary 2.9+, python-dotenv 1.0+, uvicorn, pytest, pytest-asyncio, httpx)
- [ ] T003 [P] Create .env.example file with DATABASE_URL, JWT_SECRET, JWT_ALGORITHM, ENVIRONMENT variables
- [ ] T004 [P] Create backend/README.md with setup instructions
- [ ] T005 [P] Create all __init__.py files in backend/src/ subdirectories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create backend/src/config.py to load environment variables using python-dotenv
- [ ] T007 Create backend/src/database/connection.py with SQLModel engine creation and get_session dependency
- [ ] T008 Create backend/src/main.py with FastAPI app initialization and health check endpoint
- [ ] T009 [P] Create backend/src/models/user.py with User reference model (id, email, name fields)
- [ ] T010 Add CORS middleware configuration in backend/src/main.py for frontend integration
- [ ] T011 Create backend/src/database/init_db.py script to initialize database schema

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Task Data Access (Priority: P1) 🎯 MVP

**Goal**: Implement JWT authentication and authorization to ensure users can only access their own task data

**Independent Test**: Attempt to access task endpoints without JWT (should return 401), with invalid JWT (should return 401), and attempt to access another user's task (should return 403)

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create backend/src/middleware/jwt_auth.py with JWT token extraction from Authorization header
- [ ] T013 [US1] Implement JWT verification function in backend/src/middleware/jwt_auth.py using PyJWT and JWT_SECRET
- [ ] T014 [US1] Create get_current_user dependency in backend/src/middleware/jwt_auth.py that extracts user_id from JWT payload
- [ ] T015 [US1] Implement HTTPException handlers for 401 Unauthorized in backend/src/main.py
- [ ] T016 [US1] Implement HTTPException handlers for 403 Forbidden in backend/src/main.py
- [ ] T017 [US1] Create structured error response format (detail, status_code, timestamp) in backend/src/main.py
- [ ] T018 [US1] Add authentication logging for failed attempts in backend/src/middleware/jwt_auth.py

**Checkpoint**: At this point, JWT authentication should be fully functional - all endpoints will require valid JWT tokens

---

## Phase 4: User Story 2 - Complete Task Lifecycle Management (Priority: P2)

**Goal**: Implement full CRUD operations for task management with user data isolation

**Independent Test**: Create a task (should return 201 with task object), list tasks (should return only user's tasks), get task by ID (should return task if owned), update task (should modify and return updated task), toggle completion (should flip status), delete task (should return 204)

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create backend/src/models/task.py with Task SQLModel (id, title, description, completed, user_id, created_at, updated_at)
- [ ] T020 [P] [US2] Create TaskCreate Pydantic model in backend/src/models/task.py with title and description fields
- [ ] T021 [P] [US2] Create TaskUpdate Pydantic model in backend/src/models/task.py with optional title, description, completed fields
- [ ] T022 [P] [US2] Create TaskRead Pydantic model in backend/src/models/task.py with all task fields for responses
- [ ] T023 [US2] Create backend/src/services/task_service.py with create_task function (filters by user_id)
- [ ] T024 [US2] Implement get_tasks_by_user function in backend/src/services/task_service.py (filters by user_id, orders by created_at desc)
- [ ] T025 [US2] Implement get_task_by_id function in backend/src/services/task_service.py (filters by task_id AND user_id)
- [ ] T026 [US2] Implement update_task function in backend/src/services/task_service.py (filters by task_id AND user_id)
- [ ] T027 [US2] Implement delete_task function in backend/src/services/task_service.py (filters by task_id AND user_id)
- [ ] T028 [US2] Implement toggle_task_completion function in backend/src/services/task_service.py (filters by task_id AND user_id)
- [ ] T029 [US2] Create backend/src/api/task_router.py with APIRouter initialization
- [ ] T030 [US2] Implement GET /api/tasks endpoint in backend/src/api/task_router.py (list tasks, requires JWT)
- [ ] T031 [US2] Implement POST /api/tasks endpoint in backend/src/api/task_router.py (create task, requires JWT, returns 201)
- [ ] T032 [US2] Implement GET /api/tasks/{id} endpoint in backend/src/api/task_router.py (get task, requires JWT, returns 404 if not found, 403 if not owned)
- [ ] T033 [US2] Implement PUT /api/tasks/{id} endpoint in backend/src/api/task_router.py (update task, requires JWT, returns 404 if not found, 403 if not owned)
- [ ] T034 [US2] Implement DELETE /api/tasks/{id} endpoint in backend/src/api/task_router.py (delete task, requires JWT, returns 204, 404 if not found, 403 if not owned)
- [ ] T035 [US2] Implement PATCH /api/tasks/{id}/complete endpoint in backend/src/api/task_router.py (toggle completion, requires JWT, returns 404 if not found, 403 if not owned)
- [ ] T036 [US2] Register task_router in backend/src/main.py with /api prefix
- [ ] T037 [US2] Add title validation in backend/src/models/task.py (non-empty, max 255 chars) using Pydantic validators
- [ ] T038 [US2] Add 400 Bad Request error handling for validation failures in backend/src/api/task_router.py
- [ ] T039 [US2] Add 404 Not Found error handling for non-existent tasks in backend/src/api/task_router.py

**Checkpoint**: At this point, all CRUD operations should work - users can create, read, update, delete, and toggle tasks with full user isolation

---

## Phase 5: User Story 3 - Data Persistence and Reliability (Priority: P3)

**Goal**: Ensure task data persists reliably across sessions and system restarts with proper connection management

**Independent Test**: Create tasks, restart the server, verify all tasks are still present with correct data; create tasks as multiple users, verify data isolation is maintained

### Implementation for User Story 3

- [ ] T040 [P] [US3] Configure SQLModel connection pooling in backend/src/database/connection.py (pool_size, max_overflow)
- [ ] T041 [P] [US3] Add database connection error handling in backend/src/database/connection.py with retry logic
- [ ] T042 [US3] Implement automatic updated_at timestamp trigger in backend/src/models/task.py using SQLModel events
- [ ] T043 [US3] Add database health check to /health endpoint in backend/src/main.py (verify connection)
- [ ] T044 [US3] Add transaction management to task service functions in backend/src/services/task_service.py
- [ ] T045 [US3] Create database initialization verification in backend/src/database/init_db.py (check tables exist)

**Checkpoint**: All user stories should now be independently functional with reliable data persistence

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 [P] Add comprehensive logging for all API requests in backend/src/main.py using middleware
- [ ] T047 [P] Create backend/src/utils/logger.py with structured logging utilities
- [ ] T048 [P] Add request/response logging for debugging in backend/src/main.py
- [ ] T049 Add input sanitization for task title and description in backend/src/models/task.py
- [ ] T050 [P] Update backend/README.md with API endpoint documentation and examples
- [ ] T051 [P] Add OpenAPI tags and descriptions to endpoints in backend/src/api/task_router.py
- [ ] T052 Verify all functional requirements (FR-001 to FR-018) are implemented per plan.md traceability matrix
- [ ] T053 Run manual validation per quickstart.md (create task, list tasks, update, delete, verify persistence)
- [ ] T054 Security audit: verify user_id filtering in all database queries in backend/src/services/task_service.py
- [ ] T055 Performance check: verify response times <200ms for all endpoints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Depends on User Story 1 (needs authentication) - Cannot start until US1 complete
  - User Story 3 (P3): Depends on User Story 2 (needs CRUD operations to test persistence) - Cannot start until US2 complete
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: DEPENDS on User Story 1 - Needs JWT authentication to protect endpoints
- **User Story 3 (P3)**: DEPENDS on User Story 2 - Needs CRUD operations to validate persistence

### Within Each User Story

- **US1**: JWT middleware → verification → user extraction → error handling → logging
- **US2**: Models → service functions → API endpoints → validation → error handling
- **US3**: Connection pooling → error handling → transactions → health checks → verification

### Parallel Opportunities

- **Setup Phase**: T003, T004, T005 can run in parallel
- **Foundational Phase**: T009 (User model) can run in parallel with other foundational tasks
- **User Story 1**: T012 (JWT extraction) can run in parallel with T015, T016, T017 (error handlers)
- **User Story 2**:
  - T019, T020, T021, T022 (all models) can run in parallel
  - T030-T035 (all endpoints) can run in parallel after service layer complete
  - T037, T038, T039 (validation and error handling) can run in parallel
- **User Story 3**: T040, T041 (connection management) can run in parallel
- **Polish Phase**: T046, T047, T048, T050, T051 can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all Pydantic models together:
Task: "Create TaskCreate Pydantic model in backend/src/models/task.py"
Task: "Create TaskUpdate Pydantic model in backend/src/models/task.py"
Task: "Create TaskRead Pydantic model in backend/src/models/task.py"

# After service layer is complete, launch all endpoints together:
Task: "Implement GET /api/tasks endpoint"
Task: "Implement POST /api/tasks endpoint"
Task: "Implement GET /api/tasks/{id} endpoint"
Task: "Implement PUT /api/tasks/{id} endpoint"
Task: "Implement DELETE /api/tasks/{id} endpoint"
Task: "Implement PATCH /api/tasks/{id}/complete endpoint"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T012-T018)
4. **STOP and VALIDATE**: Test authentication works (401 for no token, 403 for wrong user)
5. This gives you a secure foundation but no task operations yet

### Recommended: MVP with Basic Functionality (US1 + US2)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011)
3. Complete Phase 3: User Story 1 (T012-T018)
4. Complete Phase 4: User Story 2 (T019-T039)
5. **STOP and VALIDATE**: Test full CRUD operations with authentication
6. Deploy/demo - this is a fully functional task management API

### Full Implementation (All User Stories)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test authentication independently
3. Add User Story 2 → Test CRUD operations independently → Deploy/Demo (MVP!)
4. Add User Story 3 → Test persistence and reliability → Deploy/Demo
5. Add Polish phase → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T011)
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T018)
3. Once US1 is done:
   - Developer A: User Story 2 models (T019-T022)
   - Developer B: User Story 2 service layer (T023-T028) - waits for models
4. Once service layer done:
   - Developer A: Endpoints T030, T032, T034
   - Developer B: Endpoints T031, T033, T035
   - Developer C: Validation and error handling (T037-T039)
5. Once US2 done:
   - Developer A: User Story 3 (T040-T045)
6. Polish phase can be distributed across team

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Sequential dependencies**: US2 depends on US1 (needs auth), US3 depends on US2 (needs CRUD)
- **File paths**: All paths include exact file locations per plan.md structure
- **Validation**: Each checkpoint allows independent testing of that user story
- **Commit strategy**: Commit after each task or logical group of parallel tasks
- **Testing**: Tests not included per specification (not explicitly requested)
- **MVP scope**: Phases 1-4 (Setup + Foundational + US1 + US2) provide fully functional API
- **Production ready**: All phases including Polish provide production-grade implementation

---

## Task Count Summary

- **Total Tasks**: 55
- **Setup Phase**: 5 tasks
- **Foundational Phase**: 6 tasks (BLOCKS all user stories)
- **User Story 1 (P1)**: 7 tasks (Authentication & Authorization)
- **User Story 2 (P2)**: 21 tasks (CRUD Operations)
- **User Story 3 (P3)**: 6 tasks (Persistence & Reliability)
- **Polish Phase**: 10 tasks (Cross-cutting concerns)

**Parallel Opportunities**: 18 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-4 (39 tasks) deliver fully functional authenticated task management API

**Independent Test Criteria**:
- **US1**: Authentication works (401/403 responses correct)
- **US2**: All CRUD operations work with user isolation
- **US3**: Data persists across restarts, connections are reliable
