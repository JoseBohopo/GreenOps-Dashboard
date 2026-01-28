'use client';
import { MetricCard } from '../../../shared/ui/MetricCard';
import { useDataInsights } from '../application/useDataAnalytics';
import { formatBytes, formatDateRange, formatDuration, formatNumber } from '../../../shared/utils/formatNumber';
import React from 'react';

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DataSummaryComponent: React.FC = () => {
  const insights = useDataInsights();

  if (insights.totalRecords === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Data Summary
        </h3>
        <p className="text-sm text-gray-600">
          Overview of your uploaded usage data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Page Views"
          value={formatNumber(insights.totalPageViews)}
          icon={<EyeIcon />}
          subtitle={formatDateRange(insights.dateRange)}
        />
        
        <MetricCard
          title="Avg Session Duration"
          value={formatDuration(insights.avgSessionDuration)}
          icon={<ClockIcon />}
          subtitle="per session"
        />
        
        <MetricCard
          title="Data Transfer"
          value={formatBytes(insights.totalDataTransfer)}
          icon={<DatabaseIcon />}
          subtitle="total transferred"
        />
        
        <MetricCard
          title="Records Loaded"
          value={formatNumber(insights.totalRecords)}
          icon={<DocumentIcon />}
          subtitle="valid entries"
        />
      </div>
    </div>
  );
};

// Memoized export for performance optimization
export const DataSummary = React.memo(DataSummaryComponent);