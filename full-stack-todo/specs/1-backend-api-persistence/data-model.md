# Data Model Specification

**Feature**: Backend API & Data Persistence
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document defines the data models for the Backend API & Data Persistence feature. All models are implemented using SQLModel, which combines SQLAlchemy ORM with Pydantic validation.

## Entity Definitions

### Task Entity

**Purpose**: Represents a todo item owned by a specific user.

**Table Name**: `tasks`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier for the task |
| title | String(255) | Required, Not Null, Max 255 chars | Task title/summary |
| description | Text | Optional, Nullable | Detailed task description |
| completed | Boolean | Required, Default: False | Completion status |
| user_id | Integer | Required, Not Null, Foreign Key | Owner of the task |
| created_at | DateTime | Required, Auto-generated | Timestamp when task was created |
| updated_at | DateTime | Required, Auto-updated | Timestamp when task was last modified |

**Relationships**:
- `user_id` → References User entity (many-to-one)
- One user can have many tasks
- Each task belongs to exactly one user

**Indexes**:
- Primary index on `id`
- Index on `user_id` (for efficient filtering)
- Composite index on `(user_id, created_at)` (for ordered retrieval)

**Validation Rules**:
1. **Title Validation**:
   - Must not be empty or whitespace-only
   - Maximum length: 255 characters
   - Required field (cannot be null)

2. **Description Validation**:
   - Optional field (can be null or empty)
   - No maximum length constraint
   - Defaults to null if not provided

3. **Completed Validation**:
   - Must be boolean (true/false)
   - Defaults to false for new tasks
   - Cannot be null

4. **User ID Validation**:
   - Must be a positive integer
   - Must reference an existing user
   - Required field (cannot be null)
   - Immutable after creation (cannot change task ownership)

5. **Timestamp Validation**:
   - `created_at` set automatically on creation
   - `updated_at` set automatically on creation and updates
   - Both stored in UTC timezone
   - Cannot be manually set or modified

**State Transitions**:
- New task: `completed = False`
- Mark complete: `completed = False → True`
- Mark incomplete: `completed = True → False`
- Toggle: `completed = !completed`

**SQLModel Implementation**:

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "completed": False,
                "user_id": 123,
                "created_at": "2026-02-08T10:30:00Z",
                "updated_at": "2026-02-08T10:30:00Z"
            }
        }
```

---

### User Entity (Reference Only)

**Purpose**: Represents a user who owns tasks. This entity is managed by the authentication system and only referenced by the Task entity.

**Table Name**: `users`

**Fields** (minimal reference):

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key | Unique identifier for the user |
| email | String | Unique, Not Null | User's email address |
| name | String | Optional | User's display name |

**Note**: The User entity is not fully managed by this backend. It exists in the authentication system database. The Task entity only stores `user_id` as a foreign key reference.

**SQLModel Implementation** (reference only):

```python
from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, nullable=False)
    name: Optional[str] = Field(default=None)
```

---

## Request/Response Models

### TaskCreate (Request Model)

**Purpose**: Data required to create a new task.

**Fields**:
- `title`: string (required, max 255 chars)
- `description`: string (optional)

**Validation**:
- Title must not be empty
- Title must not exceed 255 characters

**Example**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API"
}
```

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    title: str = Field(..., max_length=255, min_length=1)
    description: Optional[str] = None

    @validator('title')
    def title_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
```

---

### TaskUpdate (Request Model)

**Purpose**: Data that can be updated on an existing task.

**Fields**:
- `title`: string (optional, max 255 chars)
- `description`: string (optional)
- `completed`: boolean (optional)

**Validation**:
- If title provided, must not be empty
- If title provided, must not exceed 255 characters

**Example**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255, min_length=1)
    description: Optional[str] = None
    completed: Optional[bool] = None

    @validator('title')
    def title_not_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Title cannot be empty')
        return v.strip() if v else v
```

---

### TaskRead (Response Model)

**Purpose**: Complete task data returned to clients.

**Fields**:
- `id`: integer (task identifier)
- `title`: string (task title)
- `description`: string or null (task description)
- `completed`: boolean (completion status)
- `user_id`: integer (owner identifier)
- `created_at`: datetime (creation timestamp)
- `updated_at`: datetime (last update timestamp)

**Example**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "completed": false,
  "user_id": 123,
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-08T10:30:00Z"
}
```

**Pydantic Model**:
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Allow creation from ORM models
```

---

## Database Schema

### DDL (Data Definition Language)

```sql
-- Users table (managed by auth system, included for reference)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255)
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Data Integrity Rules

### Referential Integrity
1. **Task → User**: Each task must reference a valid user
2. **Cascade Delete**: If user deleted, all their tasks are deleted (ON DELETE CASCADE)
3. **No Orphans**: Tasks cannot exist without a user

### Business Rules
1. **Ownership Immutability**: Once created, a task's `user_id` cannot be changed
2. **Title Required**: Tasks must always have a non-empty title
3. **Completion Binary**: Tasks are either completed (true) or not (false), no intermediate states
4. **Timestamp Accuracy**: Timestamps must reflect actual creation/update times

### Validation Enforcement
1. **Database Level**: NOT NULL constraints, foreign keys, check constraints
2. **ORM Level**: SQLModel field constraints and defaults
3. **API Level**: Pydantic validation on request models
4. **Service Level**: Business logic validation (ownership checks)

---

## Migration Strategy

### Initial Schema Creation

```python
# database/init_db.py
from sqlmodel import SQLModel, create_engine
from models.task import Task
from models.user import User

def init_database(database_url: str):
    engine = create_engine(database_url)
    SQLModel.metadata.create_all(engine)
```

### Future Migrations

For schema changes, use Alembic:
1. Generate migration: `alembic revision --autogenerate -m "description"`
2. Review migration file
3. Apply migration: `alembic upgrade head`
4. Rollback if needed: `alembic downgrade -1`

---

## Query Patterns

### Common Queries

**List user's tasks (ordered by creation date)**:
```python
tasks = session.query(Task)\
    .filter(Task.user_id == user_id)\
    .order_by(Task.created_at.desc())\
    .all()
```

**Get specific task with ownership check**:
```python
task = session.query(Task)\
    .filter(Task.id == task_id, Task.user_id == user_id)\
    .first()
```

**Create task**:
```python
task = Task(
    title=data.title,
    description=data.description,
    user_id=user_id
)
session.add(task)
session.commit()
session.refresh(task)
```

**Update task**:
```python
task = session.query(Task)\
    .filter(Task.id == task_id, Task.user_id == user_id)\
    .first()
if task:
    task.title = data.title
    task.description = data.description
    task.completed = data.completed
    session.commit()
    session.refresh(task)
```

**Delete task**:
```python
task = session.query(Task)\
    .filter(Task.id == task_id, Task.user_id == user_id)\
    .first()
if task:
    session.delete(task)
    session.commit()
```

**Toggle completion**:
```python
task = session.query(Task)\
    .filter(Task.id == task_id, Task.user_id == user_id)\
    .first()
if task:
    task.completed = not task.completed
    session.commit()
    session.refresh(task)
```

---

## Performance Considerations

### Indexing Strategy
1. **Primary Key (id)**: Automatic index for fast lookups
2. **User ID**: Index for efficient filtering by user
3. **Composite (user_id, created_at)**: Index for ordered retrieval

### Query Optimization
1. **Always filter by user_id**: Reduces result set size
2. **Use indexes**: Queries leverage user_id index
3. **Limit results**: Add pagination for large task lists (future)
4. **Select specific fields**: Avoid SELECT * in production

### Connection Pooling
- SQLModel/SQLAlchemy handles connection pooling
- Configure pool size based on expected concurrency
- Default pool size: 5 connections

---

## Testing Data

### Sample Data for Testing

```python
# Sample users
user1 = User(id=1, email="alice@example.com", name="Alice")
user2 = User(id=2, email="bob@example.com", name="Bob")

# Sample tasks for user1
task1 = Task(
    id=1,
    title="Complete project documentation",
    description="Write comprehensive docs",
    completed=False,
    user_id=1
)

task2 = Task(
    id=2,
    title="Review pull requests",
    description=None,
    completed=True,
    user_id=1
)

# Sample tasks for user2
task3 = Task(
    id=3,
    title="Deploy to production",
    description="Deploy v2.0 release",
    completed=False,
    user_id=2
)
```

### Test Scenarios
1. **Valid Creation**: Create task with valid title and description
2. **Empty Title**: Attempt to create task with empty title (should fail)
3. **Long Title**: Attempt to create task with 256+ char title (should fail)
4. **Cross-User Access**: User 1 attempts to access User 2's task (should fail)
5. **Update Ownership**: Attempt to change task's user_id (should fail)
6. **Timestamp Accuracy**: Verify created_at and updated_at are set correctly

---

## Conclusion

The data model provides a solid foundation for task management with strict user isolation. All validation rules are enforced at multiple levels (database, ORM, API) to ensure data integrity. The schema is optimized for the expected query patterns and supports efficient filtering by user.

**Key Features**:
- Strong typing with SQLModel
- Multi-level validation
- Automatic timestamp management
- Efficient indexing for user-scoped queries
- Referential integrity with foreign keys
- Clear separation between request/response models

**Next Steps**: Use this data model specification to implement the SQLModel classes and database initialization scripts.
