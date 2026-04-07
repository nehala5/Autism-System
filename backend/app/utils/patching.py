import sys
from types import ModuleType
import os

def patch_tensorflow_with_keras():
    """
    Monkey-patches the 'tensorflow' module to use 'keras' (Keras 3) with a custom backend (like torch).
    This allows libraries like 'fer' to work without needing the full 'tensorflow' package.
    """
    if "tensorflow" in sys.modules and not isinstance(sys.modules["tensorflow"], ModuleType):
        # Already patched or real tensorflow is already there
        return

    try:
        # Set Keras backend to torch if not already set
        if "KERAS_BACKEND" not in os.environ:
            os.environ["KERAS_BACKEND"] = "torch"
            
        import keras
        
        # Create a dummy tensorflow module
        tf = ModuleType("tensorflow")
        sys.modules["tensorflow"] = tf
        
        # Map keras to tensorflow.keras
        sys.modules["tensorflow.keras"] = keras
        tf.keras = keras
        
        # Map common submodules explicitly for libraries that use 'from tensorflow.keras.X import Y'
        # We try-import to ensure they are available in the keras module
        try:
            import keras.models
            sys.modules["tensorflow.keras.models"] = keras.models
            tf.keras.models = keras.models
        except ImportError: pass
        
        try:
            import keras.layers
            sys.modules["tensorflow.keras.layers"] = keras.layers
            tf.keras.layers = keras.layers
        except ImportError: pass

        try:
            import keras.backend
            sys.modules["tensorflow.keras.backend"] = keras.backend
            tf.keras.backend = keras.backend
        except ImportError: pass
        
        try:
            import keras.utils
            sys.modules["tensorflow.keras.utils"] = keras.utils
            tf.keras.utils = keras.utils
        except ImportError: pass
            
        print("Successfully monkey-patched tensorflow with keras.")
    except Exception as e:
        print(f"Warning: Failed to monkey-patch tensorflow with keras: {e}")
