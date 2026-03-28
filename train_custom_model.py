import os
import sys
from types import ModuleType

# Set Keras backend to torch for Python 3.14 compatibility
os.environ["KERAS_BACKEND"] = "torch"

# --- Monkey-patch for 'fer' library (to avoid TensorFlow requirement) ---
try:
    import keras
    tf = ModuleType("tensorflow")
    tf.keras = ModuleType("tensorflow.keras")
    tf.keras.models = ModuleType("tensorflow.keras.models")
    tf.keras.models.load_model = keras.models.load_model
    sys.modules["tensorflow"] = tf
    sys.modules["tensorflow.keras"] = tf.keras
    sys.modules["tensorflow.keras.models"] = tf.keras.models
except Exception as e:
    print(f"DEBUG: Monkey-patch failed: {e}")

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import cv2
import numpy as np
from PIL import Image

# Add backend to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models import EmotionLog
from fer import FER

# 1. Simple Neural Network to "learn" new emotions
class EmotionClassifier(nn.Module):
    def __init__(self, input_size, num_classes):
        super(EmotionClassifier, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, num_classes)
    
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))

def train():
    db = SessionLocal()
    detector = FER(mtcnn=False)
    
    # Get all logs that have a corrected emotion
    logs = db.query(EmotionLog).filter(EmotionLog.corrected_emotion != None).all()
    
    # Check unique emotions count
    all_emotions = sorted(list(set([log.corrected_emotion for log in logs])))
    
    if len(all_emotions) < 2:
        print(f"FAILED: Not enough variety! You only have one corrected emotion: {all_emotions}. Correct at least two different images with different emotions to train the custom brain.")
        sys.exit(1)

    if len(logs) < 3:
        print(f"FAILED: Not enough data! You only have {len(logs)} corrections. Please correct at least 3 images (from different photos) to help the AI learn.")
        sys.exit(1)

    # Prepare labels and mappings
    emotion_to_idx = {emo: i for i, emo in enumerate(all_emotions)}
    idx_to_emotion = {i: emo for emo, i in emotion_to_idx.items()}
    
    X = []
    y = []

    print(f"Preparing data for emotions: {all_emotions}")

    for log in logs:
        # Load the image
        img_path = os.path.join(backend_dir, "data", log.image_path)
        if not os.path.exists(img_path): 
            print(f"Skipping missing image: {img_path}")
            continue
        
        try:
            img = cv2.imread(img_path)
            if img is None:
                print(f"Skipping unreadable image: {img_path}")
                continue
            # Use FER to detect face and get the emotion probabilities (features)
            results = detector.detect_emotions(img)
            if results:
                # We take the 7 base emotion probabilities as features
                # Sort keys to ensure consistent feature order matching inference
                emo_dict = results[0]["emotions"]
                features = [emo_dict[k] for k in sorted(emo_dict.keys())]
                X.append(features)
                y.append(emotion_to_idx[log.corrected_emotion])
            else:
                # If FER fails on this specific image, we use neutral features
                print(f"Warning: FER could not find face in {img_path}, skipping.")
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            continue

    if not X:
        print("FAILED: Could not extract features from any of your corrected images.")
        sys.exit(1)

    # Print summary of samples per emotion
    print("\nTraining Data Summary:")
    from collections import Counter
    counts = Counter([idx_to_emotion[idx] for idx in y])
    for emo, count in sorted(counts.items()):
        print(f" - {emo}: {count} samples")
    
    # Check for missing emotions
    missing = set(all_emotions) - set(counts.keys())
    if missing:
        print(f"\nWARNING: The following emotions have 0 valid samples (face detection failed): {list(missing)}")
        print("These emotions will NOT be recognized by the custom brain. Try using clearer photos.")
    
    print(f"\nTotal training samples: {len(y)}\n")

    X = torch.tensor(X, dtype=torch.float32)
    y = torch.tensor(y, dtype=torch.long)

    # 2. Train the model
    model = EmotionClassifier(input_size=7, num_classes=len(all_emotions))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    print("Training the custom brain...")
    # Increase epochs for small dataset to ensure convergence
    for epoch in range(200):
        optimizer.zero_grad()
        outputs = model.forward(X)
        loss = criterion(outputs, y)
        loss.backward()
        optimizer.step()
        if (epoch+1) % 50 == 0:
            print(f"Epoch [{epoch+1}/200], Loss: {loss.item():.4f}")

    # 3. Save the custom model and the label mapping
    save_path = os.path.join(backend_dir, "app/models/custom_ai")
    os.makedirs(save_path, exist_ok=True)
    
    torch.save(model.state_dict(), os.path.join(save_path, "custom_weights.pth"))
    
    import json
    with open(os.path.join(save_path, "labels.json"), "w") as f:
        json.dump(idx_to_emotion, f)
        
    print(f"SUCCESS: Custom brain trained and saved. It now knows: {all_emotions}")

if __name__ == "__main__":
    train()
