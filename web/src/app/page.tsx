import { ProjectIntro } from "@/components/ProjectIntro"
import { DatasetUpload } from "@/components/DatasetUpload"
import { ModelComparison } from "@/components/ModelComparison"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">
          Benchmarking Model Performance with on MCP
        </h1>
        
        <div className="grid gap-8 max-w-4xl mx-auto">
          <section>
            <ProjectIntro />
          </section>
          
          <section>
            <DatasetUpload />
          </section>
          
          <section>
            <ModelComparison />
          </section>
        </div>
      </div>
    </main>
  )
}
