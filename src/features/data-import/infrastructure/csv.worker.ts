import Papa from 'papaparse';
import {
    UnvalidatedCsvRow,
    ParsingValidation,
    ParseResult,
    UsageDataRow,
} from '../domain/types';

const REQUIRED_COLUMNS = [
    'date',
    'pageViews',
    'dataTransfer',
    'avgSessionDuration',
];

const validateColumns = (headers: string[]): ParsingValidation => {
    const missingColumns = REQUIRED_COLUMNS.filter(
        (col) => !headers.includes(col)
    );

    return {
        hasRequiredColumns: missingColumns.length === 0,
        missingColumns,
        rowsWithErrors: [],
    };
};

const validateRows = (
    row: UnvalidatedCsvRow,
    index: number
): { valid: boolean; error?: string } => {
    if (!row.date || typeof row.date !== 'string' || row.date.trim() === '') {
        return { valid: false, error: `Row ${index + 1}: 'date' is required.` };
    }

    const pageViews = Number(row.pageViews);
    if (Number.isNaN(pageViews) || pageViews < 0) {
        return { valid: false, error: `Row ${index + 1}: 'Invalid pageViews'` };
    }

    const dataTransfer = Number(row.dataTransfer);
    if (Number.isNaN(dataTransfer) || dataTransfer < 0) {
        return {
            valid: false,
            error: `Row ${index + 1}: 'Invalid dataTransfer'`,
        };
    }

    const avgSessionDuration = Number(row.avgSessionDuration);
    if (Number.isNaN(avgSessionDuration) || avgSessionDuration < 0) {
        return {
            valid: false,
            error: `Row ${index + 1}: 'Invalid avgSessionDuration'`,
        };
    }

    return { valid: true };
};

globalThis.onmessage = async (event: MessageEvent<{ file: File }>) => {
    const { file } = event.data;

    try {
        const text = await file.text();
        const result = await new Promise<ParseResult<UsageDataRow>>(
            (resolve) => {
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const headers = results.meta.fields || [];
                        const columnValidation = validateColumns(headers);

                        if (!columnValidation.hasRequiredColumns) {
                            resolve({
                                success: false,
                                error: 'Missing required columns',
                                details: columnValidation.missingColumns,
                            });
                            return;
                        }

                        const validRows: UsageDataRow[] = [];
                        const errors: string[] = [];

                        results.data.forEach((row: unknown, index: number) => {
                            const validation = validateRows(
                                row as UnvalidatedCsvRow,
                                index
                            );
                            if (validation.valid) {
                                const record = row as Record<string, number>;
                                validRows.push({
                                    date: (
                                        record.date as unknown as string
                                    ).trim(),
                                    pageViews: Number(record.pageViews),
                                    dataTransfer: Number(record.dataTransfer),
                                    avgSessionDuration: Number(
                                        record.avgSessionDuration
                                    ),
                                });
                            } else if (validation.error) {
                                errors.push(validation.error);
                            }
                        });

                        if (errors.length > 0) {
                            resolve({
                                success: false,
                                error: 'Validation errors in rows',
                                details: errors.slice(0, 10),
                            });
                        } else {
                            resolve({
                                success: true,
                                data: validRows,
                                rowCount: validRows.length,
                            });
                        }
                    },
                    error: (error: Error) => {
                        resolve({
                            success: false,
                            error: 'Failed to parse CSV',
                            details: [
                                error.message ? error.message : String(error),
                            ],
                        });
                    },
                });
            }
        );

        self.postMessage(result);
    } catch (error) {
        const errorResult: ParseResult<UsageDataRow> = {
            success: false,
            error: 'An unexpected error occurred during parsing with the worker.',
            details: [error instanceof Error ? error.message : String(error)],
        };
        self.postMessage(errorResult);
    }
};