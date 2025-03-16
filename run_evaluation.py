import asyncio
import csv
import pandas as pd
import numpy as np
from evaluator import evaluate_traces
from collections import Counter

async def main():
    # Read the CSV file
    df = pd.read_csv('enhanced_mcp_traces.csv')
    
    # Get the traces from the CSV
    traces = df['traces'].tolist()
    expected_scores = df['score'].tolist()
    
    # Run evaluation
    print("Running evaluation...")
    scores = await evaluate_traces(traces)
    
    # Compare results
    print("\nEvaluation Results:")
    print("=" * 50)
    print(f"Total traces evaluated: {len(traces)}")
    
    # Calculate statistics
    score_diffs = [abs(s1 - s2) for s1, s2 in zip(scores, expected_scores)]
    avg_diff = sum(score_diffs) / len(score_diffs)
    
    print(f"\nAverage absolute difference from expected scores: {avg_diff:.2f}")
    
    # Print detailed results
    print("\nDetailed Results:")
    print("=" * 50)
    for i, (score, expected) in enumerate(zip(scores, expected_scores)):
        trace_id = df['id'].iloc[i]
        print(f"Trace {trace_id}:")
        print(f"  Evaluator Score: {score:.1f}")
        print(f"  Expected Score:  {expected:.1f}")
        print(f"  Difference:      {abs(score - expected):.1f}")
        print("-" * 30)

def calculate_holistic_metrics(df):
    # Get scores
    scores = df['score'].values
    
    # Basic statistics
    avg_score = np.mean(scores)
    median_score = np.median(scores)
    std_score = np.std(scores)
    min_score = np.min(scores)
    max_score = np.max(scores)
    
    # Score distribution
    score_distribution = Counter(scores)
    
    # Performance categories
    poor = len([s for s in scores if s <= 3])
    acceptable = len([s for s in scores if 3 < s <= 6])
    good = len([s for s in scores if 6 < s <= 8])
    excellent = len([s for s in scores if s > 8])
    
    # Print results
    print("\nHolistic Evaluation Results")
    print("=" * 50)
    print(f"Dataset Size: {len(scores)} traces")
    print("\nScore Statistics:")
    print(f"  Average Score:     {avg_score:.2f}")
    print(f"  Median Score:      {median_score:.2f}")
    print(f"  Standard Dev:      {std_score:.2f}")
    print(f"  Range:             {min_score:.1f} - {max_score:.1f}")
    
    print("\nPerformance Distribution:")
    print(f"  Poor (0-3):        {poor:3d} traces ({poor/len(scores)*100:.1f}%)")
    print(f"  Acceptable (4-6):  {acceptable:3d} traces ({acceptable/len(scores)*100:.1f}%)")
    print(f"  Good (7-8):        {good:3d} traces ({good/len(scores)*100:.1f}%)")
    print(f"  Excellent (9-10):  {excellent:3d} traces ({excellent/len(scores)*100:.1f}%)")
    
    print("\nScore Distribution:")
    for score in sorted(score_distribution.keys()):
        count = score_distribution[score]
        print(f"  Score {score:2d}: {count:3d} traces ({count/len(scores)*100:.1f}%)")

def main():
    # Read the CSV file
    print("Reading dataset...")
    df = pd.read_csv('enhanced_mcp_traces.csv')
    
    # Calculate and display holistic metrics
    calculate_holistic_metrics(df)

if __name__ == "__main__":
    main() 