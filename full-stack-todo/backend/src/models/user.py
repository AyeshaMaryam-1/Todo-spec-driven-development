"""User model."""
from sqlmodel import SQLModel, Field
from typing import Optional


class User(SQLModel, table=True):
    """
    User model for authentication and task ownership.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(nullable=False, unique=True, index=True)
    name: Optional[str] = Field(default=None)
    password_hash: str = Field(nullable=False)  # Hashed password
