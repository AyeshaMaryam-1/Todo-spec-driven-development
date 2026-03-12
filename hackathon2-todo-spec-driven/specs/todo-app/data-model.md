# Data Model: todo-app

## Domain Entities

### Todo Entity
```python
from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Todo:
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = None

    def __post_init__(self):
        if not self.title or not self.title.strip():
            raise ValueError("Title is required and cannot be empty")
        if self.created_at is None:
            from datetime import datetime
            self.created_at = datetime.now()

    def mark_complete(self):
        self.completed = True

    def mark_incomplete(self):
        self.completed = False

    def update(self, title: Optional[str] = None, description: Optional[str] = None):
        if title is not None:
            if not title.strip():
                raise ValueError("Title cannot be empty")
            self.title = title
        if description is not None:
            self.description = description
```

## Repository Interface

### TodoRepository Protocol
```python
from abc import ABC, abstractmethod
from typing import List, Optional
from todo_app.domain.entities import Todo

class TodoRepository(ABC):

    @abstractmethod
    def add(self, todo: Todo) -> Todo:
        """Add a new todo and return it with assigned ID"""
        pass

    @abstractmethod
    def get_by_id(self, todo_id: int) -> Optional[Todo]:
        """Get a todo by its ID, return None if not found"""
        pass

    @abstractmethod
    def list_all(self) -> List[Todo]:
        """Get all todos"""
        pass

    @abstractmethod
    def update(self, todo_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Optional[Todo]:
        """Update a todo by ID, return updated todo or None if not found"""
        pass

    @abstractmethod
    def delete(self, todo_id: int) -> bool:
        """Delete a todo by ID, return True if successful"""
        pass

    @abstractmethod
    def mark_complete(self, todo_id: int) -> Optional[Todo]:
        """Mark a todo as complete by ID, return updated todo or None if not found"""
        pass
```

## Use Case Request/Response Models

### AddTodo Request
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class AddTodoRequest:
    title: str
    description: Optional[str] = None
```

### AddTodo Response
```python
from dataclasses import dataclass
from typing import Optional
from todo_app.domain.entities import Todo

@dataclass
class AddTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False
```

### ListTodos Response
```python
from dataclasses import dataclass
from typing import List, Optional
from todo_app.domain.entities import Todo

@dataclass
class ListTodosResponse:
    todos: List[Todo]
    error: Optional[str] = None
    success: bool = True
```

### UpdateTodo Request
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class UpdateTodoRequest:
    todo_id: int
    title: Optional[str] = None
    description: Optional[str] = None
```

### UpdateTodo Response
```python
from dataclasses import dataclass
from typing import Optional
from todo_app.domain.entities import Todo

@dataclass
class UpdateTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False
```

### DeleteTodo Request
```python
from dataclasses import dataclass

@dataclass
class DeleteTodoRequest:
    todo_id: int
```

### DeleteTodo Response
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class DeleteTodoResponse:
    success: bool
    error: Optional[str] = None
```

### CompleteTodo Request
```python
from dataclasses import dataclass

@dataclass
class CompleteTodoRequest:
    todo_id: int
    complete: bool = True
```

### CompleteTodo Response
```python
from dataclasses import dataclass
from typing import Optional
from todo_app.domain.entities import Todo

@dataclass
class CompleteTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False
```

## Domain Exceptions

### TodoNotFoundException
```python
class TodoNotFoundException(Exception):
    """Raised when a requested todo is not found"""
    def __init__(self, todo_id: int):
        self.todo_id = todo_id
        super().__init__(f"Todo with ID {todo_id} not found")
```

### InvalidTodoDataException
```python
class InvalidTodoDataException(Exception):
    """Raised when invalid data is provided for a todo"""
    def __init__(self, message: str):
        super().__init__(message)
```