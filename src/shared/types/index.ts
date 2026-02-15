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
