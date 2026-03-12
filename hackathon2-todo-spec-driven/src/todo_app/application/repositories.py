"""Repository interfaces for the todo application."""

from abc import ABC, abstractmethod
from typing import List, Optional
from src.todo_app.domain.entities import Todo


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