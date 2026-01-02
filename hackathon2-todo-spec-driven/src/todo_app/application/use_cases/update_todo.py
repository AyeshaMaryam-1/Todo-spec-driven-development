"""UpdateTodo use case for the todo application."""

from dataclasses import dataclass
from typing import Optional
from src.todo_app.domain.entities import Todo
from src.todo_app.application.repositories import TodoRepository


@dataclass
class UpdateTodoRequest:
    todo_id: int
    title: Optional[str] = None
    description: Optional[str] = None


@dataclass
class UpdateTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False


class UpdateTodoUseCase:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def execute(self, request: UpdateTodoRequest) -> UpdateTodoResponse:
        try:
            updated_todo = self.repository.update(
                request.todo_id,
                request.title,
                request.description
            )

            if updated_todo is None:
                return UpdateTodoResponse(
                    todo=None,
                    error=f"Todo with ID {request.todo_id} not found",
                    success=False
                )

            return UpdateTodoResponse(
                todo=updated_todo,
                success=True
            )
        except ValueError as e:
            return UpdateTodoResponse(
                todo=None,
                error=str(e),
                success=False
            )