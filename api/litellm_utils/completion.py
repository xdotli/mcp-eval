from typing import Optional, Dict, List, Any
from .router import get_router

async def acomplete(
    prompt: str,
    gen_name: Optional[str] = None,
    model: str = 'gpt-4o',
    response_format: Optional[Dict] = None,
    trace_id: Optional[str] = None,
    cont_trace: bool = False,
    temperature: Optional[float] = None,
    tags: Optional[List[str]] = None,
    prompt_params: Optional[Dict[str, Any]] = None
) -> Any:
    """
    Async completion function with support for metadata and tracing.
    
    Args:
        prompt: The prompt to send to the model
        gen_name: Optional name for the generation
        model: Model to use (default: 'gpt-4o')
        response_format: Optional response format specification
        trace_id: Optional trace ID for tracking
        cont_trace: Whether to continue an existing trace
        temperature: Optional temperature setting
        tags: Optional tags for the completion
        prompt_params: Optional parameters for the prompt
        
    Returns:
        Completion response from the model
    """
    metadata = {'tags': []}
    if gen_name:
        metadata['generation_name'] = gen_name
        metadata['trace_name'] = gen_name
        metadata['tags'].append(gen_name)
    if tags:
        metadata['tags'] += tags
    if prompt_params:
        metadata['prompt_params'] = prompt_params

    if trace_id:
        if not cont_trace:
            metadata['trace_id'] = trace_id
        else:
            metadata['existing_trace_id'] = trace_id

    kwargs = {
        'model': model,
        'messages': [{"role": "user", "content": prompt}],
        'metadata': metadata,
    }

    if response_format:
        kwargs['response_format'] = response_format
    if temperature:
        kwargs['temperature'] = temperature

    router = get_router()
    return await router.acompletion(**kwargs)

def cc(completion):
    """
    Extract content from a completion response.
    
    Args:
        completion: The completion response
        
    Returns:
        str: The content from the completion
    """
    return completion.choices[0].message.content 