"""Domain exceptions for the todo application."""


class TodoNotFoundException(Exception):
    """Raised when a requested todo is not found"""
    def __init__(self, todo_id: int):
        self.todo_id = todo_id
        super().__init__(f"Todo with ID {todo_id} not found")


class InvalidTodoDataException(Exception):
    """Raised when invalid data is provided for a todo"""
    def __init__(self, message: str):
        super().__init__(message)