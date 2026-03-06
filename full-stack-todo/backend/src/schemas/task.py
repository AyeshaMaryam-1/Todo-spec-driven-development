"""Pydantic models for task-related requests and responses."""

from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional
from datetime import datetime


def format_utc_datetime(dt: datetime) -> str:
    """Format datetime as UTC ISO 8601 string with Z suffix."""
    if dt is None:
        return ""
    # Ensure the datetime is formatted with 'Z' suffix to indicate UTC
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'


class TaskBase(BaseModel):
    """Base model for task with common fields."""

    title: str
    description: Optional[str] = None
    completed: bool = False


class TaskCreate(TaskBase):
    """Request model for creating a new task."""

    title: str

    @field_validator('title')
    def validate_title(cls, v):
        """Validate title is not empty."""
        if not v or len(v.strip()) == 0:
            raise ValueError('Title is required')
        if len(v) > 255:
            raise ValueError('Title must be less than 255 characters')
        return v.strip()


class TaskUpdate(BaseModel):
    """Request model for updating a task."""

    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

    @field_validator('title')
    def validate_title_optional(cls, v):
        """Validate title if provided."""
        if v is not None:
            if len(v.strip()) == 0:
                raise ValueError('Title cannot be empty')
            if len(v) > 255:
                raise ValueError('Title must be less than 255 characters')
            return v.strip()
        return v


class TaskRead(TaskBase):
    """Response model for task data."""

    id: int
    user_id: int
    created_at: str  # Changed to string to handle serialization manually
    updated_at: str

    model_config = ConfigDict(from_attributes=True)


class TaskToggle(BaseModel):
    """Request model for toggling task completion."""

    completed: bool


class TaskListResponse(BaseModel):
    """Response model for listing tasks."""

    tasks: list[TaskRead]
    total: int