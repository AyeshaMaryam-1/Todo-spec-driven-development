"""CompleteTodo use case for the todo application."""

from dataclasses import dataclass
from typing import Optional
from src.todo_app.domain.entities import Todo
from src.todo_app.application.repositories import TodoRepository


@dataclass
class CompleteTodoRequest:
    todo_id: int
    complete: bool = True


@dataclass
class CompleteTodoResponse:
    todo: Optional[Todo]
    error: Optional[str] = None
    success: bool = False


class CompleteTodoUseCase:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def execute(self, request: CompleteTodoRequest) -> CompleteTodoResponse:
        updated_todo = self.repository.mark_complete(request.todo_id)

        if updated_todo is None:
            return CompleteTodoResponse(
                todo=None,
                error=f"Todo with ID {request.todo_id} not found",
                success=False
            )

        return CompleteTodoResponse(
            todo=updated_todo,
            success=True
        )