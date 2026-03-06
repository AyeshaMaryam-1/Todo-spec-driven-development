"""Task service layer - business logic for task operations."""
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from ..models.task import Task
from ..schemas import TaskCreate, TaskUpdate, TaskRead


def _format_datetime(dt: datetime) -> str:
    """Format datetime as UTC ISO 8601 string with Z suffix."""
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'


def _task_to_read(task: Task) -> TaskRead:
    """Convert Task model to TaskRead schema with formatted timestamps."""
    return TaskRead(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=task.user_id,
        created_at=_format_datetime(task.created_at),
        updated_at=_format_datetime(task.updated_at),
    )


def create_task(session: Session, task_data: TaskCreate, user_id: int) -> TaskRead:
    """
    Create a new task for the specified user.

    Args:
        session: Database session
        task_data: Task creation data
        user_id: ID of the user creating the task

    Returns:
        TaskRead: Created task object with formatted timestamps
    """
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=user_id,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return _task_to_read(task)


def get_tasks_by_user(session: Session, user_id: int) -> List[TaskRead]:
    """
    Get all tasks for a specific user.

    Args:
        session: Database session
        user_id: ID of the user

    Returns:
        List[TaskRead]: List of tasks ordered by created_at descending
    """
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    )
    tasks = session.exec(statement).all()
    return [_task_to_read(task) for task in tasks]


def get_task_by_id(session: Session, task_id: int, user_id: int) -> Optional[Task]:
    """
    Get a specific task by ID, ensuring it belongs to the user.

    Args:
        session: Database session
        task_id: ID of the task
        user_id: ID of the user (for ownership verification)

    Returns:
        Optional[Task]: Task object if found and owned by user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()
    return task


def update_task(
    session: Session, task_id: int, user_id: int, task_data: TaskUpdate
) -> Optional[TaskRead]:
    """
    Update a task, ensuring it belongs to the user.

    Args:
        session: Database session
        task_id: ID of the task to update
        user_id: ID of the user (for ownership verification)
        task_data: Updated task data

    Returns:
        Optional[TaskRead]: Updated task object if found and owned by user, None otherwise
    """
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return None

    # Update only provided fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return _task_to_read(task)


def delete_task(session: Session, task_id: int, user_id: int) -> bool:
    """
    Delete a task, ensuring it belongs to the user.

    Args:
        session: Database session
        task_id: ID of the task to delete
        user_id: ID of the user (for ownership verification)

    Returns:
        bool: True if task was deleted, False if not found or not owned by user
    """
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return False

    session.delete(task)
    session.commit()
    return True


def toggle_task_completion(session: Session, task_id: int, user_id: int) -> Optional[TaskRead]:
    """
    Toggle the completion status of a task.

    Args:
        session: Database session
        task_id: ID of the task to toggle
        user_id: ID of the user (for ownership verification)

    Returns:
        Optional[TaskRead]: Updated task object if found and owned by user, None otherwise
    """
    task = get_task_by_id(session, task_id, user_id)
    if not task:
        return None

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)
    return _task_to_read(task)
