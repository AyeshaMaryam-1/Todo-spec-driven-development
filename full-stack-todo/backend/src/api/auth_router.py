"""Authentication API router - signup and signin endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime, timedelta
import jwt
import bcrypt

from ..database.connection import get_session
from ..models.user import User
from ..config import settings
from ..schemas import SignupRequest, SigninRequest, AuthResponse

router = APIRouter()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(user_id: int) -> str:
    """Create a JWT access token for a user."""
    expire = datetime.utcnow() + timedelta(days=7)  # Token valid for 7 days
    payload = {
        "sub": str(user_id),
        "user_id": user_id,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


@router.post(
    "/auth/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User signup",
    description="Create a new user account",
)
def signup(
    request: SignupRequest,
    session: Session = Depends(get_session),
):
    """
    Create a new user account.

    Args:
        request: Signup request containing email, password, and optional name

    Returns:
        AuthResponse: User data and JWT token

    Raises:
        HTTPException: 400 if email already exists
    """
    # Check if user already exists
    statement = select(User).where(User.email == request.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    hashed_password = hash_password(request.password)
    user = User(
        email=request.email,
        name=request.name,
        password_hash=hashed_password,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate JWT token
    token = create_access_token(user.id)

    return AuthResponse(
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
        token=token,
    )


@router.post(
    "/auth/signin",
    response_model=AuthResponse,
    summary="User signin",
    description="Authenticate user and get JWT token",
)
def signin(
    request: SigninRequest,
    session: Session = Depends(get_session),
):
    """
    Authenticate a user and return JWT token.

    Args:
        request: Signin request containing email and password

    Returns:
        AuthResponse: User data and JWT token

    Raises:
        HTTPException: 401 if credentials are invalid
    """
    # Find user by email
    statement = select(User).where(User.email == request.email)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate JWT token
    token = create_access_token(user.id)

    return AuthResponse(
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
        token=token,
    )
