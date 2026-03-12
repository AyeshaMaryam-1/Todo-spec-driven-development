"""Domain entities for the todo application."""

from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Todo:
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = None

    def __post_init__(self):
        if not self.title or not self.title.strip():
            raise ValueError("Title is required and cannot be empty")
        if self.created_at is None:
            self.created_at = datetime.now()

    def mark_complete(self):
        self.completed = True

    def mark_incomplete(self):
        self.completed = False

    def update(self, title: Optional[str] = None, description: Optional[str] = None):
        if title is not None:
            if not title.strip():
                raise ValueError("Title cannot be empty")
            self.title = title
        if description is not None:
            self.description = description