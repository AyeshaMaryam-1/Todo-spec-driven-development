---
id: 2
title: Create Todo App Spec
stage: spec
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: todo-app
user: Claude Sonnet 4.5
command: sp.specify
labels: ["specification", "todo-app", "console-app", "python"]
links:
  spec: specs/todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/todo-app/spec.md
tests:
 - none
---

## Prompt

```
Project: Phase I – In-Memory Python Console Todo App

Objective:
Specify a basic-level, command-line Todo application in Python that stores all
tasks in memory and supports essential task management operations.

Target audience:
- Evaluators of agentic development workflows
- Python learners reviewing clean console app design

Core features (required):
- Add Todo (title, optional description, default incomplete)
- View Todos (ID, title, completion status)
- Update Todo (by ID, with validation)
- Delete Todo (by ID, with validation)
- Mark Todo as Complete (toggle status)

Non-functional requirements:
- In-memory storage only (no files, no databases)
- Clean, modular Python project structure
- Separation of CLI, domain logic, and storage
- Deterministic behavior and clear error handling

Technology constraints:
- Python 3.13+
- UV for environment management
- No external services or persistence

Agentic development constraints:
- All code generated via Claude Code
- No manual coding
- Specification must enable plan → tasks → implementation

Success criteria:
- All five features work correctly via console
- Application state exists only during runtime
- Code is readable and easy to extend

Not building:
- File or database storage
- Web/API interfaces
- Advanced todo features (priority, due dates, search)
```

## Response snapshot

Created a comprehensive specification for the Phase I In-Memory Python Console Todo App at specs/todo-app/spec.md. The specification includes:

1. Three user stories with priorities:
   - User Story 1: Add and View Todos (P1)
   - User Story 2: Update and Delete Todos (P2)
   - User Story 3: Mark Todos as Complete (P3)

2. Eight functional requirements (FR-001 to FR-008) covering all core features

3. Key entity definition for Todo with id, title, description, and completed attributes

4. Five non-functional requirements (NFR-001 to NFR-005) including in-memory storage and clean architecture

5. Six technology constraints (TC-001 to TC-006) specifying Python 3.13+, UV, and exclusions

6. Three agentic development constraints (ADC-001 to ADC-003) for Claude Code usage

7. Eight success criteria (SC-001 to SC-008) with measurable outcomes

8. Clear definition of what's not being built

The specification is structured to enable the plan → tasks → implementation workflow as required.

## Outcome

- ✅ Impact: Created complete specification for todo app that enables SDD workflow
- 🧪 Tests: N/A (specification phase)
- 📁 Files: Created specs/todo-app/spec.md
- 🔁 Next prompts: Can proceed to plan generation with /sp.plan
- 🧠 Reflection: Specification comprehensively covers all requirements and constraints from the original request

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate implementation plan with /sp.plan