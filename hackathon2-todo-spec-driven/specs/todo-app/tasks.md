---
description: "Task list for Phase I In-Memory Python Console Todo App implementation"
---

# Tasks: todo-app

**Input**: Design documents from `/specs/todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Test tasks are included as specified in the functional requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are based on the specification and plan for the
  Phase I In-Memory Python Console Todo App.

  Tasks are organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in src/
- [X] T002 Initialize Python project with proper package structure in src/todo_app/
- [X] T003 [P] Configure basic project files (pyproject.toml, .gitignore, README.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create domain entities module at src/todo_app/domain/__init__.py
- [X] T005 Create Todo entity with id, title, description, completed fields at src/todo_app/domain/entities.py
- [X] T006 Create domain exceptions at src/todo_app/domain/exceptions.py
- [X] T007 Create repository interface at src/todo_app/application/repositories.py
- [X] T008 Create in-memory repository implementation at src/todo_app/infrastructure/repositories/in_memory_repository.py
- [X] T009 Create application layer structure at src/todo_app/application/__init__.py
- [X] T010 Create infrastructure layer structure at src/todo_app/infrastructure/__init__.py
- [X] T011 Create CLI layer structure at src/todo_app/infrastructure/cli/__init__.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Todos (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new todos and view them to keep track of their tasks.

**Independent Test**: The app should allow adding a todo with a title and optional description, and then display the list of todos with their IDs and completion status.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US1] Unit test for Todo entity creation in tests/unit/domain/test_entities.py
- [X] T013 [P] [US1] Unit test for in-memory repository add operation in tests/unit/infrastructure/test_in_memory_repository.py
- [X] T014 [P] [US1] Unit test for in-memory repository list operation in tests/unit/infrastructure/test_in_memory_repository.py

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement AddTodo use case in src/todo_app/application/use_cases/add_todo.py
- [X] T016 [P] [US1] Implement ListTodos use case in src/todo_app/application/use_cases/list_todos.py
- [X] T017 [US1] Implement CLI commands for add and list in src/todo_app/infrastructure/cli/commands.py
- [X] T018 [US1] Integrate add functionality in main CLI application in src/todo_app/infrastructure/cli/main.py
- [X] T019 [US1] Integrate list functionality in main CLI application in src/todo_app/infrastructure/cli/main.py
- [X] T020 [US1] Add error handling for invalid todo data in src/todo_app/domain/exceptions.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Delete Todos (Priority: P2)

**Goal**: Enable users to update and delete their todos to manage their task list effectively.

**Independent Test**: The app should allow updating a todo's title/description by ID and deleting a todo by ID with proper validation.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T021 [P] [US2] Unit test for in-memory repository update operation in tests/unit/infrastructure/test_in_memory_repository.py
- [X] T022 [P] [US2] Unit test for in-memory repository delete operation in tests/unit/infrastructure/test_in_memory_repository.py

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement UpdateTodo use case in src/todo_app/application/use_cases/update_todo.py
- [X] T024 [P] [US2] Implement DeleteTodo use case in src/todo_app/application/use_cases/delete_todo.py
- [X] T025 [US2] Implement CLI commands for update and delete in src/todo_app/infrastructure/cli/commands.py
- [X] T026 [US2] Integrate update functionality in main CLI application in src/todo_app/infrastructure/cli/main.py
- [X] T027 [US2] Integrate delete functionality in main CLI application in src/todo_app/infrastructure/cli/main.py
- [X] T028 [US2] Add validation for non-existent todos in src/todo_app/domain/exceptions.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Todos as Complete (Priority: P3)

**Goal**: Enable users to mark their todos as complete to track their progress.

**Independent Test**: The app should allow toggling the completion status of a todo by its ID.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T029 [P] [US3] Unit test for in-memory repository mark complete operation in tests/unit/infrastructure/test_in_memory_repository.py

### Implementation for User Story 3

- [X] T030 [P] [US3] Implement CompleteTodo use case in src/todo_app/application/use_cases/complete_todo.py
- [X] T031 [US3] Implement CLI command for complete in src/todo_app/infrastructure/cli/commands.py
- [X] T032 [US3] Integrate complete functionality in main CLI application in src/todo_app/infrastructure/cli/main.py
- [X] T033 [US3] Add toggle functionality for completion status in src/todo_app/domain/entities.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Documentation updates in README.md and docs/
- [X] T035 Code cleanup and refactoring
- [X] T036 Performance optimization across all stories
- [X] T037 [P] Additional unit tests (if requested) in tests/unit/
- [X] T038 Security hardening
- [X] T039 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit test for Todo entity creation in tests/unit/domain/test_entities.py"
Task: "Unit test for in-memory repository add operation in tests/unit/infrastructure/test_in_memory_repository.py"
Task: "Unit test for in-memory repository list operation in tests/unit/infrastructure/test_in_memory_repository.py"

# Launch all implementation tasks for User Story 1 together:
Task: "Implement AddTodo use case in src/todo_app/application/use_cases/add_todo.py"
Task: "Implement ListTodos use case in src/todo_app/application/use_cases/list_todos.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence