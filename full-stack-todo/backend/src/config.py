"""Application configuration loaded from environment variables."""
import os
from dotenv import load_dotenv
from pathlib import Path


# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    """Application settings."""

    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # JWT Configuration
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # CORS Configuration
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "")

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    def __init__(self):
        """Validate required settings."""
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is required")
        if not self.JWT_SECRET:
            raise ValueError("JWT_SECRET environment variable is required")


# Create singleton settings instance
settings = Settings()
