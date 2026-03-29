import os
import sys
from types import ModuleType

# Set Keras backend to torch for Python 3.11 compatibility
os.environ["KERAS_BACKEND"] = "torch"

# Monkey-patch tensorflow.keras for fer (which depends on tf.keras)
# This allows using keras 3.x with torch backend instead of full tensorflow
try:
    import keras
    tf = ModuleType("tensorflow")
    tf.keras = ModuleType("tensorflow.keras")
    tf.keras.models = ModuleType("tensorflow.keras.models")
    tf.keras.models.load_model = keras.models.load_model
    sys.modules["tensorflow"] = tf
    sys.modules["tensorflow.keras"] = tf.keras
    sys.modules["tensorflow.keras.models"] = tf.keras.models
    print("Monkey-patched tensorflow.keras to use keras with torch backend.")
except ImportError:
    print("Warning: keras not found, monkey-patching failed.")

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.database import engine, Base
from app.routers import auth, dashboard, emotion, activities, diary

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NeuroSense")

# Get base directory (backend root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

# Ensure necessary directories exist in backend/data
os.makedirs(os.path.join(BASE_DIR, "data/uploads/emotions"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data/uploads/diary"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data/reports"), exist_ok=True)

# Mount Static Files (CSS, JS) from frontend folder
app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIR, "static")), name="static")

# Mount Data Folders for viewing (from backend/data)
app.mount("/uploads", StaticFiles(directory=os.path.join(BASE_DIR, "data/uploads")), name="uploads")
app.mount("/reports", StaticFiles(directory=os.path.join(BASE_DIR, "data/reports")), name="reports")

# Templates from frontend/templates
templates = Jinja2Templates(directory=os.path.join(FRONTEND_DIR, "templates"))

# Include Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(emotion.router)
app.include_router(activities.router)
app.include_router(diary.router)

# Page Routes

@app.get("/")
def home_page(request: Request):
    # Root is Dashboard
    return templates.TemplateResponse(request, "dashboard.html", {"request": request})

@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(request, "login.html", {"request": request})

@app.get("/children")
def children_page(request: Request):
    return templates.TemplateResponse(request, "children.html", {"request": request})

@app.get("/emotion-learning")
def emotion_page(request: Request):
    return templates.TemplateResponse(request, "emotion.html", {"request": request})

@app.get("/activities")
def activities_page(request: Request):
    return templates.TemplateResponse(request, "activities.html", {"request": request})

@app.get("/game/{game_name}")
def game_page(request: Request, game_name: str):
    return templates.TemplateResponse(request, "game.html", {"request": request, "game_name": game_name})

@app.get("/dashboard")
def dashboard_redirect(request: Request):
    return RedirectResponse(url="/")

@app.get("/diary")
def diary_page(request: Request):
    return templates.TemplateResponse(request, "diary.html", {"request": request})

@app.get("/quiz")
def quiz_page(request: Request):
    return templates.TemplateResponse(request, "quiz.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
