import sqlite3
import os

db_path = os.path.join("neurosense", "data", "neurosense.db")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- Users ---")
    cursor.execute("SELECT id, username FROM users")
    users = cursor.fetchall()
    for u in users:
        print(f"ID: {u[0]}, Username: {u[1]}")
        
    print("\n--- Children ---")
    cursor.execute("SELECT id, name, parent_id FROM children")
    children = cursor.fetchall()
    for c in children:
        print(f"ID: {c[0]}, Name: {c[1]}, Parent ID: {c[2]}")
        
    conn.close()
else:
    print(f"Database file not found at: {db_path}")
