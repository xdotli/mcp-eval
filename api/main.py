from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from evaluator import evaluate_traces
import json
import pandas as pd
from typing import Dict, List
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_CONFIGS = {
    "Model A": {"model": "Llama-3.3-8B-Fine-Tuned", "temperature": 0.3},
    "Model B": {"model": "gpt-4o-", "temperature": 0.3},
    "Model C": {"model": "claude-3.5", "temperature": 0.3},
    "Model D": {"model": "Llama-3.3-70B-Fine-Base", "temperature": 0.3},
}

@app.post("/evaluate")
async def evaluate_models():
    try:
        print("\n=== Starting Model Evaluation ===")
        csv_path = os.path.join(os.path.dirname(__file__), 'enhanced_mcp_traces.csv')
        df = pd.read_csv(csv_path)
        traces = df['traces'].tolist()
        
        if not traces:
            raise HTTPException(status_code=400, detail="No traces found in the CSV file")
        
        print(f"Loaded {len(traces)} traces for evaluation")
        results = {}
        
        for model_key, config in MODEL_CONFIGS.items():
            print(f"\nEvaluating {model_key} ({config['model']})...")
            # Evaluate traces for each model
            scores = await evaluate_traces(
                traces=traces[:50],  # Using first 50 traces for faster evaluation
                model=config["model"],
                temperature=config["temperature"],
                batch_size=10  # Smaller batch size for stability
            )
            
            # Calculate performance distribution
            total = len(scores)
            poor = len([s for s in scores if s <= 3])
            acceptable = len([s for s in scores if 3 < s <= 6])
            good = len([s for s in scores if 6 < s <= 8])
            excellent = len([s for s in scores if s > 8])
            
            # Calculate average accuracy (normalized to 100)
            accuracy = sum(scores) / total * 10
            
            print(f"Results for {model_key}:")
            print(f"  Accuracy: {accuracy:.2f}")
            print(f"  Distribution: Poor={poor}, Acceptable={acceptable}, Good={good}, Excellent={excellent}")
            
            results[model_key] = {
                "accuracy": accuracy,
                "performance": {
                    "poor": (poor / total) * 100,
                    "acceptable": (acceptable / total) * 100,
                    "good": (good / total) * 100,
                    "excellent": (excellent / total) * 100
                }
            }
        
        print("\n=== Evaluation Complete ===")
        return results
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="CSV file not found")
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=500, detail="CSV file is empty")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 