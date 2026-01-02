"""Unit tests for the InMemoryTodoRepository."""

import pytest
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository
from src.todo_app.domain.entities import Todo


class TestInMemoryTodoRepository:
    def setup_method(self):
        """Set up a fresh repository for each test."""
        self.repository = InMemoryTodoRepository()

    def test_add_todo_assigns_id_and_returns_todo(self):
        """Test adding a todo assigns an ID and returns the todo."""
        todo = Todo(id=0, title="Test todo")

        result = self.repository.add(todo)

        assert result.id == 1  # First todo gets ID 1
        assert result.title == "Test todo"
        assert result.id in self.repository._todos

    def test_get_by_id_returns_existing_todo(self):
        """Test getting a todo by ID returns the correct todo."""
        todo = Todo(id=0, title="Test todo")
        added_todo = self.repository.add(todo)

        result = self.repository.get_by_id(added_todo.id)

        assert result is not None
        assert result.id == added_todo.id
        assert result.title == "Test todo"

    def test_get_by_id_returns_none_for_nonexistent_todo(self):
        """Test getting a non-existent todo by ID returns None."""
        result = self.repository.get_by_id(999)

        assert result is None

    def test_list_all_returns_all_todos(self):
        """Test listing all todos returns all added todos."""
        todo1 = Todo(id=0, title="Todo 1")
        todo2 = Todo(id=0, title="Todo 2")

        self.repository.add(todo1)
        self.repository.add(todo2)

        result = self.repository.list_all()

        assert len(result) == 2
        titles = [todo.title for todo in result]
        assert "Todo 1" in titles
        assert "Todo 2" in titles

    def test_list_all_returns_empty_list_when_no_todos(self):
        """Test listing all todos returns empty list when no todos exist."""
        result = self.repository.list_all()

        assert len(result) == 0

    def test_update_modifies_existing_todo(self):
        """Test updating an existing todo modifies its properties."""
        todo = Todo(id=0, title="Old title", description="Old description")
        added_todo = self.repository.add(todo)

        result = self.repository.update(added_todo.id, title="New title", description="New description")

        assert result is not None
        assert result.title == "New title"
        assert result.description == "New description"

    def test_update_returns_none_for_nonexistent_todo(self):
        """Test updating a non-existent todo returns None."""
        result = self.repository.update(999, title="New title")

        assert result is None

    def test_delete_removes_todo_and_returns_true(self):
        """Test deleting an existing todo removes it and returns True."""
        todo = Todo(id=0, title="Test todo")
        added_todo = self.repository.add(todo)

        result = self.repository.delete(added_todo.id)

        assert result is True
        assert self.repository.get_by_id(added_todo.id) is None

    def test_delete_returns_false_for_nonexistent_todo(self):
        """Test deleting a non-existent todo returns False."""
        result = self.repository.delete(999)

        assert result is False

    def test_mark_complete_sets_todo_as_completed(self):
        """Test marking a todo as complete updates its status."""
        todo = Todo(id=0, title="Test todo", completed=False)
        added_todo = self.repository.add(todo)

        result = self.repository.mark_complete(added_todo.id)

        assert result is not None
        assert result.completed is True

    def test_mark_complete_returns_none_for_nonexistent_todo(self):
        """Test marking a non-existent todo as complete returns None."""
        result = self.repository.mark_complete(999)

        assert result is None