'use client'
import React, { useRef, useState } from 'react'
import { useUsageDataStore } from '../application/useUsageDataStore'
import { useCsvWorker } from '../application/useCsvWorker'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export const CsvUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { usageData, isLoading, error, missingColumns, invalidRows,setLoading, clearData, setParseResult } =
    useUsageDataStore()
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
        <div className="mb-4 w-56 rounded-lg border border-green-200 bg-green-50 p-3 sm:w-sm sm:p-4">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-green-700">
                Selected:{' '}
                <span className="wrap-break-words font-normal">
                  {selectedFile.name}
                </span>
              </p>
              <p className="mt-1 text-xs text-green-600">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm font-semibold text-red-700">{error}</p>
          {hasMissingColumns &&  missingColumns.map((col) => (
            <p key={col} className="mt-1 text-xs text-red-600">
              Missing required column: {col}
            </p>
          ))}
          {hasInvalidRows && invalidRows.map(({ rowNumber, error }) => (
            <p key={rowNumber} className="mt-1 text-xs text-red-600">
              Row {rowNumber}: {error}
            </p>
          ))}
        </div>
      )}

      {hasData && (
        <div
          aria-live="polite"
          className={`mb-4 rounded-lg border p-3 sm:p-4 ${
            isWarning
              ? 'border-yellow-200 bg-yellow-50'
              : 'border-green-200 bg-green-50'
          }`}
        >
          <div className="flex items-start gap-2">
            <svg
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                isWarning ? 'text-yellow-600' : 'text-green-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p
                className={`text-sm font-semibold ${
                  isWarning ? 'text-yellow-700' : 'text-green-700'
                }`}
              >
                ✓ Successfully loaded {usageData.length} rows
              </p>
              {isWarning && (
                <p className="mt-1 text-xs text-yellow-600 sm:text-sm">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
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
