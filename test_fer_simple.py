import os
import sys
from types import ModuleType

# Set Keras backend to torch
os.environ["KERAS_BACKEND"] = "torch"

import keras
import cv2
import numpy as np

# Monkey-patch tensorflow.keras for fer
tf = ModuleType("tensorflow")
sys.modules["tensorflow"] = tf
sys.modules["tensorflow.keras"] = keras
tf.keras = keras
import keras.models
import keras.layers
sys.modules["tensorflow.keras.models"] = keras.models
sys.modules["tensorflow.keras.layers"] = keras.layers
tf.keras.models = keras.models
tf.keras.layers = keras.layers

from fer import FER

def test_fer():
    try:
        print("Initializing FER detector (with torch backend patch)...")
        detector = FER(mtcnn=False)
        # Create a blank image
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        # Add a white circle 
        cv2.circle(img, (50, 50), 30, (255, 255, 255), -1)
        
        print("Testing FER detector...")
        emotions = detector.detect_emotions(img)
        print(f"Result: {emotions}")
        print("SUCCESS: FER is working with torch backend!")
    except Exception as e:
        print(f"FER error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_fer()
