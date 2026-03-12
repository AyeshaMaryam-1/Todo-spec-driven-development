"""In-memory repository implementation for the todo application."""

from typing import List, Optional
from src.todo_app.domain.entities import Todo
from src.todo_app.application.repositories import TodoRepository
from src.todo_app.domain.exceptions import TodoNotFoundException


class InMemoryTodoRepository(TodoRepository):
    def __init__(self):
        self._todos: dict[int, Todo] = {}
        self._next_id = 1

    def add(self, todo: Todo) -> Todo:
        """Add a new todo and return it with assigned ID"""
        todo_id = self._next_id
        self._next_id += 1
        todo.id = todo_id
        self._todos[todo_id] = todo
        return todo

    def get_by_id(self, todo_id: int) -> Optional[Todo]:
        """Get a todo by its ID, return None if not found"""
        return self._todos.get(todo_id)

    def list_all(self) -> List[Todo]:
        """Get all todos"""
        return list(self._todos.values())

    def update(self, todo_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Optional[Todo]:
        """Update a todo by ID, return updated todo or None if not found"""
        if todo_id not in self._todos:
            return None

        todo = self._todos[todo_id]
        todo.update(title, description)
        return todo

    def delete(self, todo_id: int) -> bool:
        """Delete a todo by ID, return True if successful"""
        if todo_id in self._todos:
            del self._todos[todo_id]
            return True
        return False

    def mark_complete(self, todo_id: int) -> Optional[Todo]:
        """Mark a todo as complete by ID, return updated todo or None if not found"""
        if todo_id not in self._todos:
            return None

        todo = self._todos[todo_id]
        todo.mark_complete()
        return todo