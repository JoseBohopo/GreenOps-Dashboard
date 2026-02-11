'use client';
import { useDataInsights } from '@/src/features/data-import/application/useDataAnalytics';
import { CsvUploader } from '@/src/features/data-import/ui/CsvUploader'
import { DataSummary } from '@/src/features/data-import/ui/DataSummary'

const ImportPage = () => {
  const insights = useDataInsights();
  return (
    <div className="flex flex-col justify-around items-center p-2 md:p-4 min-h-[50dvh] shadow-md bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Import Data
      </h1>
      <p className="text-gray-600 mb-8">
        Upload a CSV file with usage data to analyze environmental impact.
      </p>
      <CsvUploader />
      <DataSummary title="Data Summary" subtitle="Overview of your uploaded usage data" insights={insights} />
    </div>
  )
}

export default ImportPage
