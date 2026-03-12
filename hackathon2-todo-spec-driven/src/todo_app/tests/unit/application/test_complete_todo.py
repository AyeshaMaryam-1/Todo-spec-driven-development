"""Unit tests for the CompleteTodo use case."""

import pytest
from src.todo_app.application.use_cases.complete_todo import CompleteTodoUseCase, CompleteTodoRequest
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository
from src.todo_app.domain.entities import Todo


class TestCompleteTodoUseCase:
    def setup_method(self):
        """Set up a fresh repository and use case for each test."""
        self.repository = InMemoryTodoRepository()
        self.use_case = CompleteTodoUseCase(self.repository)

    def test_complete_todo_successfully_marks_todo_as_complete(self):
        """Test completing a todo successfully marks it as complete."""
        # Add a todo first
        todo = Todo(id=0, title="Test todo", completed=False)
        added_todo = self.repository.add(todo)

        request = CompleteTodoRequest(todo_id=added_todo.id)

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.completed is True
        assert response.error is None

    def test_complete_already_completed_todo_remains_completed(self):
        """Test completing an already completed todo."""
        # Add a completed todo first
        todo = Todo(id=0, title="Test todo", completed=True)
        added_todo = self.repository.add(todo)

        request = CompleteTodoRequest(todo_id=added_todo.id)

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.completed is True
        assert response.error is None

    def test_complete_nonexistent_todo_returns_error(self):
        """Test completing a non-existent todo returns an error."""
        request = CompleteTodoRequest(todo_id=999)

        response = self.use_case.execute(request)

        assert response.success is False
        assert response.todo is None
        assert response.error is not None
        assert "not found" in response.error