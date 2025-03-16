from litellm import Router
from .config import MODEL_LIST, ROUTER_CONFIG, RETRY_POLICY

_router = None

def get_router():
    """
    Get or create a singleton router instance with configured settings.
    
    Returns:
        Router: Configured LiteLLM router instance
    """
    global _router
    if _router is None:
        _router = Router(
            model_list=MODEL_LIST,
            retry_policy=RETRY_POLICY,
            **ROUTER_CONFIG
        )
    return _router

async def broadcast_prompt_to_all_models(prompt):
    """
    Send the same prompt to all configured models in parallel.
    
    Args:
        prompt (str): The prompt to send to all models
        
    Returns:
        list: List of completion responses from all models
    """
    router = get_router()
    tasks = []
    
    for model in router.model_list:
        acompletion_kwargs = {
            "model": model['model_name'],
            "messages": [{"role": "user", "content": prompt}],
        }        
        tasks.append(router.acompletion(**acompletion_kwargs))
        
    return tasks 