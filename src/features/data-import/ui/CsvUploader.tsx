'use client'
import React, { useState } from 'react'
import { useUsageDataStore } from '../application/useUsageDataStore'
import { useCsvWorker } from '../application/useCsvWorker'
import { UploadSummary } from './UploadSummary'
import { ValidationErrorList } from './ValidationErrorList'
import { FileInput } from '@/src/shared/ui/FileInput'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export const CsvUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const {
    usageData,
    isLoading,
    error,
    missingColumns,
    invalidRows,
    setLoading,
    clearData,
    setParseResult,
  } = useUsageDataStore()
  const { parseFile } = useCsvWorker()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    setSelectedFile(null)
    setFileError(null)
    clearData()

    if (!selected) return

    const isTooLarge = selected.size > MAX_FILE_SIZE
    const isInvalidType = selected.type !== 'text/csv'

    if (isInvalidType || isTooLarge) {
      let errorMessage = 'Please select a valid CSV file.'
      if (isTooLarge) {
        errorMessage += ' File size exceeds the maximum limit of 10MB.'
      }
      setSelectedFile(null)
      setFileError(errorMessage)
    } else {
      setSelectedFile(selected)
      setFileError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)

    try {
      const result = await parseFile(selectedFile)
      setParseResult(result)

      if (result.success) {
        setSelectedFile(null)
      }
    } catch (err) {
      setParseResult({
        success: false,
        rows: [],
        error: 'An unexpected error occurred during file parsing.',
      })
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const hasData = usageData && usageData.length > 0
  const isWarning = error?.includes('ignored')
  const isError = error && !isWarning
  const hasMissingColumns = missingColumns && missingColumns.length > 0
  const hasInvalidRows = invalidRows && invalidRows.length > 0

  return (
    <section
      className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex flex-col items-center"
      aria-labelledby="csv-uploader-title"
    >
      <h2 id="csv-uploader-title" className="mb-4 text-2xl font-extrabold text-blue-900 text-center tracking-tight">
        Load Usage Data CSV
      </h2>

      <FileInput
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        isLoading={isLoading}
        fileError={fileError}
        hasData={hasData}
        label="Select a CSV file containing usage data"
      />

      {isError && (
        <ValidationErrorList
          hasMissingColumns={hasMissingColumns}
          hasInvalidRows={hasInvalidRows}
          missingColumns={missingColumns || []}
          invalidRows={invalidRows || []}
          error={error}
        />
      )}

      {hasData && (
        <UploadSummary
          rows={usageData.length}
          error={error!}
          isWarning={isWarning}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !!fileError || isLoading}
          className="w-full sm:w-1/2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white text-base transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          aria-label="Load selected CSV file"
        >
          {isLoading ? 'Parsing...' : 'Load File'}
        </button>
        <button
          onClick={clearData}
          disabled={!hasData || !!fileError || isLoading}
          className="w-full sm:w-1/2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white text-base transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          aria-label="Clear uploaded data"
        >
          Clear Data
        </button>
      </div>
    </section>
  )
}