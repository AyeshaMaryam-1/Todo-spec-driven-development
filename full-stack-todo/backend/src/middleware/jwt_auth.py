"""JWT authentication middleware and dependencies."""
import jwt
import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..config import settings

# Configure logging
logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


def extract_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Extract JWT token from Authorization header.

    Args:
        credentials: HTTP Bearer credentials from request header

    Returns:
        str: JWT token string

    Raises:
        HTTPException: 401 if Authorization header is missing or malformed
    """
    if not credentials:
        logger.warning("Missing Authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )
    return credentials.credentials


def verify_jwt_token(token: str) -> dict:
    """
    Verify JWT token and extract payload.

    Args:
        token: JWT token string

    Returns:
        dict: Decoded JWT payload

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )


def get_current_user(token: str = Depends(extract_token)) -> int:
    """
    FastAPI dependency that extracts and validates user ID from JWT token.

    This dependency should be used on all protected endpoints to ensure
    the user is authenticated and to get their user ID.

    Args:
        token: JWT token from Authorization header

    Returns:
        int: User ID from JWT payload

    Raises:
        HTTPException: 401 if token is invalid or missing user_id claim

    Example:
        @app.get("/api/tasks")
        def get_tasks(user_id: int = Depends(get_current_user)):
            # user_id is now available and verified
            return get_user_tasks(user_id)
    """
    payload = verify_jwt_token(token)

    # Extract user_id from JWT payload (try both 'sub' and 'user_id' claims)
    user_id = payload.get("sub") or payload.get("user_id")

    if not user_id:
        logger.error("JWT token missing user_id claim")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user identifier",
        )

    try:
        return int(user_id)
    except (ValueError, TypeError):
        logger.error(f"Invalid user_id format in JWT: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: malformed user identifier",
        )
