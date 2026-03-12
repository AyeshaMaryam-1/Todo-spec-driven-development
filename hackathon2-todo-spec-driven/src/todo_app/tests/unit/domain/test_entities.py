"""Unit tests for the Todo entity."""

import pytest
from datetime import datetime
from src.todo_app.domain.entities import Todo


class TestTodoEntity:
    def test_create_todo_with_valid_data(self):
        """Test creating a Todo with valid data."""
        todo = Todo(id=1, title="Test todo")

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.description is None
        assert todo.completed is False
        assert isinstance(todo.created_at, datetime)

    def test_create_todo_with_description(self):
        """Test creating a Todo with description."""
        todo = Todo(id=1, title="Test todo", description="Test description")

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.description == "Test description"
        assert todo.completed is False

    def test_create_todo_with_completed_status(self):
        """Test creating a Todo with completed status."""
        todo = Todo(id=1, title="Test todo", completed=True)

        assert todo.id == 1
        assert todo.title == "Test todo"
        assert todo.completed is True

    def test_create_todo_with_empty_title_raises_error(self):
        """Test creating a Todo with empty title raises ValueError."""
        with pytest.raises(ValueError, match="Title is required and cannot be empty"):
            Todo(id=1, title="")

    def test_create_todo_with_whitespace_only_title_raises_error(self):
        """Test creating a Todo with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError, match="Title is required and cannot be empty"):
            Todo(id=1, title="   ")

    def test_mark_complete_sets_completed_to_true(self):
        """Test marking a todo as complete."""
        todo = Todo(id=1, title="Test todo")

        todo.mark_complete()

        assert todo.completed is True

    def test_mark_incomplete_sets_completed_to_false(self):
        """Test marking a todo as incomplete."""
        todo = Todo(id=1, title="Test todo", completed=True)

        todo.mark_incomplete()

        assert todo.completed is False

    def test_update_title(self):
        """Test updating a todo's title."""
        todo = Todo(id=1, title="Old title")

        todo.update(title="New title")

        assert todo.title == "New title"

    def test_update_description(self):
        """Test updating a todo's description."""
        todo = Todo(id=1, title="Test todo", description="Old description")

        todo.update(description="New description")

        assert todo.description == "New description"

    def test_update_title_and_description(self):
        """Test updating both title and description."""
        todo = Todo(id=1, title="Old title", description="Old description")

        todo.update(title="New title", description="New description")

        assert todo.title == "New title"
        assert todo.description == "New description"

    def test_update_title_with_empty_string_raises_error(self):
        """Test updating a todo's title with empty string raises ValueError."""
        todo = Todo(id=1, title="Test todo")

        with pytest.raises(ValueError, match="Title cannot be empty"):
            todo.update(title="")

    def test_update_title_with_whitespace_only_raises_error(self):
        """Test updating a todo's title with whitespace-only raises ValueError."""
        todo = Todo(id=1, title="Test todo")

        with pytest.raises(ValueError, match="Title cannot be empty"):
            todo.update(title="   ")