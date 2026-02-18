import { DataInsights } from "@/src/shared/types";
import { Accumulator, UsageDataRow } from "./types";

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
        return acc;
    }, { totalPageViews: 0, totalSessionDuration: 0, totalDataTransfer: 0, dates: [] });

    const sortedDates = result.dates.toSorted((a, b) => a.localeCompare(b));

    return {
        totalPageViews: result.totalPageViews,
        avgSessionDuration: result.totalSessionDuration / data.length,
        totalDataTransfer: result.totalDataTransfer,
        totalRecords: data.length,
        dateRange: sortedDates.length > 0 ? { from: sortedDates[0], to: sortedDates.at(-1)! } : null,
    };
};