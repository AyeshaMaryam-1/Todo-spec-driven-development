"""Database initialization script."""
from sqlmodel import SQLModel, Session, select, text
from .connection import engine
from ..models.user import User
from ..models.task import Task


def init_db():
    """
    Initialize database schema.

    Creates all tables defined in SQLModel models.
    """
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

    # Add missing columns if needed
    print("\nChecking for missing columns...")
    with Session(engine) as session:
        try:
            # Check if password_hash column exists in user table
            result = session.exec(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'user' AND column_name = 'password_hash'
            """)).first()
            
            if not result:
                print("Adding password_hash column to user table...")
                session.exec(text("ALTER TABLE \"user\" ADD COLUMN password_hash VARCHAR NOT NULL DEFAULT ''"))
                session.commit()
                print("✓ password_hash column added")
            else:
                print("✓ password_hash column already exists")
            
            # Check if tables exist by querying them
            session.exec(text("SELECT COUNT(*) FROM user"))
            print("✓ User table verified")
            session.exec(text("SELECT COUNT(*) FROM task"))
            print("✓ Task table verified")
            print("\n✅ Database initialization complete and verified!")
        except Exception as e:
            print(f"\n❌ Database verification failed: {str(e)}")
            raise


if __name__ == "__main__":
    init_db()
