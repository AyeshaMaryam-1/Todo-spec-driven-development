"""Structured logging utilities."""
import logging
import sys
from datetime import datetime
from typing import Any, Dict


def setup_logging(level: str = "INFO") -> None:
    """
    Configure application-wide logging.

    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


def log_request(method: str, path: str, user_id: int = None) -> None:
    """
    Log API request with structured information.

    Args:
        method: HTTP method (GET, POST, etc.)
        path: Request path
        user_id: Authenticated user ID (if available)
    """
    logger = logging.getLogger("api.request")
    logger.info(
        f"Request: {method} {path}",
        extra={
            "method": method,
            "path": path,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


def log_response(method: str, path: str, status_code: int, duration_ms: float = None) -> None:
    """
    Log API response with structured information.

    Args:
        method: HTTP method
        path: Request path
        status_code: HTTP status code
        duration_ms: Request duration in milliseconds
    """
    logger = logging.getLogger("api.response")
    logger.info(
        f"Response: {method} {path} - {status_code}",
        extra={
            "method": method,
            "path": path,
            "status_code": status_code,
            "duration_ms": duration_ms,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


def log_error(error: Exception, context: Dict[str, Any] = None) -> None:
    """
    Log error with context information.

    Args:
        error: Exception that occurred
        context: Additional context information
    """
    logger = logging.getLogger("api.error")
    logger.error(
        f"Error: {str(error)}",
        extra={
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {},
            "timestamp": datetime.utcnow().isoformat()
        },
        exc_info=True
    )
