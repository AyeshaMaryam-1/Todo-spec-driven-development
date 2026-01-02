"""CLI commands for the todo application."""

from typing import Optional
from src.todo_app.application.use_cases.add_todo import AddTodoUseCase, AddTodoRequest
from src.todo_app.application.use_cases.list_todos import ListTodosUseCase
from src.todo_app.application.use_cases.update_todo import UpdateTodoUseCase, UpdateTodoRequest
from src.todo_app.application.use_cases.delete_todo import DeleteTodoUseCase, DeleteTodoRequest
from src.todo_app.application.use_cases.complete_todo import CompleteTodoUseCase, CompleteTodoRequest


class TodoCLICommands:
    def __init__(
        self,
        add_todo_use_case: AddTodoUseCase,
        list_todos_use_case: ListTodosUseCase,
        update_todo_use_case: UpdateTodoUseCase,
        delete_todo_use_case: DeleteTodoUseCase,
        complete_todo_use_case: CompleteTodoUseCase
    ):
        self.add_todo_use_case = add_todo_use_case
        self.list_todos_use_case = list_todos_use_case
        self.update_todo_use_case = update_todo_use_case
        self.delete_todo_use_case = delete_todo_use_case
        self.complete_todo_use_case = complete_todo_use_case

    def add_todo(self, title: str, description: Optional[str] = None) -> str:
        request = AddTodoRequest(title=title, description=description)
        response = self.add_todo_use_case.execute(request)

        if response.success:
            return f"Added todo #{response.todo.id}: {response.todo.title}"
        else:
            return f"Error: {response.error}"

    def list_todos(self) -> str:
        response = self.list_todos_use_case.execute()

        if not response.success:
            return f"Error: {response.error}"

        if not response.todos:
            return "No todos found."

        result = []
        for todo in response.todos:
            status = "x" if todo.completed else " "
            description = f" - {todo.description}" if todo.description else ""
            result.append(f"{todo.id}. [{status}] {todo.title}{description}")

        return "\n".join(result)

    def update_todo(self, todo_id: int, title: Optional[str] = None, description: Optional[str] = None) -> str:
        request = UpdateTodoRequest(todo_id=todo_id, title=title, description=description)
        response = self.update_todo_use_case.execute(request)

        if response.success:
            return f"Updated todo #{response.todo.id}"
        else:
            return f"Error: {response.error}"

    def delete_todo(self, todo_id: int) -> str:
        request = DeleteTodoRequest(todo_id=todo_id)
        response = self.delete_todo_use_case.execute(request)

        if response.success:
            return f"Deleted todo #{todo_id}"
        else:
            return f"Error: {response.error}"

    def complete_todo(self, todo_id: int) -> str:
        request = CompleteTodoRequest(todo_id=todo_id)
        response = self.complete_todo_use_case.execute(request)

        if response.success:
            status = "complete" if response.todo.completed else "incomplete"
            return f"Todo #{response.todo.id} marked as {status}"
        else:
            return f"Error: {response.error}"