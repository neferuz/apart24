from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# For development we use SQLite. In production, change this to PostgreSQL.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./apart24.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
