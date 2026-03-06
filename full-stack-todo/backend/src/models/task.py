"""Task model and Pydantic schemas."""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import validator


class Task(SQLModel, table=True):
    """
    Task database model.

    Represents a todo item belonging to a specific user.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(nullable=False, max_length=255, index=True)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, index=True)
    user_id: int = Field(foreign_key="user.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
