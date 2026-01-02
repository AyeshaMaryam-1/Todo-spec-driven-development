# Todo App

A console-based todo application with in-memory storage built using clean architecture principles.

## Features

- Add todos with title and optional description
- View all todos with their completion status
- Update existing todos
- Delete todos
- Mark todos as complete/incomplete

## Installation

```bash
# Using UV (recommended)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
```

## Usage

```bash
# Run the CLI application
python -m src.todo_app.infrastructure.cli.main

# Or if installed as a package
todo-app
```

## Commands

- `add "title" ["description"]` - Add a new todo
- `list` - List all todos
- `update id "title" ["description"]` - Update a todo
- `delete id` - Delete a todo
- `complete id` - Mark/unmark a todo as complete
- `help` - Show available commands
- `exit` - Exit the application

## Architecture

The application follows clean architecture principles with four layers:

- **Domain**: Core business entities and rules
- **Application**: Use cases and business logic
- **Infrastructure**: External implementations (CLI, repositories)
- **Presentation**: User interface (CLI)

## Development

### Running Tests

```bash
pytest
```

### Project Structure

```
src/
├── todo_app/
│   ├── domain/          # Business entities
│   ├── application/     # Use cases
│   ├── infrastructure/  # External implementations
│   └── tests/          # Test files
```