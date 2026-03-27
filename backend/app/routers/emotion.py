import os
# Ensure Keras backend is torch if not already set (important for Python 3.14)
if "KERAS_BACKEND" not in os.environ:
    os.environ["KERAS_BACKEND"] = "torch"

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EmotionLog
import uuid
import shutil
import cv2
import hashlib
from PIL import Image
import numpy as np
import torch
import torch.nn as nn
import json
import os
import io

router = APIRouter(prefix="/emotion", tags=["emotion"])

# Initialize OpenCV Face Detector (Native and very fast)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# --- Custom Model Support ---
class EmotionClassifier(nn.Module):
    def __init__(self, input_size=7, num_classes=7):
        super(EmotionClassifier, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, num_classes)
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))

# Get backend root directory
ROUTER_DIR = os.path.dirname(os.path.abspath(__file__)) 
APP_DIR = os.path.dirname(ROUTER_DIR)                  
BASE_DIR = os.path.dirname(APP_DIR)                    
MODEL_PATH = os.path.join(APP_DIR, "models", "custom_ai")

def get_emotion_from_frame(frame):
    """
    Detects faces in a frame and returns a predicted emotion.
    Now uses OpenCV + PyTorch (no TensorFlow needed).
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    # If no face is found, we can't reliably predict emotion
    if len(faces) == 0:
        return "neutral"

    # For now, let's stick with 'neutral' or use our custom model if weights exist
    # (Since we removed FER, we can't use its 'pre-trained' weights)
    # But we can easily add a lightweight PyTorch emotion model here!
    
    weights_path = os.path.join(MODEL_PATH, "custom_weights.pth")
    if os.path.exists(weights_path):
        # ... logic to run your custom PyTorch model ...
        return "detected" # Placeholder
    
    return "neutral"

from app.utils.storage import save_file

@router.post("/upload")
async def upload_emotion(
    child_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    image_hash = hashlib.md5(content).hexdigest()

    existing_entry = db.query(EmotionLog).filter(
        EmotionLog.image_hash == image_hash, 
        EmotionLog.corrected_emotion != None
    ).order_by(EmotionLog.timestamp.desc()).first()

    # Reset file pointer for save_file
    file.file.seek(0)
    # Save file using utility (returns S3 URL or local path)
    saved_path = save_file(file, "emotions")

    if existing_entry:
        predicted_emotion = existing_entry.corrected_emotion
    else:
        try:
            # Native OpenCV/PyTorch Processing
            pil_img = Image.open(io.BytesIO(content)).convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            predicted_emotion = get_emotion_from_frame(img)
        except Exception as e:
            predicted_emotion = "error"
            print(f"DEBUG: Emotion detection error: {e}")

    log_entry = EmotionLog(
        child_id=child_id,
        image_path=saved_path,
        image_hash=image_hash,
        predicted_emotion=predicted_emotion,
        confirmed=False
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    return {
        "id": log_entry.id,
        "predicted_emotion": predicted_emotion,
        "image_url": saved_path
    }

@router.post("/process-frame")
async def process_frame(
    child_id: int = Form(...),
    frame_data: str = Form(...),
    db: Session = Depends(get_db)
):
    import base64
    try:
        header, encoded = frame_data.split(",", 1)
        data = base64.b64decode(encoded)
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"emotion": "unknown", "error": "Failed to decode image"}
        
        predicted_emotion = get_emotion_from_frame(img)
        return {"emotion": predicted_emotion}
    except Exception as e:
        return {"emotion": "unknown", "error": str(e)}

@router.post("/process-frame")
async def process_frame(
    child_id: int = Form(...),
    frame_data: str = Form(...),
    db: Session = Depends(get_db)
):
    import base64
    try:
        header, encoded = frame_data.split(",", 1)
        data = base64.b64decode(encoded)
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"emotion": "unknown", "error": "Failed to decode image"}
        
        emotions = detector.detect_emotions(img)
        if emotions:
            scores = emotions[0]["emotions"]
            # Use custom model logic for real-time camera too!
            predicted_emotion = get_custom_emotion(scores)
        else:
            predicted_emotion = "neutral"
            
        return {"emotion": predicted_emotion}
    except Exception as e:
        return {"emotion": "unknown", "error": str(e)}

@router.post("/confirm")
def confirm_emotion(
    log_id: int = Form(...),
    corrected_emotion: str = Form(None),
    confirmed: bool = Form(...),
    db: Session = Depends(get_db)
):
    log_entry = db.query(EmotionLog).filter(EmotionLog.id == log_id).first()
    if not log_entry:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    log_entry.confirmed = confirmed
    if corrected_emotion:
        log_entry.corrected_emotion = corrected_emotion
        db.query(EmotionLog).filter(EmotionLog.image_hash == log_entry.image_hash).update({
            "corrected_emotion": corrected_emotion,
            "confirmed": True
        })
    
    db.commit()
    return {"message": "Log updated successfully"}

@router.get("/unique-emotions")
def get_unique_emotions(db: Session = Depends(get_db)):
    standard = {"happy", "sad", "angry", "fear", "surprise", "neutral"}
    custom = db.query(EmotionLog.corrected_emotion).filter(EmotionLog.corrected_emotion != None).distinct().all()
    custom_set = {c[0] for c in custom if c[0]}
    return sorted(list(standard.union(custom_set)))

@router.post("/train")
async def train_model():
    import subprocess
    import sys
    # Run the train_custom_model.py script as a subprocess
    try:
        # Need to find the absolute path to train_custom_model.py
        # It is in the root directory (one level up from backend)
        root_dir = os.path.dirname(BASE_DIR)
        train_script = os.path.join(root_dir, "train_custom_model.py")
        
        result = subprocess.run([sys.executable, train_script], capture_output=True, text=True)
        if result.returncode == 0:
            return {"message": "Success! AI brain retrained.", "output": result.stdout}
        else:
            # Combine stdout and stderr to catch the "FAILED:" message
            error_msg = result.stdout + "\n" + result.stderr
            return {"message": "Training failed", "error": error_msg.strip()}
    except Exception as e:
        return {"message": "Error starting training", "error": str(e)}
