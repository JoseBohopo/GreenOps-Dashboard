import { DataInsights } from '@/src/shared/types';
import { formatBytes, formatDateRange, formatDuration, formatNumber } from '../../../shared/utils/formatNumber';
import { EyeIcon, ClockIcon, DatabaseIcon, DocumentIcon } from '../../../shared/ui/icons';
import React from 'react';

export interface MetricConfig {
  title: string;
  subtitle: string | ((insights: DataInsights) => string);
  value: (insights: DataInsights) => string;
  icon: React.ReactNode;
}

export const METRIC_CONFIGS: MetricConfig[] = [
  {
    title: "Total Page Views",
    subtitle: (insights) => formatDateRange(insights.dateRange),
    value: (insights) => formatNumber(insights.totalPageViews),
    icon: <EyeIcon />,
  },
  {
    title: "Avg Session Duration",
    subtitle: "per session",
    value: (insights) => formatDuration(insights.avgSessionDuration),
    icon: <ClockIcon />,
  },
  {
    title: "Data Transfer",
    subtitle: "total transferred",
    value: (insights) => formatBytes(insights.totalDataTransfer),
    icon: <DatabaseIcon />,
  },
  {
    title: "Records Loaded",
    subtitle: "valid entries",
    value: (insights) => formatNumber(insights.totalRecords),
    icon: <DocumentIcon />,
  },
];