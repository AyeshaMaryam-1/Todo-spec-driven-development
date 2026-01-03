"""Main CLI application for the todo application."""

import sys
from typing import List
from src.todo_app.infrastructure.repositories.in_memory_repository import InMemoryTodoRepository
from src.todo_app.application.use_cases.add_todo import AddTodoUseCase
from src.todo_app.application.use_cases.list_todos import ListTodosUseCase
from src.todo_app.application.use_cases.update_todo import UpdateTodoUseCase
from src.todo_app.application.use_cases.delete_todo import DeleteTodoUseCase
from src.todo_app.application.use_cases.complete_todo import CompleteTodoUseCase
from src.todo_app.infrastructure.cli.commands import TodoCLICommands


class TodoAppCLI:
    def __init__(self):
        # Initialize the repository
        self.repository = InMemoryTodoRepository()

        # Initialize use cases
        self.add_todo_use_case = AddTodoUseCase(self.repository)
        self.list_todos_use_case = ListTodosUseCase(self.repository)
        self.update_todo_use_case = UpdateTodoUseCase(self.repository)
        self.delete_todo_use_case = DeleteTodoUseCase(self.repository)
        self.complete_todo_use_case = CompleteTodoUseCase(self.repository)

        # Initialize commands
        self.commands = TodoCLICommands(
            self.add_todo_use_case,
            self.list_todos_use_case,
            self.update_todo_use_case,
            self.delete_todo_use_case,
            self.complete_todo_use_case
        )

    def run(self):
        print("=" * 50)
        print("           TODO APPLICATION")
        print("=" * 50)
        print("Welcome! Manage your tasks efficiently.")
        print("Type 'help' for available commands or 'exit' to quit.\n")

        while True:
            try:
                command_input = input(">>> ").strip()
                if not command_input:
                    print()  # Add empty line for better spacing
                    continue

                parts = command_input.split()
                command = parts[0].lower()

                if command == 'exit':
                    print("\nThank you for using Todo App. Goodbye!")
                    break
                elif command == 'help':
                    self.show_help()
                elif command == 'add':
                    self.handle_add(parts[1:])
                elif command == 'list':
                    self.handle_list(parts[1:])
                elif command == 'update':
                    self.handle_update(parts[1:])
                elif command == 'delete':
                    self.handle_delete(parts[1:])
                elif command == 'complete':
                    self.handle_complete(parts[1:])
                else:
                    print(f"\nUnknown command: '{command}'. Type 'help' for available commands.\n")
            except KeyboardInterrupt:
                print("\n\nThank you for using Todo App. Goodbye!")
                break
            except Exception as e:
                print(f"\nError: {e}\n")

    def show_help(self):
        help_text = """
╔══════════════════════════════════════════════════════════════╗
║                           HELP                             ║
╠══════════════════════════════════════════════════════════════╣
║  Commands:                                                 ║
║    add \"title\" [\"description\"]  - Add a new todo           ║
║    list                         - List all todos           ║
║    update id \"title\" [\"description\"] - Update a todo      ║
║    delete id                    - Delete a todo            ║
║    complete id                  - Mark/unmark as complete  ║
║    help                         - Show this help           ║
║    exit                         - Exit the application     ║
╚══════════════════════════════════════════════════════════════╝
        """
        print(help_text)

    def handle_add(self, args: List[str]):
        if len(args) < 1:
            print("\nUsage: add \"title\" [\"description\"]\n")
            return

        title = args[0].strip('"')
        description = args[1].strip('"') if len(args) > 1 else None

        result = self.commands.add_todo(title, description)
        print(f"\n{result}\n")

    def handle_list(self, args: List[str]):
        if len(args) > 0:
            print("\nUsage: list\n")
            return

        result = self.commands.list_todos()
        if result == "No todos found.":
            print(f"\n{result}\n")
        else:
            print(f"\n{'='*60}")
            print("YOUR TODOS")
            print('='*60)
            print(result)
            print('='*60 + "\n")

    def handle_update(self, args: List[str]):
        if len(args) < 2:
            print("\nUsage: update id \"title\" [\"description\"]\n")
            return

        try:
            todo_id = int(args[0])
        except ValueError:
            print("\nError: ID must be a number\n")
            return

        title = args[1].strip('"')
        description = args[2].strip('"') if len(args) > 2 else None

        result = self.commands.update_todo(todo_id, title, description)
        print(f"\n{result}\n")

    def handle_delete(self, args: List[str]):
        if len(args) != 1:
            print("\nUsage: delete id\n")
            return

        try:
            todo_id = int(args[0])
        except ValueError:
            print("\nError: ID must be a number\n")
            return

        result = self.commands.delete_todo(todo_id)
        print(f"\n{result}\n")

    def handle_complete(self, args: List[str]):
        if len(args) != 1:
            print("\nUsage: complete id\n")
            return

        try:
            todo_id = int(args[0])
        except ValueError:
            print("\nError: ID must be a number\n")
            return

        result = self.commands.complete_todo(todo_id)
        print(f"\n{result}\n")


def main():
    app = TodoAppCLI()
    app.run()


if __name__ == "__main__":
    main()
