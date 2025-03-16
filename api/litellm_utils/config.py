import os
from litellm import RetryPolicy

# Retry configuration
RETRY_POLICY = RetryPolicy(
    TimeoutErrorRetries=2,
    RateLimitErrorRetries=3
)

# Model configurations
MODEL_LIST = [{
    "model_name": "gpt-4o-mini",
    "litellm_params": {
        "model": "gpt-4o-mini",
        "api_key": os.environ.get("OPENAI_API_KEY"),
        "max_parallel_requests": 40,
    }        
}, {
    "model_name": "gpt-4o",
    "litellm_params": {
        "model": "gpt-4o",
        "api_key": os.environ.get("OPENAI_API_KEY"),
        "max_parallel_requests": 20,
        "tpm": 400_000,
        "rpm": 4500,
    }
}, {   
    "model_name": "sonnet",
    "litellm_params": {
        "model": "claude-3-7-sonnet-20250219",
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "max_parallel_requests": 16,
        "tpm": 40_000,
        "rpm": 4500,
    }
},
{   
    "model_name": "claude-3.7",
    "litellm_params": {
        "model": "claude-3-7-sonnet-latest",
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "max_parallel_requests": 16,
        "tpm": 40_000,
        "rpm": 4500,
    }
},{   
    "model_name": "claude-3.5",
    "litellm_params": {
        "model": "claude-3-5-sonnet-latest",
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "max_parallel_requests": 16,
        "tpm": 40_000,
        "rpm": 4500,
    }
}
,{   
    "model_name": "haiku",
    "litellm_params": {
        "model": "claude-3-5-haiku-20241022",
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "max_parallel_requests": 10,
        "tpm": 40_000,
        "rpm": 4500,
    }
}]

# Router configuration
ROUTER_CONFIG = {
    "num_retries": 3,
    "retry_after": 5,
    "enable_pre_call_checks": True
} 