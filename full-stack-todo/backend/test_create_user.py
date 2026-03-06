from sqlmodel import Session, select
from src.database.connection import engine
from src.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

with Session(engine) as session:
    # Check if user exists
    stmt = select(User).where(User.email == "testdirect@example.com")
    existing = session.exec(stmt).first()
    
    if existing:
        print(f"User exists: {existing.id}")
    else:
        # Create new user
        hashed = hash_password("testpass123")
        print(f"Hashed password: {hashed[:20]}...")
        
        user = User(
            email="testdirect@example.com",
            password_hash=hashed,
            name="Test User"
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        print(f"User created with id: {user.id}")
