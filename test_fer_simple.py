import os
os.environ["KERAS_BACKEND"] = "torch"
from fer import FER
import cv2
import numpy as np

def test_fer():
    try:
        detector = FER(mtcnn=False)
        # Create a blank image
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        # Add a white circle (to represent a face-ish thing, though FER might not find a face)
        cv2.circle(img, (50, 50), 30, (255, 255, 255), -1)
        
        print("Testing FER detector...")
        emotions = detector.detect_emotions(img)
        print(f"Result: {emotions}")
        print("FER is working (even if no face found in blank image)")
    except Exception as e:
        print(f"FER error: {e}")

if __name__ == "__main__":
    test_fer()
