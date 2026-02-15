'use client';
import { DataInsights } from "@/src/shared/types";
import { UsageDataRow } from "../domain/types";
import { useUsageDataStore } from "./useUsageDataStore";

interface Accumulator {
    totalPageViews: number;
    totalSessionDuration: number;
    totalDataTransfer: number;
    dates: string[];
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


const result = data.reduce<Accumulator>((acc, row) => {
    acc.totalPageViews += row.pageViews;
    acc.totalSessionDuration += row.avgSessionDuration;
    acc.totalDataTransfer += row.dataTransfer;
    acc.dates.push(row.date);
    acc.dates.toSorted((a, b) => a.localeCompare(b));
    return acc;
}, { totalPageViews: 0, totalSessionDuration: 0, totalDataTransfer: 0, dates: [] });

return {
    totalPageViews: result.totalPageViews,
    avgSessionDuration: result.totalSessionDuration / data.length,
    totalDataTransfer: result.totalDataTransfer,
    totalRecords: data.length,
    dateRange: result.dates.length > 0 ? { from: result.dates[0], to: result.dates.at(-1)! } : null,
};
};

export const useDataInsights = (): DataInsights => {
    const { usageData } = useUsageDataStore();
    return calculateDataInsights(usageData);
};