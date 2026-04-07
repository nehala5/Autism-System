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
        
        # Create dummy python submodule
        tf_python = ModuleType("tensorflow.python")
        sys.modules["tensorflow.python"] = tf_python
        tf.python = tf_python
        
        # Map keras to tensorflow.python.keras
        sys.modules["tensorflow.python.keras"] = keras
        tf_python.keras = keras

        # Map common submodules explicitly
        sub_modules = [
            "models", "layers", "backend", "utils", "callbacks", 
            "initializers", "optimizers", "regularizers", "constraints", "activations"
        ]
        
        for sub in sub_modules:
            try:
                # Try to get from keras
                module = getattr(keras, sub, None)
                if not module:
                    # Try to import directly
                    import_name = f"keras.{sub}"
                    __import__(import_name)
                    module = sys.modules[import_name]
                
                if module:
                    sys.modules[f"tensorflow.keras.{sub}"] = module
                    sys.modules[f"tensorflow.python.keras.{sub}"] = module
                    setattr(tf.keras, sub, module)
                    setattr(tf.python.keras, sub, module)
            except (ImportError, AttributeError):
                pass
            
        # Add some dummy compat modules if needed
        tf_compat = ModuleType("tensorflow.compat")
        sys.modules["tensorflow.compat"] = tf_compat
        tf.compat = tf_compat
        
        tf_v1 = ModuleType("tensorflow.compat.v1")
        sys.modules["tensorflow.compat.v1"] = tf_v1
        tf_compat.v1 = tf_v1
            
        print("Successfully monkey-patched tensorflow with keras.")
    except Exception as e:
        print(f"Warning: Failed to monkey-patch tensorflow with keras: {e}")

