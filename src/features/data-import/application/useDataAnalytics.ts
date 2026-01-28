'use client';
import { UsageDataRow } from "../domain/types";
import { useUsageDataStore } from "./useUsageDataStore";

export interface DataInsights {
    totalPageViews: number;
    avgSessionDuration: number;
    totalDataTransfer: number;
    totalRecords: number;
    dateRange: {
        from: string;
        to: string;
    } | null;
}

export const calculateDataInsights = (data: UsageDataRow[] | null): DataInsights => {
    if (!data || data.length === 0) {
        return {
            totalPageViews: 0,
            avgSessionDuration: 0,
            totalDataTransfer: 0,
            totalRecords: 0,
            dateRange: null,
        };
    }

    const totalPageViews = data.reduce((sum, row) => sum + row.pageViews, 0);

    const totalSessionDuration = data.reduce((sum, row) => sum + row.avgSessionDuration, 0);
    const avgSessionDuration = totalSessionDuration / data.length;
    const totalDataTransfer = data.reduce((sum, row) => sum + row.dataTransfer, 0);
    const totalRecords = data.length;

    const dates = data.map(row => row.date).sort((a, b) => a.localeCompare(b));
    const dateRange = {
        from: dates[0],
        to: dates.at(-1)!
    }

    return {
        totalPageViews,
        totalDataTransfer,
        avgSessionDuration: Math.round(avgSessionDuration),
        totalRecords,
        dateRange,
  };
};

export const useDataInsights = (): DataInsights => {
    const { usageData } = useUsageDataStore();
    return calculateDataInsights(usageData);
};