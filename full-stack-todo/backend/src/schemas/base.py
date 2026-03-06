"""Base Pydantic models for API responses."""

from pydantic import BaseModel
from typing import Optional


class BaseResponse(BaseModel):
    """Base response model for all API responses."""

    success: bool = True
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response model for API errors."""

    success: bool = False
    detail: str
    error_code: Optional[str] = None