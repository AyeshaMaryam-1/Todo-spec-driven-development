"""Pydantic models for user-related requests and responses."""

from pydantic import BaseModel, EmailStr, field_validator, field_serializer
from typing import Optional
from datetime import datetime


def format_utc_datetime(dt: datetime) -> str:
    """Format datetime as UTC ISO 8601 string with Z suffix."""
    if dt is None:
        return ""
    # Ensure the datetime is formatted with 'Z' suffix to indicate UTC
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'


class UserBase(BaseModel):
    """Base model for user with common fields."""

    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    """Request model for creating a new user."""

    password: str

    @field_validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class UserUpdate(BaseModel):
    """Request model for updating user information."""

    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserRead(UserBase):
    """Response model for user data (without sensitive info)."""

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('created_at')
    def serialize_created_at(self, value: datetime) -> str:
        """Format created_at as UTC ISO 8601 string with Z suffix."""
        return format_utc_datetime(value)

    @field_serializer('updated_at')
    def serialize_updated_at(self, value: Optional[datetime]) -> str:
        """Format updated_at as UTC ISO 8601 string with Z suffix."""
        if value is None:
            return ""
        return format_utc_datetime(value)

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Request model for user login."""

    email: EmailStr
    password: str


class UserPasswordUpdate(BaseModel):
    """Request model for changing user password."""

    current_password: str
    new_password: str

    @field_validator('new_password')
    def validate_new_password(cls, v):
        """Validate new password strength."""
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v