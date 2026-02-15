import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsageDataRow, ParseResult, UsageDataState } from '../domain/types';

const invalidRowsErrorResult = (
    invalidRows: Partial<ParseResult<UsageDataRow>['invalidRows']>
) => {
    return invalidRows && invalidRows.length > 0
        ? invalidRows.map((row) => {
                if (!row)
                    return {
                        rowNumber: 0,
                        error: 'Unknown validation error',
                    };
                try {
                    const errorData = JSON.parse(row.error);
                    const firstIssue = Array.isArray(errorData)
                        ? errorData[0]
                        : errorData;
                    const field = firstIssue?.path?.[0] || 'unknown';
                    const message = firstIssue?.message || 'Validation error';
                    return {
                        rowNumber: row.rowNumber,
                        error: `${field}: ${message}`,
                    };
                } catch {
                    return {
                        rowNumber: row.rowNumber,
                        error: row.error,
                    };
                }
            })
        : undefined;
};

export const useUsageDataStore = create<UsageDataState>()(
    devtools(
        persist(
            (set) => ({
                usageData: null,
                isLoading: false,
                error: null,
                lastUploadDate: null,
                missingColumns: undefined,
                invalidRows: undefined,

                setLoading: (isLoading: boolean) => {
                    set({ isLoading }, false, isLoading ? 'parse/start' : 'parse/end');
                },

                setParseResult: (result: ParseResult<UsageDataRow>) => {
                    if (result.success) {
                        set(
                            {
                                usageData: result.rows,
                                lastUploadDate: new Date().toISOString(),
                                error: result.error || null,
                                invalidRows: invalidRowsErrorResult(result.invalidRows),
                                isLoading: false,
                            },
                            false,
                            'parse/success'
                        );
                    } else {
                        set(
                            {
                                usageData: result.rows || null,
                                error: result.error || 'Failed to parse CSV file.',
                                missingColumns: result.missingColumns,
                                invalidRows: invalidRowsErrorResult(result.invalidRows),
                                isLoading: false,
                            },
                            false,
                            'parse/failure'
                        );
                    }
                },

                clearData: () =>
                    set(
                        {
                            usageData: null,
                            lastUploadDate: null,
                            error: null,
                            missingColumns: undefined,
                            invalidRows: undefined,
                        },
                        false,
                        'data/clear'
                    ),

                setData: (data: UsageDataRow[]) => set({ usageData: data }, false, 'data/set'),
            }),
            {
                name: 'usage-data-storage',
                partialize: (state) => ({
                    usageData: state.usageData,
                    lastUploadDate: state.lastUploadDate,
                }),
            }
        ),
        { name: 'UsageDataStore' }
    )
);