import Papa from 'papaparse';
import { ParsingValidation, ParseResult } from '../domain/types';

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
        valid: missingColumns.length === 0,
        missingColumns,
    };
};

/**
 * Parses a CSV file into raw JavaScript objects.
 * Does NOT perform domain validation - only structural parsing.
 *
 * @param file - The CSV file to parse
 * @returns ParseResult with raw, unvalidated data
 */
export const parseCsv = async (
    file: File
): Promise<ParseResult<unknown>> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: (results) => {
                const headers = results.meta.fields || [];
                const columnValidation = validateColumns(headers);

                if (!columnValidation.valid) {
                    resolve({
                        success: false,
                        error: 'Missing required columns',
                        missingColumns: columnValidation.missingColumns,
                        rows: [],
                    });
                    return;
                }

                resolve({
                    success: true,
                    rows: results.data,
                    rowCount: results.data.length,
                });
            },
            error: (error) => {
                resolve({
                    success: false,
                    error: `CSV parsing failed: ${error.message}`,
                    rows: [],
                });
            },
        });
    });
};
