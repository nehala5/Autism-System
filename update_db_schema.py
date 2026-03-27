import sqlite3
import os

db_path = 'backend/data/neurosense.db'

if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check current columns
    cursor.execute('PRAGMA table_info(children)')
    cols = [c[1] for c in cursor.fetchall()]
    
    if 'autism_inheritance' not in cols:
        print("Adding autism_inheritance...")
        cursor.execute("ALTER TABLE children ADD COLUMN autism_inheritance VARCHAR DEFAULT ''")
        
    if 'sensory_level' not in cols:
        print("Adding sensory_level...")
        cursor.execute("ALTER TABLE children ADD COLUMN sensory_level VARCHAR DEFAULT 'standard'")
        
    conn.commit()
    conn.close()
    print("Database updated successfully.")
