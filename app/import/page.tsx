import React from 'react'
import { CsvUploader } from '@/src/features/data-import/ui/CsvUploader'

const ImportPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Import Data
      </h1>
      <p className="text-gray-600 mb-8">
        Upload a CSV file with usage data to analyze environmental impact.
      </p>
      <CsvUploader />
    </div>
  )
}
export default ImportPage;
