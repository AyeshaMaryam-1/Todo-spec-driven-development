from sqlmodel import Session, text
from src.database.connection import engine
from src.models.user import User
from src.config import settings

print("DB URL:", settings.DATABASE_URL[:50])

with Session(engine) as session:
    result = session.exec(text("""
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'user'
        ORDER BY ordinal_position
    """))
    cols = result.all()
    print("Columns in user table:")
    for col in cols:
        print(f"  - {col[0]} ({col[1]}, nullable={col[2]})")
