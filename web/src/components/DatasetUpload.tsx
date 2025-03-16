"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CsvPreview } from "@/components/CsvPreview"

export function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const startTraining = () => {
    setIsTraining(true)
    // Simulate progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress > 100) {
        currentProgress = 100
        clearInterval(interval)
        setTimeout(() => {
          setIsTraining(false)
          setProgress(0)
          setFile(null)
        }, 1000)
      }
      setProgress(currentProgress)
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dataset Upload & Fine-tuning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={isTraining}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            >
              {file ? file.name : "Click to upload enhanced_mcp_traces.csv"}
            </label>
          </div>
          
          <Button
            onClick={startTraining}
            disabled={!file || isTraining}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            variant="default"
          >
            {isTraining ? "Training in Progress..." : "Start Fine-tuning"}
          </Button>
        </div>

        {isTraining && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Fine-tuning progress: {Math.round(progress)}%
            </p>
          </div>
        )}

        <CsvPreview file={file} />
      </CardContent>
    </Card>
  )
} 