# Data Model: Todo Full-Stack Web Application

**Feature**: 1-todo-full-stack
**Date**: 2026-02-05
**Based on**: Feature spec functional requirements and research findings

## Entity Definitions

### User Entity
- **Attributes**:
  - id (UUID/Integer): Unique identifier for the user
  - email (String): User's email address (unique, validated)
  - name (String): User's display name (optional)
  - created_at (DateTime): Timestamp when user account was created
  - updated_at (DateTime): Timestamp when user account was last updated
- **Relationships**:
  - One-to-many with Task (user has many tasks)
- **Validation Rules**:
  - Email must be a valid email format
  - Email must be unique across all users
  - Email is required for registration
- **State Transitions**:
  - Unregistered → Registered (via signup process)
  - Active → Deactivated (future enhancement, not in scope)

### Task Entity
- **Attributes**:
  - id (UUID/Integer): Unique identifier for the task
  - title (String): Task title/summary (required)
  - description (Text): Detailed task description (optional)
  - completed (Boolean): Whether the task is completed (default: false)
  - user_id (UUID/Integer): Foreign key to the owning user
  - created_at (DateTime): Timestamp when task was created
  - updated_at (DateTime): Timestamp when task was last updated
- **Relationships**:
  - Many-to-one with User (task belongs to one user)
- **Validation Rules**:
  - Title is required and non-empty
  - User_id must correspond to an existing user
  - Title length between 1-255 characters
- **State Transitions**:
  - Incomplete → Completed (when task completed)
  - Completed → Incomplete (when task uncompleted)

## Database Schema (SQLModel)

### User Table
```
users
├── id (primary key, UUID/Integer)
├── email (string, unique, not null)
├── name (string, nullable)
├── created_at (datetime, not null)
└── updated_at (datetime, not null)
```

### Task Table
```
tasks
├── id (primary key, UUID/Integer)
├── title (string, not null)
├── description (text, nullable)
├── completed (boolean, not null, default false)
├── user_id (foreign key, references users.id)
├── created_at (datetime, not null)
└── updated_at (datetime, not null)
```

## Relationships & Constraints

- **Foreign Key Constraint**: tasks.user_id → users.id
- **Cascade Behavior**:
  - Deleting a user should cascade delete their tasks (to be confirmed)
  - Prevent deletion of user if tasks exist (alternative approach)
- **Indexing**:
  - Index on users.email for login performance
  - Index on tasks.user_id for user-specific queries
  - Index on tasks.completed for filtering

## API Access Patterns

- Retrieve all tasks for a specific user: `SELECT * FROM tasks WHERE user_id = ?`
- Retrieve specific task: `SELECT * FROM tasks WHERE id = ? AND user_id = ?`
- Create task: `INSERT INTO tasks (...) VALUES (...) WHERE user_id matches JWT`
- Update task: `UPDATE tasks SET ... WHERE id = ? AND user_id = ?`
- Delete task: `DELETE FROM tasks WHERE id = ? AND user_id = ?`

## Security Considerations

- All queries must be filtered by user_id from authenticated JWT
- Direct access to tasks without user_id filtering is forbidden
- Task retrieval always verifies user_id matches authenticated user
- Cross-user task access prevented at database and application layer