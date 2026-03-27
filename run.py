import uvicorn
import os
import sys

# Set Keras backend to torch for Python 3.14 compatibility
os.environ["KERAS_BACKEND"] = "torch"

if __name__ == "__main__":
    # Get absolute path to the backend directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    
    # Add backend_dir to sys.path so 'app' can be found
    sys.path.insert(0, backend_dir)
    
    # Move into the backend directory so relative paths for DB/Uploads work correctly
    os.chdir(backend_dir)
    
    # Ensure data directories exist inside backend/data
    dirs = [
        "data/uploads/emotions",
        "data/uploads/diary",
        "data/reports"
    ]
    
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    print(f"Starting NeuroSense Backend from: {backend_dir}")
    print("Frontend is being served from: ../frontend")
    print("Open http://127.0.0.1:8000 in your browser.")
    
    # Run the app
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
