"""Database connection and session management."""
from sqlmodel import create_engine, Session, text
from typing import Generator
from ..config import settings
import logging

logger = logging.getLogger(__name__)

# Create SQLModel engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=True if settings.ENVIRONMENT == "development" else False,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,  # Number of connections to maintain in the pool
    max_overflow=10,  # Maximum number of connections that can be created beyond pool_size
    pool_recycle=3600,  # Recycle connections after 1 hour
)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Yields:
        Session: SQLModel database session

    Example:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            items = session.exec(select(Item)).all()
            return items
    """
    with Session(engine) as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {str(e)}")
            session.rollback()
            raise
        finally:
            session.close()


def verify_database_connection() -> bool:
    """
    Verify that the database connection is working.

    Returns:
        bool: True if connection is successful, False otherwise
    """
    try:
        with Session(engine) as session:
            session.exec(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database connection verification failed: {str(e)}")
        return False
