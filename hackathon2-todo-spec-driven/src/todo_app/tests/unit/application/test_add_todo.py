"""Unit tests for the AddTodo use case."""

import pytest
from src.todo_app.application.use_cases.add_todo import AddTodoUseCase, AddTodoRequest
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository


class TestAddTodoUseCase:
    def setup_method(self):
        """Set up a fresh repository and use case for each test."""
        self.repository = InMemoryTodoRepository()
        self.use_case = AddTodoUseCase(self.repository)

    def test_add_todo_successfully_creates_todo(self):
        """Test adding a todo successfully creates and returns the todo."""
        request = AddTodoRequest(title="Test todo")

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.title == "Test todo"
        assert response.error is None

    def test_add_todo_with_description_successfully_creates_todo(self):
        """Test adding a todo with description successfully creates and returns the todo."""
        request = AddTodoRequest(title="Test todo", description="Test description")

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.title == "Test todo"
        assert response.todo.description == "Test description"
        assert response.error is None

    def test_add_todo_with_invalid_data_returns_error(self):
        """Test adding a todo with invalid data returns an error."""
        request = AddTodoRequest(title="")  # Empty title is invalid

        response = self.use_case.execute(request)

        assert response.success is False
        assert response.todo is None
        assert response.error is not None
        assert "Title is required" in response.error