import sqlite3
import os

db_path = os.path.join("backend", "data", "neurosense.db")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, predicted_emotion, corrected_emotion, image_hash FROM emotion_logs ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    print("Recent Emotion Logs:")
    for r in rows:
        print(f"ID: {r[0]}, Predicted: {r[1]}, Corrected: {r[2]}, Hash: {r[3]}")
    conn.close()
else:
    print("DB not found")
