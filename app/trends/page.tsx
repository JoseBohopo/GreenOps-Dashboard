'use client';

import { useUsageDataStore } from '@/src/features/data-import/application/useUsageDataStore';
import Trends from '@/src/features/data-import/ui/trends';
import Link from 'next/link';

const TrendsPage = () => {
    const { usageData } = useUsageDataStore();

    if (!usageData) {
        return (
            <main
                className="flex flex-col justify-center items-center p-4 min-h-[50dvh]"
                role="main"
                aria-labelledby="no-data-title"
            >
                <h2
                    id="no-data-title"
                    className="text-2xl font-bold mb-4 text-gray-900"
                >
                    No Data Available
                </h2>
                <p className="text-gray-700 mb-6">
                    Please upload a CSV file first.
                </p>
                <Link
                    className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
                    role="button"
                    aria-label="Back to Import"
                    tabIndex={0}
                    href="/import"
                    passHref
                >
                    ← Back to Import
                </Link>
            </main>
        );
    }

    return (
        <main className="p-6" role="main" aria-labelledby="trends-title">
            <h1
                id="trends-title"
                className="text-3xl text-center font-bold mb-6 text-gray-900"
            >
                Trends and Insights
            </h1>
            <Trends data={usageData} />
        </main>
    );
};

export default TrendsPage;