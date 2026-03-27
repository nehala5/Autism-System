import sqlite3
import os

db_path = os.path.join("backend", "data", "neurosense.db")
if os.path.exists(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE emotion_logs ADD COLUMN image_hash VARCHAR;")
        conn.commit()
        print("Success! Added image_hash column to emotion_logs table.")
    except Exception as e:
        print(f"Error (maybe column already exists): {e}")
    finally:
        conn.close()
else:
    print(f"Database not found at {db_path}")
