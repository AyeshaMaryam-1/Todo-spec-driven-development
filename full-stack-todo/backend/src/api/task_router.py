"""Task API router - REST endpoints for task management."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ..database.connection import get_session
from ..middleware.jwt_auth import get_current_user
from ..models.task import Task
from ..schemas import TaskCreate, TaskUpdate, TaskRead
from ..services import task_service

router = APIRouter()


@router.get(
    "/tasks",
    response_model=List[TaskRead],
    summary="List all tasks",
    description="Get all tasks for the authenticated user, ordered by creation date (newest first)",
    response_description="List of tasks belonging to the authenticated user",
)
def list_tasks(
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Get all tasks for the authenticated user.

    Returns:
        List[TaskRead]: List of tasks ordered by created_at descending
    """
    tasks = task_service.get_tasks_by_user(session, user_id)
    return tasks


@router.post(
    "/tasks",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Create a new task for the authenticated user",
    response_description="The created task object",
)
def create_task(
    task_data: TaskCreate,
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data (title, description)

    Returns:
        TaskRead: Created task object

    Raises:
        HTTPException: 400 if validation fails
    """
    task = task_service.create_task(session, task_data, user_id)
    return task


@router.get(
    "/tasks/{task_id}",
    response_model=TaskRead,
    summary="Get a specific task",
    description="Retrieve a task by ID. Only returns tasks owned by the authenticated user.",
    response_description="The requested task object",
)
def get_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Get a specific task by ID.

    Args:
        task_id: ID of the task to retrieve

    Returns:
        TaskRead: Task object

    Raises:
        HTTPException: 404 if task not found
        HTTPException: 403 if task belongs to another user
    """
    task = task_service.get_task_by_id(session, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return task


@router.put(
    "/tasks/{task_id}",
    response_model=TaskRead,
    summary="Update a task",
    description="Update task properties (title, description, completed status)",
    response_description="The updated task object",
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Update a task.

    Args:
        task_id: ID of the task to update
        task_data: Updated task data (title, description, completed)

    Returns:
        TaskRead: Updated task object

    Raises:
        HTTPException: 404 if task not found
        HTTPException: 403 if task belongs to another user
        HTTPException: 400 if validation fails
    """
    task = task_service.update_task(session, task_id, user_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return task


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Permanently delete a task. Only the task owner can delete it.",
    response_description="No content (successful deletion)",
)
def delete_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Delete a task.

    Args:
        task_id: ID of the task to delete

    Returns:
        None (204 No Content)

    Raises:
        HTTPException: 404 if task not found
        HTTPException: 403 if task belongs to another user
    """
    success = task_service.delete_task(session, task_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return None


@router.patch(
    "/tasks/{task_id}/complete",
    response_model=TaskRead,
    summary="Toggle task completion",
    description="Toggle the completion status of a task (completed ↔ not completed)",
    response_description="The task with updated completion status",
)
def toggle_task_completion(
    task_id: int,
    user_id: int = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Toggle the completion status of a task.

    Args:
        task_id: ID of the task to toggle

    Returns:
        TaskRead: Updated task object with toggled completion status

    Raises:
        HTTPException: 404 if task not found
        HTTPException: 403 if task belongs to another user
    """
    task = task_service.toggle_task_completion(session, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return task
