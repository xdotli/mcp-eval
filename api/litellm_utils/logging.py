import os

def enable_debug_logging():
    """Enable debug logging for LiteLLM."""
    os.environ['LITELLM_LOG'] = 'DEBUG'

def disable_debug_logging():
    """Disable debug logging for LiteLLM."""
    if 'LITELLM_LOG' in os.environ:
        del os.environ['LITELLM_LOG'] 