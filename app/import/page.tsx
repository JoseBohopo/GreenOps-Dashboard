'use client';

import { useDataInsights } from '@/src/features/data-import/application/useDataAnalytics';
import { CsvUploader } from '@/src/features/data-import/ui/CsvUploader';
import { DataSummary } from '@/src/features/data-import/ui/DataSummary';
import Link from 'next/link';



const ImportPage = () => {
  const insights = useDataInsights();

  return (
    <main className="min-h-[60dvh] flex flex-col items-center justify-center py-12 px-4 md:px-0 bg-linear-to-br from-gray-50 to-blue-50" role="main" aria-labelledby="import-title">
      <section className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">
        <h1 id="import-title" className="text-4xl font-extrabold mb-4 text-blue-900 tracking-tight text-center">
          Import Data
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
          Upload a CSV file with usage data to analyze your environmental impact and unlock actionable insights.
        </p>
        <div className="w-full mb-8">
          <CsvUploader />
        </div>
        <div className="w-full">
          <DataSummary
            title="Data Summary"
            subtitle="Overview of your uploaded usage data"
            insights={insights}
          />
        </div>
        {insights.dateRange && (
          <div className="mt-12 w-full text-center">
            <Link                 className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 text-lg"
                aria-label="See Trends and Insights"
                tabIndex={0}
                aria-disabled={!insights} href="/trends" passHref >
                <span>See Trends and Insights</span>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default ImportPage;
