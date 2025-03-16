import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectIntro() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Enhancing Model Performance with RFT and AutoDidact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">
          Our project leverages Reinforcement Fine-Tuning (RFT) with AutoDidact to improve model performance on tasks involving the Model Context Protocol (MCP).
        </p>
        <div className="space-y-2">
          <h3 className="font-semibold">Our Approach:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Initial evaluation of leading models: GPT-4o, Claude 3.7, and Llama 3.3 70B</li>
            <li>Implementation of RFT using AutoDidact framework</li>
            <li>Fine-tuning Llama 3.3 70B on specialized MCP datasets</li>
            <li>Comparative analysis of performance improvements</li>
          </ul>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Learn more about the technologies:</p>
          <ul className="list-none space-y-1">
            <li>
              <a href="https://github.com/dCaples/AutoDidact" className="text-blue-600 hover:underline">
                AutoDidact Framework
              </a>
            </li>
            <li>
              <a href="https://benchflow.ai/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                BenchFlow - Customized benchmark generation and running
              </a>
            </li>
            <li>
              <a href="https://modelcontextprotocol.io/" className="text-blue-600 hover:underline">
                Model Context Protocol
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 