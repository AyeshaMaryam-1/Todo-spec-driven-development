"""AddTodo use case for the todo application."""

from dataclasses import dataclass
from typing import Optional
from src.todo_app.domain.entities import Todo
from src.todo_app.application.repositories import TodoRepository


@dataclass
class AddTodoRequest:
    title: str
    description: Optional[str] = None


@dataclass
class AddTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False


class AddTodoUseCase:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def execute(self, request: AddTodoRequest) -> AddTodoResponse:
        try:
            # Create a new todo without an ID (will be assigned by repository)
            new_todo = Todo(
                id=0,  # Will be assigned by repository
                title=request.title,
                description=request.description,
                completed=False
            )

            # Add the todo to the repository
            saved_todo = self.repository.add(new_todo)

            return AddTodoResponse(
                todo=saved_todo,
                success=True
            )
        except ValueError as e:
            return AddTodoResponse(
                todo=None,
                error=str(e),
                success=False
            )