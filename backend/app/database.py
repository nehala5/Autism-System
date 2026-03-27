import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get the absolute path to the directory where this file is located (backend/app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Default local SQLite path
DEFAULT_DB_PATH = os.path.join(os.path.dirname(BASE_DIR), "data", "neurosense.db")

# Use DATABASE_URL from environment variable (for Cloud), or fallback to local SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

# Fix for some cloud providers (like Heroku) that use 'postgres://' instead of 'postgresql://'
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite requires 'check_same_thread: False', PostgreSQL does not
engine_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
