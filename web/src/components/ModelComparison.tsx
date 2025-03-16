"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const modelData = {
  accuracy: {
    "Model A": 78.5,
    "Model B": 82.3,
    "Model C": 85.7,
    "Model D": 91.2
  },
  performance: {
    "Model A": {
      poor: 15,
      acceptable: 25,
      good: 40,
      excellent: 20
    },
    "Model B": {
      poor: 12,
      acceptable: 23,
      good: 42,
      excellent: 23
    },
    "Model C": {
      poor: 8,
      acceptable: 22,
      good: 45,
      excellent: 25
    },
    "Model D": {
      poor: 5,
      acceptable: 15,
      good: 45,
      excellent: 35
    }
  }
}

export function ModelComparison() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Model Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accuracy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy" className="space-y-4">
            {Object.entries(modelData.accuracy).map(([model, accuracy]) => (
              <div key={model} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{model}</span>
                  <span className="text-sm">{accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-6">
            {Object.entries(modelData.performance).map(([model, stats]) => (
              <div key={model} className="space-y-2">
                <h3 className="font-medium">{model}</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-medium">{stats.poor}%</div>
                    <div className="text-xs text-gray-500">Poor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{stats.acceptable}%</div>
                    <div className="text-xs text-gray-500">Acceptable</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{stats.good}%</div>
                    <div className="text-xs text-gray-500">Good</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{stats.excellent}%</div>
                    <div className="text-xs text-gray-500">Excellent</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 