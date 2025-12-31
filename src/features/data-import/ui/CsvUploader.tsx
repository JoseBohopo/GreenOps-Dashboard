'use client'
import React, { useRef, useState } from 'react'
import { useUsageDataStore } from '../application/useUsageDataStore'

export const CsvUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [parseDetails, setParseDetails] = useState<string[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isLoading, uploadAndParseCsv, error } = useUsageDataStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)
    useUsageDataStore.getState().clearData()
    setParseDetails(null)

    if (!file) {
      setSelectedFile(null)
      return
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

    const result = await uploadAndParseCsv(selectedFile)
    if (result.success) {
      setParseDetails([`Successfully parsed ${result.rowCount} rows.`])
      setSelectedFile(null)
    } else {
      setParseDetails(result.details || null)
      console.error('Parsing error:', result.error)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Load Usage Data CSV
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
          onClick={handleButtonClick}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-md
            text-sm font-medium text-gray-700
            hover:bg-gray-50 hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
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
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✓ Selected file: <strong>{selectedFile.name}</strong>
          </p>
          <p className="text-xs text-green-600 mt-1">
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
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
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-semibold text-green-700">
            ✓ File parsed successfully:
          </p>
          {parseDetails.map((detail, index) => (
            <p key={index} className="text-xs text-green-600 mt-1">
              {detail}
            </p>
          ))}
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
