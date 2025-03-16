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
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type CsvData = {
  headers: string[];
  rows: string[][];
}

const MAX_CELL_LENGTH = 100
const DEFAULT_COLUMN_WIDTH = 150
const EXPANDED_COLUMN_WIDTH = 300

export function CsvPreview({ file }: { file: File | null }) {
  const [data, setData] = useState<CsvData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedColumns, setExpandedColumns] = useState<Set<number>>(new Set())
  
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
      
      const parseCSVLine = (line: string): string[] => {
        const result = []
        let cell = ''
        let isQuoted = false
        let i = 0
        
        while (i < line.length) {
          const char = line[i]
          
          if (char === '"') {
            if (isQuoted && i + 1 < line.length && line[i + 1] === '"') {
              // Handle escaped quotes
              cell += '"'
              i++
            } else {
              // Toggle quoted state
              isQuoted = !isQuoted
            }
          } else if (char === ',' && !isQuoted) {
            // End of cell
            result.push(cell.trim())
            cell = ''
          } else {
            cell += char
          }
          i++
        }
        
        // Add the last cell
        result.push(cell.trim())
        return result
      }
      
      // Parse headers (first line)
      const headers = parseCSVLine(lines[0])
      
      // Parse rows (remaining lines)
      const rows = lines.slice(1)
        .filter(line => line.trim() !== '')
        .map(line => parseCSVLine(line))
      
      // Validate row lengths match header length
      const invalidRows = rows.filter(row => row.length !== headers.length)
      if (invalidRows.length > 0) {
        throw new Error('Some rows have an incorrect number of columns')
      }
      
      setData({ headers, rows })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    if (file) {
      loadCsvData()
      setExpandedColumns(new Set())
      setCurrentPage(1)
    } else {
      setData(null)
      setCurrentPage(1)
    }
  }, [file])

  const toggleColumnExpand = (columnIndex: number) => {
    setExpandedColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnIndex)) {
        newSet.delete(columnIndex)
      } else {
        newSet.add(columnIndex)
      }
      return newSet
    })
  }

  const formatCellContent = (content: string) => {
    if (!content) return '-'
    if (content.length <= MAX_CELL_LENGTH) return content
    return `${content.slice(0, MAX_CELL_LENGTH)}...`
  }

  if (!file) return null

  const totalPages = data ? Math.ceil(data.rows.length / rowsPerPage) : 0
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentRows = data?.rows.slice(startIndex, startIndex + rowsPerPage) || []
  
  return (
    <Card className="w-full max-w-screen-xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Data Preview: {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data ? (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data.headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        style={{
                          minWidth: expandedColumns.has(index) ? EXPANDED_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH,
                          maxWidth: expandedColumns.has(index) ? 'none' : DEFAULT_COLUMN_WIDTH
                        }}
                        onClick={() => toggleColumnExpand(index)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{header || 'Unnamed Column'}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          style={{
                            minWidth: expandedColumns.has(cellIndex) ? EXPANDED_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH,
                            maxWidth: expandedColumns.has(cellIndex) ? 'none' : DEFAULT_COLUMN_WIDTH
                          }}
                          className={expandedColumns.has(cellIndex) ? 'whitespace-normal break-words' : 'truncate'}
                          title={cell}
                        >
                          {formatCellContent(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing rows {startIndex + 1}-{Math.min(startIndex + rowsPerPage, data.rows.length)} of {data.rows.length}
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