'use client'
import React, { useRef, useState } from 'react'
import { useUsageDataStore } from '../application/useUsageDataStore'
import { useCsvWorker } from '../application/useCsvWorker'
import UploadSummary from './UploadSummary'
import FileInfoSummary from './FileInfoSummary'
import ValidationErrorList from './ValidationErrorList'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export const CsvUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <div className="mx-auto max-w-xs rounded-lg bg-white p-4 shadow-md sm:p-6 md:max-w-md lg:p-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Load Usage Data CSV
      </h2>

      <div className="mb-4 w-56 max-w-xs sm:w-sm md:max-w-md">
        <label
          htmlFor="csv-file"
          aria-label="Select Csv File"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Select CSV File
        </label>
        <input
          ref={fileInputRef}
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />

        <button
          type="button"
          title={selectedFile?.name || 'Choose CSV file...'}
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full truncate rounded-md border-2 border-gray-300 bg-white
            px-4 py-2 text-left text-sm font-medium
            text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none
            focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedFile ? selectedFile.name : 'Choose CSV file...'}
        </button>
      </div>

      {fileError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{fileError}</p>
        </div>
      )}

      {selectedFile && !fileError && !hasData && (
        <FileInfoSummary selectedFile={selectedFile} />
      )}

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

      <button
        onClick={handleUpload}
        disabled={!selectedFile || !!fileError || isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white
          transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isLoading ? 'Parsing...' : 'Load File'}
      </button>
    </div>
  )
}
