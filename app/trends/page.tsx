'use client';
import { useUsageDataStore } from '@/src/features/data-import/application/useUsageDataStore';
import Trends from '@/src/features/data-import/ui/trends';
import Link from 'next/link';
import React from 'react'

const TrendsPage = () => {
    const { usageData} = useUsageDataStore();
    if (!usageData) {
        return (
            <div className="flex flex-col justify-center items-center p-4 min-h-[50dvh]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">No Data Available</h2>
                <p className="text-gray-600 mb-6">Please upload a CSV file first.</p>
                <Link href="/import">
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    ← Back to Import
                </button>
                </Link>
            </div>
        );
    }
    
  return (
    <div className="p-6">
        <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">Trends and Insights</h1>
        <Trends data={usageData} />
    </div>
  )
}

export default TrendsPage;