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

export interface MetricCardProps {
    title: string;
    subtitle?: string;
    value: string | number;
    icon?: ReactNode;
    className?: string;
}
