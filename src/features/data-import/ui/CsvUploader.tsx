'use client'
import React, { useState } from 'react'

export const CsvUploader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setError(null);

        if(!file) {
            setSelectedFile(null);
            return;
        }

        if(file?.type === 'text/csv') {
            setSelectedFile(file);
            setError(null);
        } else {
            setSelectedFile(null);
            setError('Please select a valid CSV file');
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        console.log('Uploading file:', selectedFile.name);
        alert(`File ${selectedFile.name} uploaded successfully!`);
    }

  return (
       <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Upload CSV file
      </h2>

      <div className="mb-4">
        <label
          htmlFor="csv-file"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select a File
        </label>
        <input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {selectedFile && !error && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✓ Selected file: <strong>{selectedFile.name}</strong>
          </p>
          <p className="text-xs text-green-600 mt-1">
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || !!error}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors"
      >
        Upload File
      </button>
    </div>
  )
}
