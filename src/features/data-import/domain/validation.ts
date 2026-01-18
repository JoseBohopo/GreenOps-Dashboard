import { IngestDataRowSchema } from "@/src/domain/schemas";
import { ParseResult, UsageDataRow, ValidationResult } from "./types";

/**
 * Validates an array of parsed usage data rows against the domain schema.
 *
 * @param data - The parsed result containing rows to validate
 * @returns ValidationResult with segregated valid and invalid records
 *
 * @example
 * ```ts
 * const parsed = await parseCsv(file);
 * if (parsed.success) {
 *   const result = validateUsageData(parsed);
 *   console.log(`Valid: ${result.validRows.length}`);
 *   console.log(`Invalid: ${result.invalidRows.length}`);
 * }
 * ```
 */
export const validateUsageData = (
    data: ParseResult<unknown>
): ValidationResult => {
    if (!data.success) {
        return { validRows: [], invalidRows: [] };
    }

    return data.rows.reduce<ValidationResult>(
        (acc, row, index) => {
            const parseResult = IngestDataRowSchema.safeParse(row);

            if (parseResult.success && parseResult.data) {
                acc.validRows.push(parseResult.data);
  
            } 
            if (parseResult.error) {
                acc.invalidRows.push({
                    data: row as UsageDataRow,
                    error: parseResult.error,
                    rowNumber: index + 1,
                });
            }

            return acc;
        },
        { validRows: [], invalidRows: [] }
    );
};