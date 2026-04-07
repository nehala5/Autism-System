import os
import sys
from types import ModuleType

# Ensure Keras backend is torch
os.environ["KERAS_BACKEND"] = "torch"

# --- Centralized Monkey-patch for 'fer' library ---
try:
    from app.utils.patching import patch_tensorflow_with_keras
    patch_tensorflow_with_keras()
except ImportError:
    # Fallback for direct script execution
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    try:
        from app.utils.patching import patch_tensorflow_with_keras
        patch_tensorflow_with_keras()
    except Exception as e:
        print(f"DEBUG: Monkey-patch import failed: {e}")


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
import io
from fer import FER

router = APIRouter(prefix="/emotion", tags=["emotion"])

# Initialize FER Detector
detector = FER(mtcnn=False)

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

_custom_model = None
_custom_labels = None
_last_loaded_time = 0

def load_custom_model():
    global _custom_model, _custom_labels, _last_loaded_time
    weights_path = os.path.join(MODEL_PATH, "custom_weights.pth")
    labels_path = os.path.join(MODEL_PATH, "labels.json")
    
    if os.path.exists(weights_path) and os.path.exists(labels_path):
        try:
            # Check modification time
            mtime = os.path.getmtime(weights_path)
            if mtime <= _last_loaded_time and _custom_model is not None:
                return # Already up to date

            with open(labels_path, "r") as f:
                _custom_labels = json.load(f)
            
            num_classes = len(_custom_labels)
            _custom_model = EmotionClassifier(input_size=7, num_classes=num_classes)
            # Use weights_only=True for security
            _custom_model.load_state_dict(torch.load(weights_path, weights_only=True))
            _custom_model.eval()
            _last_loaded_time = mtime
            print(f"DEBUG: Custom emotion model loaded (v_{int(mtime)}).")
        except Exception as e:
            print(f"DEBUG: Error loading custom model: {e}")
            _custom_model = None
            _custom_labels = None
    else:
        _custom_model = None
        _custom_labels = None

def get_custom_emotion(scores):
    """
    Refines FER base emotions using custom trained weights if available.
    """
    # Always try to load/reload if needed
    load_custom_model()
        
    if _custom_model is not None and _custom_labels is not None:
        try:
            # FER returns 7 emotions: 'angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'
            # Sort keys to match training features order
            features = [scores[k] for k in sorted(scores.keys())]
            features_tensor = torch.tensor([features], dtype=torch.float32)
            with torch.no_grad():
                outputs = _custom_model(features_tensor)
                _, predicted = torch.max(outputs, 1)
                return _custom_labels[str(predicted.item())]
        except Exception as e:
            print(f"DEBUG: Custom model inference error: {e}")
    
    # Fallback to base FER emotion
    return max(scores, key=scores.get)

def get_emotion_from_frame(frame):
    """
    Detects faces in a frame and returns a predicted emotion.
    Uses FER + Custom PyTorch Model if available.
    """
    try:
        results = detector.detect_emotions(frame)
        if results:
            scores = results[0]["emotions"]
            return get_custom_emotion(scores)
    except Exception as e:
        print(f"DEBUG: FER detection error: {e}")
    
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
            # Process image to detect emotion
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
    global _custom_model, _custom_labels
    # Run the train_custom_model.py script as a subprocess
    try:
        # Need to find the absolute path to train_custom_model.py
        # It is in the root directory (one level up from backend)
        root_dir = os.path.dirname(BASE_DIR)
        train_script = os.path.join(root_dir, "train_custom_model.py")
        
        result = subprocess.run([sys.executable, train_script], capture_output=True, text=True)
        if result.returncode == 0:
            # Clear cached model to force reload
            _custom_model = None
            _custom_labels = None
            return {"message": "Success! AI brain retrained.", "output": result.stdout}
        else:
            # Combine stdout and stderr to catch the "FAILED:" message
            error_msg = result.stdout + "\n" + result.stderr
            return {"message": "Training failed", "error": error_msg.strip()}
    except Exception as e:
        return {"message": "Error starting training", "error": str(e)}
