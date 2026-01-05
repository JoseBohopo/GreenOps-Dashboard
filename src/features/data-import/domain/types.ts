export interface UsageDataRow {
    date: string;
    pageViews: number;
    dataTransfer: number;
    avgSessionDuration: number;
}

export type ParseResult<T> =
    | {
            success: true;
            data: T[];
            rowCount: number;
        }
    | {
            success: false;
            error: string;
            details?: string[];
        };

export interface ParsingValidation {
    hasRequiredColumns: boolean;
    missingColumns: string[];
    rowsWithErrors: Array<{ row: number; error: string }>;
}

export interface UnvalidatedCsvRow {
    date?: unknown;
    pageViews?: unknown;
    dataTransfer?: unknown;
    avgSessionDuration?: unknown;
    [key: string]: unknown;
}

export interface UsageDataState {
    usageData: UsageDataRow[] | null;
    isLoading: boolean;
    error: string | null;
    lastUploadDate: string | null;

    setParseResult: (result: ParseResult<UsageDataRow>) => void;
    clearData: () => void;
    setLoading: (isLoading: boolean) => void;
    setData: (data: UsageDataRow[]) => void;
}