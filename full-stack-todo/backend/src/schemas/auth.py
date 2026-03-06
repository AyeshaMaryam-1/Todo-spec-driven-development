"""Pydantic models for authentication-related requests and responses."""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class TokenResponse(BaseModel):
    """Response model for authentication tokens."""

    access_token: str
    token_type: str = "bearer"


class UserAuthResponse(BaseModel):
    """Response model for user authentication data (without sensitive info)."""

    id: int
    email: EmailStr
    name: Optional[str] = None


class TokenPayload(BaseModel):
    """Payload model for JWT token."""

    sub: str
    user_id: int
    exp: datetime
    iat: datetime


class SignupRequest(BaseModel):
    """Request model for user signup."""

    email: EmailStr
    password: str
    name: Optional[str] = None

    @field_validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class SigninRequest(BaseModel):
    """Request model for user signin."""

    email: EmailStr
    password: str

    @field_validator('password')
    def validate_password(cls, v):
        """Validate password is not empty."""
        if not v or len(v.strip()) == 0:
            raise ValueError('Password is required')
        return v


class AuthResponse(BaseModel):
    """Response model for authentication endpoints."""

    user: UserAuthResponse
    token: str