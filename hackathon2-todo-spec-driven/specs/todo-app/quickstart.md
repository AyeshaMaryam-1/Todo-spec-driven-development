# Quickstart: todo-app

## Setup

### Prerequisites
- Python 3.13 or higher
- UV package manager

### Environment Setup
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies using UV:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -e .
   ```

## Running the Application

### Starting the CLI
```bash
python -m src.todo_app.infrastructure.cli.main
```

Or if installed as a package:
```bash
todo-app
```

## Usage

### Available Commands

#### Add a Todo
```bash
add "Buy groceries" "Milk, eggs, bread"
```
- Adds a new todo with title and optional description
- Returns the created todo with its ID

#### List Todos
```bash
list
```
- Shows all todos with their ID, title, and completion status

#### Update a Todo
```bash
update 1 "Updated title" "Updated description"
```
- Updates the title and/or description of a todo by ID
- Both title and description are optional, but at least one must be provided

#### Delete a Todo
```bash
delete 1
```
- Deletes a todo by ID
- Returns confirmation of deletion

#### Mark Todo as Complete/Incomplete
```bash
complete 1
```
- Toggles the completion status of a todo by ID
- If incomplete, marks as complete; if complete, marks as incomplete

#### Help
```bash
help
```
- Shows available commands and usage

#### Exit
```bash
exit
```
- Exits the application

## Example Workflow

```bash
$ python -m src.todo_app.infrastructure.cli.main
Todo App> add "Buy groceries" "Milk, eggs, bread"
Added todo #1: Buy groceries
Todo App> add "Walk the dog"
Added todo #2: Walk the dog
Todo App> list
1. [ ] Buy groceries - Milk, eggs, bread
2. [ ] Walk the dog
Todo App> complete 1
Todo #1 marked as complete
Todo App> list
1. [x] Buy groceries - Milk, eggs, bread
2. [ ] Walk the dog
Todo App> exit
$
```

## Development

### Running Tests
```bash
pytest
```

### Project Structure
- `src/todo_app/domain/` - Core business entities and rules
- `src/todo_app/application/` - Use cases and application services
- `src/todo_app/infrastructure/` - External implementations (CLI, repositories)
- `src/todo_app/tests/` - Unit and integration tests

### Architecture
The application follows clean architecture with:
- Domain layer containing business entities
- Application layer containing use cases
- Infrastructure layer handling external concerns (CLI, data storage)