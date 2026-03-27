import os
os.environ["KERAS_BACKEND"] = "torch"
try:
    from fer import FER
    detector = FER()
    print("FER imported and detector created with torch backend.")
except Exception as e:
    print(f"Error: {e}")
