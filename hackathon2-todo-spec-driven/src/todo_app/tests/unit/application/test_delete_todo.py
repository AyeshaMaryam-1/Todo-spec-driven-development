"""Unit tests for the DeleteTodo use case."""

import pytest
from src.todo_app.application.use_cases.delete_todo import DeleteTodoUseCase, DeleteTodoRequest
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository
from src.todo_app.domain.entities import Todo


class TestDeleteTodoUseCase:
    def setup_method(self):
        """Set up a fresh repository and use case for each test."""
        self.repository = InMemoryTodoRepository()
        self.use_case = DeleteTodoUseCase(self.repository)

    def test_delete_todo_successfully_removes_todo(self):
        """Test deleting a todo successfully removes it."""
        # Add a todo first
        todo = Todo(id=0, title="Test todo")
        added_todo = self.repository.add(todo)

        request = DeleteTodoRequest(todo_id=added_todo.id)

        response = self.use_case.execute(request)

        assert response.success is True
        assert response.error is None
        # Verify the todo was actually removed
        assert self.repository.get_by_id(added_todo.id) is None

    def test_delete_nonexistent_todo_returns_error(self):
        """Test deleting a non-existent todo returns an error."""
        request = DeleteTodoRequest(todo_id=999)

        response = self.use_case.execute(request)

        assert response.success is False
        assert response.error is not None
        assert "not found" in response.error