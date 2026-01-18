import { ParseResult, UsageDataRow } from '../domain/types';
import { parseCsv } from './csvParser';
import { validateUsageData } from '../domain/validation';

globalThis.onmessage = async (event: MessageEvent<{ file: File }>) => {
    const { file } = event.data;

    try {
        const parseResult = await parseCsv(file);

        if (!parseResult.success) {
            self.postMessage(parseResult);
            return;
        }

        const validationResult = validateUsageData(parseResult);

        const response = {
            success: validationResult.validRows.length > 0,
            rows: validationResult.validRows,
            rowCount: validationResult.validRows.length,
            invalidRows:
                validationResult.invalidRows.length > 0
                    ? validationResult.invalidRows.map((inv) => ({
                          rowNumber: inv.rowNumber,
                          error: inv.error.message,
                      }))
                    : undefined,
            error:
                validationResult.invalidRows.length > 0
                    ? `${validationResult.invalidRows.length} rows failed validation`
                    : undefined,
        };

        self.postMessage(response);
    } catch (error) {
        const errorResult: ParseResult<UsageDataRow> = {
            success: false,
            error: 'An unexpected error occurred during parsing with the worker.',
            rows: [],
            missingColumns: [
                error instanceof Error ? error.message : String(error),
            ],
        };
        self.postMessage(errorResult);
    }
};