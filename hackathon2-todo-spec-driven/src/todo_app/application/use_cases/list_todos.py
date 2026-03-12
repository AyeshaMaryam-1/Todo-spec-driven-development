"""ListTodos use case for the todo application."""

from dataclasses import dataclass
from typing import List, Optional
from src.todo_app.domain.entities import Todo
from src.todo_app.application.repositories import TodoRepository


@dataclass
class ListTodosResponse:
    todos: List[Todo]
    error: Optional[str] = None
    success: bool = True


class ListTodosUseCase:
    def __init__(self, repository: TodoRepository):
        self.repository = repository

    def execute(self) -> ListTodosResponse:
        try:
            todos = self.repository.list_all()
            return ListTodosResponse(
                todos=todos,
                success=True
            )
        except Exception as e:
            return ListTodosResponse(
                todos=[],
                error=str(e),
                success=False
            )