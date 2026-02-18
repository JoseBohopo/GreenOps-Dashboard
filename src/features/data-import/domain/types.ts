import { IngestDataRow } from "@/src/domain/schemas";
import { ZodError } from "zod";

export interface UsageDataRow {
    date: string;
    pageViews: number;
    dataTransfer: number;
    avgSessionDuration: number;
}

export interface Accumulator {
    totalPageViews: number;
    totalSessionDuration: number;
    totalDataTransfer: number;
    dates: string[];
}

export type ParseResult<T> = {
    success: boolean;
    invalidRows?: { rowNumber: number; error: string }[];
    rows: T[];
    rowCount?: number;
    error?: string;
    missingColumns?: string[];
}

export interface ParsingValidation {
    valid: boolean;
    missingColumns: string[];
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
    missingColumns?: string[];
    invalidRows?: { rowNumber: number; error: string }[];

    setParseResult: (result: ParseResult<UsageDataRow>) => void;
    clearData: () => void;
    setLoading: (isLoading: boolean) => void;
    setData: (data: UsageDataRow[]) => void;
}

export interface InvalidRecord {
    data: UsageDataRow;
    error: ZodError;
    rowNumber: number;
}

export interface ValidationResult {
    validRows: IngestDataRow[];
    invalidRows: InvalidRecord[];
}