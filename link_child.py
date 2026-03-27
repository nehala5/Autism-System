import os
import sys

# Add backend to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models import User, Child, DiaryEntry

def link_to_nehal():
    db = SessionLocal()
    try:
        # Find nehal user
        nehal = db.query(User).filter(User.username == "nehal").first()
        if not nehal:
            print("User 'nehal' not found. Please register it in the app first!")
            return

        # Find Alex child
        alex = db.query(Child).filter(Child.name == "Alex").first()
        if not alex:
            print("Child 'Alex' not found. Seeding new data for nehal...")
            from seed_db import seed
            seed() # This will ensure Alex exists
            alex = db.query(Child).filter(Child.name == "Alex").first()

        # Update Alex's parent_id to nehal's ID
        alex.parent_id = nehal.id
        
        # Also update diary entries
        diary_entries = db.query(DiaryEntry).all()
        for entry in diary_entries:
            entry.parent_id = nehal.id

        db.commit()
        print(f"Success! Alex (and diary entries) are now linked to user '{nehal.username}' (ID: {nehal.id}).")
        print("You can now login as 'nehal' and you will see Alex.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    link_to_nehal()
