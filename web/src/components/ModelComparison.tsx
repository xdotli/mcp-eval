"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

type ModelKey = "Model A" | "Model B" | "Model C" | "Model D"

const MODEL_NAMES: Record<ModelKey, string> = {
  "Model A": "Llama-3.3-70B-Fine-Tuned",
  "Model B": "GPT-4o",
  "Model C": "Claude 3.7",
  "Model D": "Llama-3.3-70B-Base"
}

type EvaluationResults = {
  accuracy: Record<ModelKey, number>;
  performance: Record<ModelKey, {
    poor: number;
    acceptable: number;
    good: number;
    excellent: number;
  }>;
}

export function ModelComparison() {
  const [showResults, setShowResults] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [currentModel, setCurrentModel] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [evaluationLogs, setEvaluationLogs] = useState<string[]>([])
  const [modelData, setModelData] = useState<EvaluationResults>({
    accuracy: {
      "Model A": 0,
      "Model B": 0,
      "Model C": 0,
      "Model D": 0
    },
    performance: {
      "Model A": { poor: 0, acceptable: 0, good: 0, excellent: 0 },
      "Model B": { poor: 0, acceptable: 0, good: 0, excellent: 0 },
      "Model C": { poor: 0, acceptable: 0, good: 0, excellent: 0 },
      "Model D": { poor: 0, acceptable: 0, good: 0, excellent: 0 }
    }
  })

  const startEvaluation = async () => {
    try {
      setIsEvaluating(true)
      setError(null)
      setEvaluationLogs([])
      setCurrentModel("Starting evaluation...")
      
      const response = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }))
        throw new Error(errorData.detail || 'Evaluation failed')
      }

      const results = await response.json()
      
      // Transform the data into the expected format
      const transformedData: EvaluationResults = {
        accuracy: {},
        performance: {}
      } as EvaluationResults

      Object.entries(results).forEach(([modelKey, data]: [string, any]) => {
        transformedData.accuracy[modelKey as ModelKey] = data.accuracy
        transformedData.performance[modelKey as ModelKey] = data.performance
        
        // Add evaluation log
        setEvaluationLogs(prev => [...prev, 
          `${MODEL_NAMES[modelKey as ModelKey]}: ${data.accuracy.toFixed(2)}% accuracy`
        ])
      })

      setModelData(transformedData)
      setShowResults(true)
      setCurrentModel(null)
    } catch (error) {
      console.error('Evaluation error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setShowResults(false)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Model Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <Button
            onClick={startEvaluation}
            disabled={isEvaluating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            variant="default"
          >
            {isEvaluating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {currentModel || "Evaluation in Progress..."}
              </>
            ) : (
              "Start Evaluation"
            )}
          </Button>
        </div>

        {isEvaluating && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Evaluation Progress:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {evaluationLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
              {currentModel && (
                <div className="text-blue-600">{currentModel}</div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showResults && !error ? (
          <Tabs defaultValue="accuracy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
              <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accuracy" className="space-y-4">
              {(Object.entries(modelData.accuracy) as [ModelKey, number][]).map(([modelKey, accuracy]) => (
                <div key={modelKey} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{MODEL_NAMES[modelKey]}</span>
                    <span className="text-sm">{accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-6">
              {(Object.entries(modelData.performance) as [ModelKey, { poor: number, acceptable: number, good: number, excellent: number }][]).map(([modelKey, stats]) => (
                <div key={modelKey} className="space-y-2">
                  <h3 className="font-medium">{MODEL_NAMES[modelKey]}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-medium">{stats.poor.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Poor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{stats.acceptable.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Acceptable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{stats.good.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Good</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{stats.excellent.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Excellent</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          !error && !isEvaluating && (
            <div className="text-center text-gray-500 py-8">
              Click "Start Evaluation" to see model performance comparison
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
} 