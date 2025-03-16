import asyncio
from typing import List, Optional
from litellm_utils import acomplete, cc

EVAL_PROMPT = """You are an expert conversation evaluator. You will be provided with a conversation trace between users and AI agents.
Please evaluate the conversation based on the following criteria:
1. Task Completion: Did the agent successfully complete the user's request?
2. Communication Quality: Was the interaction clear, professional, and helpful?
3. Efficiency: Was the task completed in a reasonable number of turns?

Rate the conversation on a scale of 0-10, where:
- 0-3: Poor performance
- 4-6: Acceptable performance
- 7-8: Good performance
- 9-10: Excellent performance

Provide your score as a single number between 0 and 10.

Remember to only provide a single number between 0 and 10 and nothing else.

Conversation trace:
{trace}

Score (0-10):"""

async def evaluate_single_trace(trace: str, model: str = "gpt-4o", temperature: float = 0.3) -> float:
    """Evaluate a single conversation trace using the LLM."""
    try:
        response = await acomplete(
            prompt=EVAL_PROMPT.format(trace=trace),
            model=model,
            temperature=temperature,
            tags=["evaluation"]
        )
        score_text = cc(response).strip()
        # Extract the numeric score from the response
        try:
            score = float(score_text)
            return min(max(score, 0), 10)  # Ensure score is between 0 and 10
        except ValueError:
            print(f"Warning: Could not parse score from response: {score_text}")
            return 5.0  # Default score if parsing fails
    except Exception as e:
        print(f"Error evaluating trace: {e}")
        return 5.0  # Default score if evaluation fails

async def evaluate_traces(
    traces: List[str],
    batch_size: int = 20,
    model: str = "gpt-4o",
    temperature: float = 0.3
) -> List[float]:
    """
    Evaluate multiple conversation traces in parallel batches.
    
    Args:
        traces: List of conversation traces to evaluate
        batch_size: Maximum number of parallel requests (default: 20)
        model: Model to use for evaluation
        temperature: Temperature setting for the model
        
    Returns:
        List of scores (0-10) for each trace
    """
    scores = []
    total_traces = len(traces)
    
    # Process traces in batches
    for i in range(0, total_traces, batch_size):
        batch = traces[i:i + batch_size]
        batch_tasks = [
            evaluate_single_trace(trace, model, temperature)
            for trace in batch
        ]
        batch_scores = await asyncio.gather(*batch_tasks)
        scores.extend(batch_scores)
        
        # Log progress
        progress = min(100, (i + batch_size) / total_traces * 100)
        print(f"Progress: {progress:.1f}% ({i + len(batch)}/{total_traces} traces processed)")
    
    return scores

async def main():
    # Example usage
    sample_traces = [
        """User: What's the weather like today?
Agent: The current temperature is 72°F with partly cloudy skies.
User: Thanks!
Agent: You're welcome! Let me know if you need anything else.""",
        
        """User: Can you help me with Python?
Agent: Of course! What specific Python question do you have?
User: How do I create a list?
Agent: You can create a list in Python using square brackets []. For example:
my_list = [1, 2, 3]
Or an empty list:
empty_list = []
User: Perfect, thanks!
Agent: You're welcome! Let me know if you have any other questions."""
    ]
    
    scores = await evaluate_traces(sample_traces)
    for i, score in enumerate(scores):
        print(f"Trace {i + 1} Score: {score}")

if __name__ == "__main__":
    asyncio.run(main())
