"""DeleteTodo use case for the todo application."""

from dataclasses import dataclass
from typing import Optional
from src.todo_app.application.repositories import TodoRepository


@dataclass
class DeleteTodoRequest:
    todo_id: int


@dataclass
class DeleteTodoResponse:
    success: bool
    error: Optional[str] = None


class DeleteTodoUseCase:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def execute(self, request: DeleteTodoRequest) -> DeleteTodoResponse:
        success = self.repository.delete(request.todo_id)

        if not success:
            return DeleteTodoResponse(
                success=False,
                error=f"Todo with ID {request.todo_id} not found"
            )

        return DeleteTodoResponse(
            success=True
        )