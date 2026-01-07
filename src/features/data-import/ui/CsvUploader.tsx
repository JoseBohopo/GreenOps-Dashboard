'use client'
import React, { useRef, useState } from 'react'
import { useUsageDataStore } from '../application/useUsageDataStore'
import { useCsvWorker } from '../application/useCsvWorker'

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const CsvUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [parseDetails, setParseDetails] = useState<string[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isLoading, error, setLoading, clearData, setParseResult } =
    useUsageDataStore()
  const { parseFile } = useCsvWorker()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)
    clearData()
    setParseDetails(null)

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds the maximum limit of 10MB.');
        return;
    }

    if (file?.type === 'text/csv') {
      setSelectedFile(file)
      setFileError(null)
    } else {
      setSelectedFile(null)
      setFileError('Please select a valid CSV file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)

    try {
      const result = await parseFile(selectedFile)
      setParseResult(result)
      if (result.success) {
        setLoading(false)
        setParseDetails([`Successfully parsed ${result.rowCount} rows.`])
        setSelectedFile(null)
      } else {
        setParseDetails(result.details || null)
        console.error('Parsing error:', result.error)
      }
    } catch (err) {
      setFileError('An error occurred while parsing the file.')
      console.error('Unexpected error:', err)
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-xs md:max-w-md mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Load Usage Data CSV
      </h2>

      <div className="mb-4 w-xs  sm:w-sm md:w-md max-w-xs md:max-w-md">
        <label aria-label='Select Csv File' className="block text-sm font-medium text-gray-700 mb-2">
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
          onClick={handleButtonClick}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-md
            text-sm font-medium text-gray-700
            hover:bg-gray-50 hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed truncate text-left
            "
        >
          {selectedFile ? selectedFile.name : 'Choose CSV file...'}
        </button>
      </div>

      {fileError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{fileError}</p>
        </div>
      )}

        {selectedFile && !fileError && !error && !parseDetails && (
          <div className="w-xs sm:w-sm md:w-md mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-700 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                  Selected: <span className="font-normal wrap-break-words">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}

      {error && parseDetails && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-semibold text-red-700 mb-2">{error}</p>
          <ul className="text-xs text-red-600 list-disc list-inside">
            {parseDetails.map((detail, index) => (
              <li key={`${detail}-${index}`}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {!error && parseDetails && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-700">
                  ✓ File parsed successfully
                </p>
                {parseDetails.map((detail, index) => (
                  <p key={index} className="text-xs sm:text-sm text-green-600 mt-1">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || !!fileError || isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors"
      >
        {isLoading ? 'Parsing...' : 'Load File'}
      </button>
    </div>
  )
}
