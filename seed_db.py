import os
import sys
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Add backend to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
sys.path.insert(0, backend_dir)

from app.database import SessionLocal, engine, Base
from app.models import User, Child, EmotionLog, DiaryEntry, ActivityLog, QuizResult

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    db = SessionLocal()
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)

        # 1. Create User
        user = db.query(User).filter(User.username == "parent1").first()
        if not user:
            user = User(
                username="parent1",
                hashed_password=pwd_context.hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print("User 'parent1' created.")
        else:
            print("User 'parent1' already exists.")

        # 2. Create Child
        child = db.query(Child).filter(Child.parent_id == user.id).first()
        if not child:
            child = Child(
                name="Alex",
                age=6,
                parent_id=user.id
            )
            db.add(child)
            db.commit()
            db.refresh(child)
            print("Child 'Alex' created.")
        else:
            print("Child 'Alex' already exists.")

        # 3. Add Emotion Logs (Past 3 days)
        if db.query(EmotionLog).count() == 0:
            emotions = ["happy", "sad", "angry", "surprise", "neutral", "happy", "fear"]
            for i, emotion in enumerate(emotions):
                log = EmotionLog(
                    child_id=child.id,
                    predicted_emotion=emotion,
                    image_path=f"uploads/emotions/sample_{i}.jpg",
                    timestamp=datetime.utcnow() - timedelta(days=i/2),
                    confirmed=True if i % 2 == 0 else False
                )
                db.add(log)
            print(f"Added {len(emotions)} emotion logs.")

        # 4. Add Diary Entries
        if db.query(DiaryEntry).count() == 0:
            entries = [
                {"title": "Great Progress!", "message": "Alex was very happy during the emotion matching game today."},
                {"title": "Rough Morning", "message": "Had a bit of trouble focusing this morning, but improved by noon."}
            ]
            for entry_data in entries:
                entry = DiaryEntry(
                    parent_id=user.id,
                    child_name="Alex",
                    title=entry_data["title"],
                    message=entry_data["message"],
                    timestamp=datetime.utcnow() - timedelta(days=1)
                )
                db.add(entry)
            print(f"Added {len(entries)} diary entries.")
            
        # 5. Add Activity Logs
        if db.query(ActivityLog).count() == 0:
            activities = [
                {"name": "Emotion Match", "score": 90, "duration": 120},
                {"name": "Color Learn", "score": 100, "duration": 80}
            ]
            for act in activities:
                log = ActivityLog(
                    child_id=child.id,
                    activity_name=act["name"],
                    score=act["score"],
                    duration_seconds=act["duration"]
                )
                db.add(log)
            print(f"Added {len(activities)} activity logs.")

        db.commit()
        print("\nDatabase seeded successfully!")
        print("-" * 30)
        print("Login Credentials:")
        print("Username: parent1")
        print("Password: password123")
        print("-" * 30)

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
