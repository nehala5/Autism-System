import sys
import os
from dotenv import load_dotenv

# Load .env first
load_dotenv(os.path.join(os.getcwd(), "backend", ".env"))

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.database import engine, Base
from sqlalchemy import text

def test_connection():
    print("Testing connection to Neon Cloud PostgreSQL...")
    try:
        # Try to connect
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()
            print(f"✅ Success! Connected to: {version[0]}")
            
        # Try to create tables
        print("Creating tables in cloud database...")
        from app.models import User, Child, EmotionLog, ActivityLog, QuizResult, DiaryEntry
        Base.metadata.create_all(bind=engine)
        print("✅ Success! All tables created.")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
