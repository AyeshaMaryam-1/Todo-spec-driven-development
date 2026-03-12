"""Unit tests for the UpdateTodo use case."""

import pytest
from src.todo_app.application.use_cases.update_todo import UpdateTodoUseCase, UpdateTodoRequest
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository
from src.todo_app.domain.entities import Todo


class TestUpdateTodoUseCase:
    def setup_method(self):
        """Set up a fresh repository and use case for each test."""
        self.repository = InMemoryTodoRepository()
        self.use_case = UpdateTodoUseCase(self.repository)

    def test_update_todo_successfully_modifies_todo(self):
        """Test updating a todo successfully modifies its properties."""
        # Add a todo first
        todo = Todo(id=0, title="Old title", description="Old description")
        added_todo = self.repository.add(todo)

        request = UpdateTodoRequest(
            todo_id=added_todo.id,
            title="New title",
            description="New description"
        )

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.title == "New title"
        assert response.todo.description == "New description"
        assert response.error is None

    def test_update_todo_with_only_title_successfully_modifies_title(self):
        """Test updating only the title of a todo."""
        # Add a todo first
        todo = Todo(id=0, title="Old title", description="Old description")
        added_todo = self.repository.add(todo)

        request = UpdateTodoRequest(
            todo_id=added_todo.id,
            title="New title"
        )

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.title == "New title"
        assert response.todo.description == "Old description"  # Should remain unchanged
        assert response.error is None

    def test_update_todo_with_only_description_successfully_modifies_description(self):
        """Test updating only the description of a todo."""
        # Add a todo first
        todo = Todo(id=0, title="Old title", description="Old description")
        added_todo = self.repository.add(todo)

        request = UpdateTodoRequest(
            todo_id=added_todo.id,
            description="New description"
        )

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.todo is not None
        assert response.todo.title == "Old title"  # Should remain unchanged
        assert response.todo.description == "New description"
        assert response.error is None

    def test_update_nonexistent_todo_returns_error(self):
        """Test updating a non-existent todo returns an error."""
        request = UpdateTodoRequest(
            todo_id=999,
            title="New title"
        )

        response = self.use_case.execute(request)

        assert response.success is False
        assert response.todo is None
        assert response.error is not None
        assert "not found" in response.error

    def test_update_todo_with_invalid_title_returns_error(self):
        """Test updating a todo with invalid title returns an error."""
        # Add a todo first
        todo = Todo(id=0, title="Old title")
        added_todo = self.repository.add(todo)

        request = UpdateTodoRequest(
            todo_id=added_todo.id,
            title=""  # Empty title is invalid
        )

        response = self.use_case.execute(request)

        assert response.success is False
        assert response.todo is None
        assert response.error is not None
        assert "Title cannot be empty" in response.error