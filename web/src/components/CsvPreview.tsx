"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CsvData = {
  headers: string[];
  rows: string[][];
}

export function CsvPreview({ file }: { file: File | null }) {
  const [data, setData] = useState<CsvData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const rowsPerPage = 10
  
  const loadCsvData = async () => {
    if (!file) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const text = await file.text()
      const lines = text.split('\n')
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty')
      }
      
      // Parse headers (first line)
      const headers = lines[0].split(',').map(header => header.trim())
      
      // Parse rows (remaining lines)
      const rows = lines.slice(1)
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(line => line.split(',').map(cell => cell.trim()))
      
      setData({ headers, rows })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load data when file changes
  useEffect(() => {
    if (file) {
      loadCsvData()
    } else {
      setData(null)
      setCurrentPage(1)
    }
  }, [file])
  
  if (!file) {
    return null
  }
  
  const totalPages = data ? Math.ceil(data.rows.length / rowsPerPage) : 0
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentRows = data?.rows.slice(startIndex, startIndex + rowsPerPage) || []
  
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Data Preview: {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
} 