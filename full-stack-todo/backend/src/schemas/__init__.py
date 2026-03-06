"""Schemas package for the Todo API."""

from .base import BaseResponse, ErrorResponse
from .auth import (
    TokenResponse,
    UserAuthResponse,
    TokenPayload,
    SignupRequest,
    SigninRequest,
    AuthResponse,
)
from .user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserRead,
    UserLogin,
    UserPasswordUpdate,
)
from .task import (
    TaskBase,
    TaskCreate,
    TaskUpdate,
    TaskRead,
    TaskToggle,
    TaskListResponse,
)

__all__ = [
    # Base models
    "BaseResponse",
    "ErrorResponse",

    # Auth models
    "TokenResponse",
    "UserAuthResponse",
    "TokenPayload",
    "SignupRequest",
    "SigninRequest",
    "AuthResponse",

    # User models
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserRead",
    "UserLogin",
    "UserPasswordUpdate",

    # Task models
    "TaskBase",
    "TaskCreate",
    "TaskUpdate",
    "TaskRead",
    "TaskToggle",
    "TaskListResponse",
]