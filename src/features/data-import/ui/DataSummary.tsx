'use client';
import React from 'react';
import { MetricCard } from '../../../shared/ui/MetricCard';
import { METRIC_CONFIGS } from '../application/metricConfigs';
import { DataInsights } from '@/src/shared/types';

interface DataSummaryProps {
  insights: DataInsights;
  title?: string;
  subtitle?: string;
}

const MappedMetricsCard = ({ insights }: Pick<DataSummaryProps, 'insights'>) => {
  return METRIC_CONFIGS.map((metric) => (
    <MetricCard
      key={metric.title}
      title={metric.title}
      subtitle={
        typeof metric.subtitle === 'function'
          ? metric.subtitle(insights)
          : metric.subtitle
      }
      value={metric.value(insights)}
      icon={metric.icon}
    />
  ));
};

const DataSummaryComponent: React.FC<DataSummaryProps> = ({
  insights,
  title,
  subtitle,
}) => {
  if (!insights || insights.totalRecords === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MappedMetricsCard insights={insights} />
      </div>
    </div>
  );
};

export const DataSummary = React.memo(DataSummaryComponent);